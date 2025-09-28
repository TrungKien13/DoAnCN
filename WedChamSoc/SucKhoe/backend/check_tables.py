"""
Check MySQL tables created
"""

import pymysql
from decouple import config

# Database configuration
DB_HOST = config('DB_HOST', default='localhost')
DB_PORT = config('DB_PORT', default=3307, cast=int)
DB_USER = config('DB_USER', default='root')
DB_PASSWORD = config('DB_PASSWORD', default='Haiduong27@')
DB_NAME = config('DB_NAME', default='elderly_health_db')

try:
    conn = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    
    cursor = conn.cursor()
    cursor.execute('SHOW TABLES')
    tables = cursor.fetchall()
    
    print("🗄️ MySQL Database: elderly_health_db")
    print("📋 Tables created:")
    for table in tables:
        print(f"  ✅ {table[0]}")
    
    print(f"\n📊 Total tables: {len(tables)}")
    
    # Check a sample table structure
    cursor.execute('DESCRIBE users')
    columns = cursor.fetchall()
    print(f"\n👤 Users table structure:")
    for col in columns:
        print(f"  - {col[0]} ({col[1]})")
    
    conn.close()
    print("\n🎉 MySQL database setup completed successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
