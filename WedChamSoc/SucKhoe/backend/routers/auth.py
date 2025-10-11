"""
Simple Authentication API routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, validator
from datetime import timedelta
import logging

from database import get_database
from auth_simple import AuthManager, validate_email, validate_password, rate_limiter, get_current_user
from models.user import User, GenderEnum
from temp_token import TempTokenManager
from two_factor_auth import TwoFactorAuth, two_factor_rate_limit
import json

# Logging setup
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(tags=["authentication"])

# Pydantic models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str = None
    
    @validator('password')
    def validate_password_strength(cls, v):
        if not validate_password(v):
            raise ValueError('Password must be at least 6 characters long')
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class TwoFactorRequired(BaseModel):
    status: str = "2fa_required"
    temp_token: str
    message: str = "Two-factor authentication required"

class TwoFactorVerify(BaseModel):
    temp_token: str
    code: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone: str = None
    is_active: bool
    email_verified: bool

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(
    user_data: UserRegister,
    db: Session = Depends(get_database)
):
    """
    Register a new user
    """
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Hash password
        password_hash = AuthManager.get_password_hash(user_data.password)
        
        # Create new user
        new_user = User(
            email=user_data.email,
            password_hash=password_hash,
            full_name=user_data.full_name,
            phone=user_data.phone,
            email_verified=True  # For simplicity, auto-verify
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Create access token
        access_token_expires = timedelta(minutes=30)
        access_token = AuthManager.create_access_token(
            data={"sub": str(new_user.id), "email": new_user.email},
            expires_delta=access_token_expires
        )
        
        logger.info(f"User registered successfully: {new_user.email}")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": new_user.to_dict()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register user"
        )

@router.post("/login")
async def login(
    user_credentials: UserLogin,
    db: Session = Depends(get_database)
):
    """
    Login user - supports 2FA flow
    """
    try:
        logger.info(f"Login attempt for email: {user_credentials.email}")
        # Rate limiting
        if not rate_limiter.is_allowed(user_credentials.email):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many login attempts. Please try again later."
            )
        
        # Find user
        user = db.query(User).filter(User.email == user_credentials.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not AuthManager.verify_password(user_credentials.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is deactivated"
            )
        
        # Reset rate limiting on successful login
        rate_limiter.reset_attempts(user_credentials.email)
        
        # Check if 2FA is enabled
        if user.two_factor_enabled:
            # Create temporary token for 2FA verification
            temp_token = TempTokenManager.create_temp_token(user.id, user.email)
            
            logger.info(f"2FA required for user: {user.email}")
            
            return TwoFactorRequired(
                temp_token=temp_token,
                message="Please enter your 2FA code"
            )
        
        # No 2FA - proceed with normal login
        access_token_expires = timedelta(minutes=30)
        access_token = AuthManager.create_access_token(
            data={"sub": str(user.id), "email": user.email},
            expires_delta=access_token_expires
        )
        
        logger.info(f"User logged in successfully: {user.email}")
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user.to_dict()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error logging in user: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to login"
        )

@router.post("/verify-2fa", response_model=Token)
async def verify_2fa(
    request: TwoFactorVerify,
    db: Session = Depends(get_database)
):
    """
    Verify 2FA code and complete login
    """
    try:
        # Verify temp token
        temp_payload = TempTokenManager.verify_temp_token(request.temp_token)
        if not temp_payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired temporary token"
            )
        
        user_id = int(temp_payload.get("sub"))
        user_email = temp_payload.get("email")
        
        # Get user
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Check rate limiting for 2FA attempts
        if not two_factor_rate_limit.is_allowed(str(user_id)):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many 2FA attempts. Please try again later."
            )
        
        # Verify 2FA code
        success = False
        is_backup_code = False
        
        if user.two_factor_secret:
            # Try TOTP first
            if TwoFactorAuth.verify_totp(user.two_factor_secret, request.code):
                success = True
            # Try backup codes
            elif user.backup_codes_hashed:
                backup_codes_hashed = json.loads(user.backup_codes_hashed)
                backup_index = TwoFactorAuth.verify_backup_code(backup_codes_hashed, request.code)
                if backup_index is not None:
                    success = True
                    is_backup_code = True
                    # Remove used backup code
                    backup_codes_hashed = TwoFactorAuth.remove_backup_code(backup_codes_hashed, backup_index)
                    user.backup_codes_hashed = json.dumps(backup_codes_hashed) if backup_codes_hashed else None
                    db.commit()
        
        # Record attempt
        two_factor_rate_limit.record_attempt(str(user_id), success)
        
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid 2FA code"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=30)
        access_token = AuthManager.create_access_token(
            data={"sub": str(user.id), "email": user.email},
            expires_delta=access_token_expires
        )
        
        logger.info(f"2FA verified successfully for user: {user.email} (backup_code: {is_backup_code})")
        
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user.to_dict()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error verifying 2FA: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify 2FA"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_database)
):
    """
    Get current user information
    """
    try:
        user_id = current_user.get("sub")
        # Convert to int if it's a string
        if isinstance(user_id, str):
            user_id = int(user_id)

        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return UserResponse(**user.to_dict())
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting user info: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user information"
        )

@router.post("/change-password")
async def change_password(
    old_password: str,
    new_password: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_database)
):
    """
    Change user password
    """
    try:
        # Validate new password
        if not validate_password(new_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must be at least 6 characters long"
            )
        
        user_id = current_user.get("sub")
        # Convert to int if it's a string
        if isinstance(user_id, str):
            user_id = int(user_id)

        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify old password
        if not AuthManager.verify_password(old_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Update password
        user.password_hash = AuthManager.get_password_hash(new_password)
        db.commit()
        
        logger.info(f"Password changed for user: {user.email}")
        
        return {"message": "Password changed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error changing password: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to change password"
        )

@router.post("/logout")
async def logout():
    """
    Logout user (client should remove token)
    """
    return {"message": "Logged out successfully"}

@router.get("/health")
async def auth_health():
    """
    Authentication system health check
    """
    from auth_simple import auth_health_check
    return auth_health_check()
