from dotenv import load_dotenv
import os
import mysql.connector
import random

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

def InsertEvent(event_type, creationdate, expectedtime, couriers, completed, foodId, vehicleId):
    try:
        conn = GetConnection()
        cursor = conn.cursor()

        # SQL query to insert an event
        cursor.execute("""
            INSERT INTO event (type, creationdate, expectedtime, couriers, completed, foodId, vehicleId)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (event_type, creationdate, expectedtime, couriers, completed, foodId, vehicleId))

        # Commit changes
        conn.commit()
        cursor.close()
        conn.close()
    except mysql.connector.Error as err:
        print(f"Error: {err}")

def InsertUser(name, email, password, address, phone_number, center_id):
    try:
        conn = GetConnection()
        cursor = conn.cursor()

        # SQL query to insert the user
        cursor.execute("""
            INSERT INTO user (name, email, password, address, phone_number, centerId)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (name, email, password, address, phone_number, center_id))

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

def GetAvailableEventsByDistributionCenter(user_id):
    conn = GetConnection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Fetch food info
        cursor.execute("SELECT foodId, name FROM food")
        foods = cursor.fetchall()
        food_map = {food['foodId']: food['name'] for food in foods}

        # Get user's center and vehicle
        cursor.execute("""
            SELECT u.centerId, u.vehicleId
            FROM user u
            WHERE u.userId = %s
        """, (user_id,))
        user_info = cursor.fetchone()
        print("User Info:", user_info)

        if not user_info or not user_info['centerId']:
            return []

        center_id = user_info['centerId']
        user_vehicle_id = user_info['vehicleId']

        # Get all unassigned events
        cursor.execute("""
            SELECT e.eventId, e.address, e.type, e.foodId, e.vehicleId AS requiredVehicleId, v.type AS requiredVehicleType, e.centerId AS eventCenterId
            FROM event e
            JOIN vehicles v ON e.vehicleId = v.vehicleId
            WHERE e.userId IS NULL
        """)
        events = cursor.fetchall()
        print("Events:", events)

        available_events = []
        unavailable_events = []

        for event in events:
            required_vehicle_id = event['requiredVehicleId']
            event_center_id = event['eventCenterId']

            # Skip if not same center
            if event_center_id != center_id:
                print(f"Event {event['eventId']} skipped (wrong center)")
                continue

            food_name = food_map.get(event['foodId'], "Unknown")
            event_data = {
                'eventId': event['eventId'],
                'eventAddress': event['address'],
                'type': event['type'],
                'food': food_name,
                'quantity': random.randint(1, 30),
                'vehicleType': event['requiredVehicleType'],
            }

            has_correct_vehicle = False
            needs_new_vehicle = False

            # FIRST: check if user has correct vehicle
            if user_vehicle_id == required_vehicle_id:
                has_correct_vehicle = True
            elif required_vehicle_id == 3 and user_vehicle_id == 2:
                # Special case: Big (2) can do Small (3)
                has_correct_vehicle = True
            else:
                has_correct_vehicle = False

            if has_correct_vehicle:
                event_data['requiresNewVehicle'] = False
                available_events.append(event_data)
                print(f"Event {event['eventId']} available (user vehicle matches)")
                continue  # No need to check center if user vehicle matches

            # SECOND: check if center has correct vehicle
            # First check exact match
            cursor.execute("""
                SELECT quantity FROM distributioncenter_vehicles
                WHERE centerId = %s AND vehicleId = %s
            """, (center_id, required_vehicle_id))
            vehicle_info = cursor.fetchone()

            if vehicle_info and vehicle_info['quantity'] > 0:
                needs_new_vehicle = True
            elif required_vehicle_id == 3:
                # Special case: check if Big available for Small
                cursor.execute("""
                    SELECT quantity FROM distributioncenter_vehicles
                    WHERE centerId = %s AND vehicleId = 2
                """, (center_id,))
                big_vehicle_info = cursor.fetchone()
                if big_vehicle_info and big_vehicle_info['quantity'] > 0:
                    needs_new_vehicle = True

            if needs_new_vehicle:
                event_data['requiresNewVehicle'] = True
                available_events.append(event_data)
                print(f"Event {event['eventId']} available (needs new vehicle)")
            else:
                unavailable_events.append(event_data)
                print(f"Event {event['eventId']} unavailable (no vehicle match)")

        print("Available Events:", available_events)
        print("Unavailable Events:", unavailable_events)

        return {'availableEvents': available_events, 'unavailableEvents': unavailable_events}

    except Exception as e:
        print(f"GetAvailableEventsByDistributionCenter error: {e}")
        return []
    finally:
        cursor.close()
        conn.close()