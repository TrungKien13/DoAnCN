"""
Drop user_settings table to force recreation with foreign key
"""

from database import engine
from sqlalchemy import text

def drop_user_settings():
    """Drop user_settings table"""
    try:
        with engine.connect() as conn:
            conn.execute(text("DROP TABLE IF EXISTS user_settings"))
            conn.commit()
            print("✅ user_settings table dropped successfully!")
            return True
    except Exception as e:
        print(f"❌ Error dropping table: {e}")
        return False

if __name__ == "__main__":
    print("🗑️ Dropping user_settings table...")
    drop_user_settings()
