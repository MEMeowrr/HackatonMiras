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
        return []
    
    
def GetEventsByUserId(user_id):
    try:
        conn = GetConnection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT * FROM event WHERE userId = %s
        """, (user_id,))

        result = cursor.fetchall()

        cursor.close()
        conn.close()
        return result
    
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return []
    
def AssignVehicleToUser(user_id, vehicle_id, distribution_center_id):
    conn = GetConnection()
    cursor = conn.cursor()
    try:
        # Check availability
        cursor.execute("""
            SELECT quantity FROM distributioncenter_vehicles 
            WHERE centerId = %s AND vehicleId = %s
        """, (distribution_center_id, vehicle_id))
        result = cursor.fetchone()

        if not result or result[0] <= 0:
            return False  # No vehicles available

        # Assign vehicle to user
        cursor.execute("UPDATE user SET vehicleId = %s WHERE userId = %s", (vehicle_id, user_id))

        # Update or delete the row in distributioncenter_vehicles
        if result[0] == 1:
            cursor.execute("""
                DELETE FROM distributioncenter_vehicles 
                WHERE centerId = %s AND vehicleId = %s
            """, (distribution_center_id, vehicle_id))
        else:
            cursor.execute("""
                UPDATE distributioncenter_vehicles 
                SET quantity = quantity - 1 
                WHERE centerId = %s AND vehicleId = %s
            """, (distribution_center_id, vehicle_id))

        conn.commit()
        return True
    except Exception as e:
        print(f"Assign error: {e}")
        return False
    finally:
        cursor.close()
        conn.close()


def ReturnVehicleFromUser(user_id, distribution_center_id):
    conn = GetConnection()
    cursor = conn.cursor()
    try:
        # Check if the user has a vehicle
        cursor.execute("SELECT vehicleId FROM user WHERE userId = %s", (user_id,))
        result = cursor.fetchone()
        
        if not result or result[0] is None:
            return False  # User has no vehicle to return

        vehicle_id = result[0]

        # Remove the vehicle from the user
        cursor.execute("UPDATE user SET vehicleId = NULL WHERE userId = %s", (user_id,))

        # Check if the vehicle already exists at the distribution center
        cursor.execute("""
            SELECT quantity FROM distributioncenter_vehicles 
            WHERE centerId = %s AND vehicleId = %s
        """, (distribution_center_id, vehicle_id))
        existing = cursor.fetchone()

        if existing:
            # Increment quantity
            cursor.execute("""
                UPDATE distributioncenter_vehicles 
                SET quantity = quantity + 1 
                WHERE centerId = %s AND vehicleId = %s
            """, (distribution_center_id, vehicle_id))
        else:
            # Add new row
            cursor.execute("""
                INSERT INTO distributioncenter_vehicles (centerId, vehicleId, quantity)
                VALUES (%s, %s, 1)
            """, (distribution_center_id, vehicle_id))

        conn.commit()
        return True
    except Exception as e:
        print(f"Return error: {e}")
        return False
    finally:
        cursor.close()
        conn.close()