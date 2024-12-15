import os
import recommender
import pandas as pd
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from distutils.util import strtobool

app = Flask(__name__)
model = None if not recommender.is_model_exists() else recommender.load_model()

def is_token_valid(api_key):
    req_api_key = request.headers \
        .get("Authorization") \
        .split()[1]
    return api_key == req_api_key

@app.route('/train', methods=['POST'])
def train():
    if(not is_token_valid(api_key)):
        return jsonify({"error": "Unauthorized"}), 401
    datas = request.get_json()
    print("Training datas size: ", len(datas))
    
    recommender.train_and_save_model(datas)
    
    global model
    model = recommender.load_model()
    
    return jsonify({"ok": "Training success"}), 200

@app.route('/predict', methods=['POST'])
def get_predictions():
    global model
    if not is_token_valid(api_key):
        return jsonify({"error": "Unauthorized"}), 401
    if model is None:
        return jsonify({"error": "There is no trained model yet"}), 500
    datas = request.get_json()
    if len(datas) == 0:
        return jsonify({"empty dataset": "The request has no data"}), 400
    result = recommender.get_predictions_xgboost(model, datas)
    return jsonify(result.tolist())

load_dotenv()

api_key = os.getenv("API_KEY")
main_api_host = os.getenv("MAIN_API_HOST")
main_api_port = os.getenv("MAIN_API_PORT")
prod = bool(strtobool(os.getenv("PROD", "false")))
port = os.getenv("API_PORT")
host = os.getenv("API_HOST")

if __name__ == '__main__':
    app.run(
        ssl_context=(
            "ssl/recommender_api.pem", 
            "ssl/recommender_api-key.pem"),
        host=host, 
        port=port, 
        debug=not prod)
