from flask import Flask, request, jsonify
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from werkzeug.security import generate_password_hash, check_password_hash
import re
from flask_cors import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(os.getenv('MONGO_URI'))
db = client['AgroNexus']
users_collection = db['users']

@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['firstName', 'city', 'email', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate email format
        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Check if email already exists
        if users_collection.find_one({'email': data['email']}):
            return jsonify({'error': 'Email already registered'}), 400
        
        # Validate password length
        if len(data['password']) < 8:
            return jsonify({'error': 'Password must be at least 8 characters long'}), 400
        
        # Hash password
        hashed_password = generate_password_hash(data['password'])
        
        # Create user document
        user = {
            'firstName': data['firstName'],
            'city': data['city'],
            'email': data['email'],
            'password': hashed_password,
            'newsletter': data.get('newsletter', False)
        }
        
        # Insert user into database
        users_collection.insert_one(user)
        
        return jsonify({'message': 'User created successfully'}), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user by email
        user = users_collection.find_one({'email': data['email']})
        
        # Check if user exists and password is correct
        if user and check_password_hash(user['password'], data['password']):
            # Don't send password in response
            user_data = {
                'firstName': user['firstName'],
                'email': user['email']
            }
            return jsonify({'message': 'Login successful', 'user': user_data}), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 