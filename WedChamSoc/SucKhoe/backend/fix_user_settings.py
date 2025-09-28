"""
Fix user_settings table by adding foreign key constraint
"""

import pymysql
from decouple import config
import logging

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DB_HOST = config('DB_HOST', default='localhost')
DB_PORT = config('DB_PORT', default=3307, cast=int)
DB_USER = config('DB_USER', default='root')
DB_PASSWORD = config('DB_PASSWORD', default='Haiduong27@')
DB_NAME = config('DB_NAME', default='elderly_health_db')

def fix_user_settings_table():
    """
    Drop and recreate user_settings table with proper foreign key
    """
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        
        cursor = conn.cursor()
        
        # Drop existing table
        logger.info("Dropping existing user_settings table...")
        cursor.execute("DROP TABLE IF EXISTS user_settings")
        
        # Create new table with foreign key
        logger.info("Creating user_settings table with foreign key...")
        create_table_sql = """
        CREATE TABLE user_settings (
            id INTEGER NOT NULL AUTO_INCREMENT,
            user_id INTEGER NOT NULL,
            setting_key VARCHAR(100) NOT NULL,
            setting_value TEXT,
            created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            INDEX ix_user_settings_id (id),
            INDEX ix_user_settings_user_id (user_id),
            FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE CASCADE
        )
        """
        cursor.execute(create_table_sql)
        
        conn.commit()
        cursor.close()
        conn.close()
        
        logger.info("✅ user_settings table fixed successfully!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Error fixing user_settings table: {e}")
        return False

if __name__ == "__main__":
    logger.info("🔧 Fixing user_settings table...")
    if fix_user_settings_table():
        logger.info("🎉 Migration completed successfully!")
    else:
        logger.error("❌ Migration failed!")
