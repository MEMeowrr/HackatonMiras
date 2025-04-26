from flask import Flask, request, jsonify
import sqlConnectionHelper  # Import your custom database helper file
from flask_cors import CORS  # <-- Import it

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"])

# Endpoint to insert an event
@app.route('/insert_event', methods=['POST'])
def insert_event():
    try:
        data = request.get_json()  # Get JSON data from the request body

        # Extract data from the JSON object
        event_type = data.get('type')
        creationdate = data.get('creationdate')
        expectedtime = data.get('expectedtime')
        couriers = data.get('couriers')
        completed = data.get('completed')
        foodId = data.get('foodId')

        # Call your insert_event function from sqlConnectionHelper
        sqlConnectionHelper.InsertEvent(event_type, creationdate, expectedtime, couriers, completed, foodId)

        return jsonify({"message": "Event inserted successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Endpoint to sign up a user
@app.route('/signup', methods=['POST'])
def signup():
    try:
        # Get JSON data from the request body
        data = request.get_json()

        # Extract the user details from the request
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        email = data.get('email')
        password = data.get('password')
        street_name = data.get('streetName')
        street_number = data.get('streetNumber')
        phone_number = data.get('phoneNumber')

        # Combine first and last name into one column
        name = f"{first_name} {last_name}"

        # Combine street name and street number into one address column
        address = f"{street_name} {street_number}"

        # Call your insert_user function from sqlConnectionHelper to save the user to the database
        sqlConnectionHelper.InsertUser(name, email, password, address, phone_number)

        return jsonify({"message": "User signed up successfully!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Check if the user exists and the password matches
        if sqlConnectionHelper.ValidateLogin(email, password):
            return jsonify({"success": True}), 200
        else:
            return jsonify({"success": False}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/set_user_type', methods=['POST'])
def set_user_type():
    try:
        data = request.get_json()
        email = data.get('email')
        user_type = data.get('type')

        if not email or not user_type:
            return jsonify({"error": "Missing email or type"}), 400

        # Call helper function to update type
        success = sqlConnectionHelper.UpdateUserType(email, user_type)

        if success:
            return jsonify({"message": "User type updated successfully"}), 200
        else:
            return jsonify({"error": "User not found or failed to update"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)