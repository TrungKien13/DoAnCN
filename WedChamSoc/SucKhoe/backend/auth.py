"""
Authentication module for Elderly Health Support System using Auth0
"""

import jwt
import requests
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from decouple import config
import logging
from functools import wraps
from typing import Optional, Dict, Any
import time

# Logging setup
logger = logging.getLogger(__name__)

# Auth0 Configuration
AUTH0_DOMAIN = config('AUTH0_DOMAIN', default='')
AUTH0_API_AUDIENCE = config('AUTH0_API_AUDIENCE', default='')
AUTH0_ISSUER = config('AUTH0_ISSUER', default=f'https://{AUTH0_DOMAIN}/')
AUTH0_ALGORITHMS = config('AUTH0_ALGORITHMS', default='RS256').split(',')

# Security scheme
security = HTTPBearer()

class Auth0JWTBearer:
    """
    Auth0 JWT Bearer token validator
    """
    
    def __init__(self):
        self.domain = AUTH0_DOMAIN
        self.audience = AUTH0_API_AUDIENCE
        self.issuer = AUTH0_ISSUER
        self.algorithms = AUTH0_ALGORITHMS
        self.jwks_cache = {}
        self.jwks_cache_time = 0
        self.cache_duration = 3600  # 1 hour
    
    def get_jwks(self):
        """
        Get JSON Web Key Set from Auth0
        """
        current_time = time.time()
        
        # Check cache
        if (self.jwks_cache and 
            current_time - self.jwks_cache_time < self.cache_duration):
            return self.jwks_cache
        
        try:
            jwks_url = f"https://{self.domain}/.well-known/jwks.json"
            response = requests.get(jwks_url, timeout=10)
            response.raise_for_status()
            
            self.jwks_cache = response.json()
            self.jwks_cache_time = current_time
            
            logger.info("JWKS retrieved and cached successfully")
            return self.jwks_cache
            
        except requests.RequestException as e:
            logger.error(f"Failed to retrieve JWKS: {e}")
            raise HTTPException(
                status_code=500,
                detail="Unable to retrieve authentication keys"
            )
    
    def get_rsa_key(self, token_header):
        """
        Get RSA key for token verification
        """
        jwks = self.get_jwks()
        
        for key in jwks.get("keys", []):
            if key.get("kid") == token_header.get("kid"):
                return {
                    "kty": key.get("kty"),
                    "kid": key.get("kid"),
                    "use": key.get("use"),
                    "n": key.get("n"),
                    "e": key.get("e")
                }
        
        logger.warning(f"Unable to find RSA key for kid: {token_header.get('kid')}")
        return None
    
    def verify_token(self, token: str) -> Dict[str, Any]:
        """
        Verify JWT token and return payload
        """
        try:
            # Decode token header
            unverified_header = jwt.get_unverified_header(token)
            
            # Get RSA key
            rsa_key = self.get_rsa_key(unverified_header)
            if not rsa_key:
                raise HTTPException(
                    status_code=401,
                    detail="Unable to find appropriate key"
                )
            
            # Construct key for verification
            key = jwt.algorithms.RSAAlgorithm.from_jwk(rsa_key)
            
            # Verify and decode token
            payload = jwt.decode(
                token,
                key,
                algorithms=self.algorithms,
                audience=self.audience,
                issuer=self.issuer
            )
            
            logger.info(f"Token verified successfully for user: {payload.get('sub')}")
            return payload
            
        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired")
            raise HTTPException(
                status_code=401,
                detail="Token has expired"
            )
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {e}")
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )
        except Exception as e:
            logger.error(f"Token verification error: {e}")
            raise HTTPException(
                status_code=401,
                detail="Token verification failed"
            )

# Global Auth0 instance
auth0_bearer = Auth0JWTBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)) -> Dict[str, Any]:
    """
    Dependency to get current authenticated user
    """
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Authorization header is required"
        )
    
    token = credentials.credentials
    return auth0_bearer.verify_token(token)

def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> Optional[Dict[str, Any]]:
    """
    Optional dependency to get current authenticated user
    """
    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        return auth0_bearer.verify_token(token)
    except HTTPException:
        return None

