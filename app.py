from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from werkzeug.security import generate_password_hash, check_password_hash
import re
from flask_cors import CORS
import pickle
import numpy as np
import matplotlib.pylab as plt
from skimage.transform import resize
from datetime import datetime
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from PIL import Image
import json
from io import BytesIO
from tensorflow.keras.initializers import GlorotUniform, Zeros
from tensorflow.keras.utils import get_custom_objects
from plantheight import calculate_plant_height


#Importing models
with open('models/wheat_price_prediction.pkl', 'rb') as Wheat:
    model1 = pickle.load(Wheat)
with open('models/Cotton_price_prediction.pkl', 'rb') as Cotton:
    model2 = pickle.load(Cotton)
with open('models/Gram_price_prediction.pkl', 'rb') as Gram:
    model3 = pickle.load(Gram)
with open('models/Jute_price_prediction.pkl', 'rb') as Jute:
    model4 = pickle.load(Jute)
with open('models/Maize_price_prediction.pkl', 'rb') as Maize:
    model5 = pickle.load(Maize)
with open('models/Moong_price_prediction.pkl', 'rb') as Moong:
    model6 = pickle.load(Moong)
with open('models/Crop_Recommendation.pkl', 'rb') as cr:
    model7 = pickle.load(cr)
# Load model and categories
model = load_model("models/plant_disease_detection.h5")
with open("categories.json") as f:
    categories = json.load(f)
labels = list(categories.keys())


# Image size used during training
IMAGE_SIZE = (224, 224)

# Load environment variables
load_dotenv()


app = Flask(__name__)
CORS(app)

# Custom deserialization workaround


# MongoDB connection
client = MongoClient(os.getenv('MONGO_URI'))
db = client['AgroNexus']
users_collection = db['users']

# Page Routes
@app.route('/')
def landing():
    return render_template('landingPage.html')

@app.route('/signup')
def signup_page():
    return render_template('signup.html')

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/home')
def home_page():
    return render_template('home.html')

# API Routes
@app.route('/api/signup', methods=['POST'])
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

@app.route('/api/login', methods=['POST'])
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

@app.route('/predict_price', methods=['GET', 'POST'])
def predict_price():
    price=None
    if request.method=='POST':
        # Get the full date string from the form (e.g., "2025-04-10")
        crop = request.form['crop']
        date_str = request.form['date']
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        # Extract month and year
        month = date_obj.month
        year = date_obj.year
        rainfall = float(request.form.get('rainfall'))
        features = np.array([[month, year, rainfall]])
        if crop=="Wheat":
            price = model1.predict(features)[0]
        elif crop=="Cotton":
            price = model2.predict(features)[0]
        elif crop=="Gram":
            price = model3.predict(features)[0]
        elif crop=="Jute":
            price = model4.predict(features)[0]
        elif crop=="Maize":
            price = model5.predict(features)[0]
        elif crop=="Moong":
            price = model6.predict(features)[0]
        return render_template('price.html', price = price)
    return render_template('price.html', price=price)

@app.route('/crop_rec', methods=['GET','POST'])
def crop_rec():
    crop_mapping = {
    0: 'apple',
    1: 'banana',
    2: 'blackgram',
    3: 'chickpea',
    4: 'coconut',
    5: 'coffee',
    6: 'cotton',
    7: 'grapes',
    8: 'jute',
    9: 'kidneybeans',
    10: 'lentil',
    11: 'maize',
    12: 'mango',
    13: 'mothbeans',
    14: 'mungbean',
    15: 'muskmelon',
    16: 'orange',
    17: 'papaya',
    18: 'pigeonpeas',
    19: 'pomegranate',
    20: 'rice',
    21: 'watermelon'
}

    crop = None
    if request.method=='POST':
        n = request.form['nitrogen']
        p = request.form['phosphorus']
        k = request.form['potassium']
        t = request.form['temperature']
        h = request.form['humidity']
        ph = request.form['ph']
        r = request.form['rainfall']
        features = np.array([[n, p, k, t, h, ph, r]])
        crop = crop_mapping[model7.predict(features)[0]]
        return render_template('crop_recom.html', crop=crop)
    return render_template('crop_recom.html', crop=crop)

@app.route('/disease_detect', methods=['POST','GET'])
def disease_detect():
    predicted_label=None
    confidence=None
    if request.method=='POST':
        file = request.files['image']
        if file:
            # Read image in-memory
            img = Image.open(BytesIO(file.read())).convert("RGB")
            img = img.resize(IMAGE_SIZE)
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0) / 255.0

            prediction = model.predict(img_array)[0]
            predicted_label = labels[np.argmax(prediction)]
            confidence = round(100 * np.max(prediction), 2)
            print(prediction, predicted_label, confidence)
            return render_template('disease.html', disease=predicted_label, accuracy_score=confidence)
    return render_template('disease.html', disease=predicted_label, accuracy_score=confidence)

@app.route('/height', methods=['GET', 'POST'])
def height():
    if request.method == 'POST':
        file = request.files.get('image')
        if not file:
            return "No file uploaded"

        result = calculate_plant_height(file)
        if "error" in result:
            return result["error"]

        return render_template('height.html', height=result["height"], image=result["image_base64"])
    return render_template('height.html')

if __name__=='__main__':
    app.run(debug=True)