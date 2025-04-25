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
    
def GetAllPoints():
    conn = GetConnection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM point")
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

def InsertEvent(event_type, creationdate, expectedtime, couriers, completed, foodId):
    try:
        conn = GetConnection()
        cursor = conn.cursor()

        # SQL query to insert an event
        cursor.execute("""
            INSERT INTO event (type, creationdate, expectedtime, couriers, completed, foodId)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (event_type, creationdate, expectedtime, couriers, completed, foodId))

        # Commit changes
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        print(f"Error: {err}")

def InsertUser(name, email, password, address, phone_number):
    try:
        conn = GetConnection()
        cursor = conn.cursor()

        # SQL query to insert the user
        cursor.execute("""
            INSERT INTO user (name, email, password, address, phone_number)
            VALUES (%s, %s, %s, %s, %s)
        """, (name, email, password, address, phone_number))

        # Commit changes
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        print(f"Error: {err}")

def ValidateLogin(email, password):
    try:
        conn = GetConnection()
        cursor = conn.cursor()

        # Fetch user with matching email
        cursor.execute("SELECT password FROM user WHERE email = %s", (email,))
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        if result and result[0] == password:
            return True
        else:
            return False

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return False
    
def UpdateUserType(email, user_type):
    try:
        conn = GetConnection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE user SET type = %s WHERE email = %s
        """, (user_type, email))

        conn.commit()
        updated_rows = cursor.rowcount
        cursor.close()
        conn.close()

        return updated_rows > 0

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return False