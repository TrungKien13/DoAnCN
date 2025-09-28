"""
Script to create MySQL database for Elderly Health Support System
"""

import pymysql
from decouple import config
import logging

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration from .env
DB_HOST = config('DB_HOST', default='localhost')
DB_PORT = config('DB_PORT', default=3307, cast=int)
DB_USER = config('DB_USER', default='root')
DB_PASSWORD = config('DB_PASSWORD', default='Haiduong27@')
DB_NAME = config('DB_NAME', default='elderly_health_db')

def create_database():
    """
    Create MySQL database if it doesn't exist
    """
    try:
        # Connect to MySQL server (without specifying database)
        connection = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            # Create database if not exists
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{DB_NAME}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            logger.info(f"✅ Database '{DB_NAME}' created successfully or already exists")
            
            # Show databases to confirm
            cursor.execute("SHOW DATABASES")
            databases = cursor.fetchall()
            logger.info(f"📋 Available databases: {[db[0] for db in databases]}")
            
        connection.commit()
        connection.close()
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Error creating database: {e}")
        return False

def test_connection():
    """
    Test connection to the created database
    """
    try:
        # Connect to the specific database
        connection = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            logger.info(f"✅ Connected to MySQL version: {version[0]}")
            
            cursor.execute("SELECT DATABASE()")
            current_db = cursor.fetchone()
            logger.info(f"✅ Current database: {current_db[0]}")
            
        connection.close()
        return True
        
    except Exception as e:
        logger.error(f"❌ Error testing connection: {e}")
        return False

if __name__ == "__main__":
    logger.info("🚀 Creating MySQL database for Elderly Health Support System...")
    logger.info(f"📍 Host: {DB_HOST}:{DB_PORT}")
    logger.info(f"👤 User: {DB_USER}")
    logger.info(f"🗄️ Database: {DB_NAME}")
    
    # Create database
    if create_database():
        logger.info("✅ Database creation completed")
        
        # Test connection
        if test_connection():
            logger.info("✅ Database connection test passed")
            logger.info("🎉 Ready to run the application!")
        else:
            logger.error("❌ Database connection test failed")
    else:
        logger.error("❌ Database creation failed")