def require_auth(func):
    """
    Decorator to require authentication
    """
    @wraps(func)
    async def wrapper(*args, **kwargs):
        # This decorator is for use with regular functions
        # FastAPI dependencies should be used instead
        return await func(*args, **kwargs)
    return wrapper

def get_user_id(current_user: Dict[str, Any] = Depends(get_current_user)) -> str:
    """
    Extract user ID from Auth0 token
    """
    return current_user.get("sub", "")

def get_user_email(current_user: Dict[str, Any] = Depends(get_current_user)) -> str:
    """
    Extract user email from Auth0 token
    """
    return current_user.get("email", "")

def get_user_permissions(current_user: Dict[str, Any] = Depends(get_current_user)) -> list:
    """
    Extract user permissions from Auth0 token
    """
    return current_user.get("permissions", [])

def has_permission(required_permission: str):
    """
    Check if user has required permission
    """
    def permission_checker(current_user: Dict[str, Any] = Depends(get_current_user)) -> bool:
        user_permissions = get_user_permissions(current_user)
        return required_permission in user_permissions
    
    return permission_checker

class AuthManager:
    """
    Authentication manager for user operations
    """
    
    @staticmethod
    def get_auth0_user_info(access_token: str) -> Dict[str, Any]:
        """
        Get user information from Auth0 Management API
        """
        try:
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            url = f"https://{AUTH0_DOMAIN}/userinfo"
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            return response.json()
            
        except requests.RequestException as e:
            logger.error(f"Failed to get user info from Auth0: {e}")
            raise HTTPException(
                status_code=500,
                detail="Unable to retrieve user information"
            )
    
    @staticmethod
    def create_user_metadata(user_id: str, metadata: Dict[str, Any]) -> bool:
        """
        Update user metadata in Auth0
        """
        # This would require Auth0 Management API token
        # Implementation depends on your Auth0 setup
        logger.info(f"User metadata update requested for {user_id}")
        return True
    
    @staticmethod
    def validate_phone_number(phone: str) -> bool:
        """
        Validate phone number format
        """
        import re
        # Vietnamese phone number pattern
        pattern = r'^(\+84|84|0)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-6|8|9]|9[0-4|6-9])[0-9]{7}$'
        return bool(re.match(pattern, phone))
    
    @staticmethod
    def send_otp_sms(phone: str, otp_code: str) -> bool:
        """
        Send OTP via SMS (integrate with SMS provider)
        """
        # This would integrate with SMS service like Twilio
        logger.info(f"OTP SMS sent to {phone}: {otp_code}")
        return True
    
    @staticmethod
    def verify_otp(phone: str, otp_code: str, stored_otp: str) -> bool:
        """
        Verify OTP code
        """
        return otp_code == stored_otp

# Health check for Auth0 connection
def auth_health_check() -> Dict[str, Any]:
    """
    Check Auth0 connection health
    """
    try:
        # Try to get JWKS
        auth0_bearer.get_jwks()
        return {
            "status": "healthy",
            "auth0_domain": AUTH0_DOMAIN,
            "timestamp": time.time()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": time.time()
        }

# Middleware for request logging
def log_auth_request(request, user_info: Optional[Dict[str, Any]] = None):
    """
    Log authentication requests
    """
    user_id = user_info.get("sub", "anonymous") if user_info else "anonymous"
    logger.info(f"Request from user {user_id}: {request.method} {request.url}")

# Rate limiting (basic implementation)
class RateLimiter:
    """
    Simple rate limiter for API endpoints
    """
    
    def __init__(self):
        self.requests = {}
    
    def is_allowed(self, user_id: str, limit: int = 100, window: int = 3600) -> bool:
        """
        Check if user is within rate limit
        """
        current_time = time.time()
        
        if user_id not in self.requests:
            self.requests[user_id] = []
        
        # Clean old requests
        self.requests[user_id] = [
            req_time for req_time in self.requests[user_id]
            if current_time - req_time < window
        ]
        
        # Check limit
        if len(self.requests[user_id]) >= limit:
            return False
        
        # Add current request
        self.requests[user_id].append(current_time)
        return True

# Global rate limiter instance
rate_limiter = RateLimiter()
