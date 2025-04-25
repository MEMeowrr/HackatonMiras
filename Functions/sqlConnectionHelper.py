from dotenv import load_dotenv
import os
import mysql.connector

load_dotenv() #load .env information

#Establish a connection with the database
def GetConnection():
    return mysql.connector.connect(
        host="localhost",
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DB")
    )

def TestConnection():
    try:
        conn = GetConnection()
        conn.ping(reconnect=True)
        conn.close()
        return True
    except Exception as e:
        print("❌ Connection failed:", e)
        return False