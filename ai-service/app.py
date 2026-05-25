# app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import tensorflow as tf
import joblib
import numpy as np

app = FastAPI(title="Resign Aja Dulu - AI Prediction Service")

# Muat Otak AI dan Scaler saat server Python pertama kali dinyala
try:
    trained_model = tf.keras.models.load_model("model_ai.keras")
    real_scaler = joblib.load("scaler_ai.pkl")
    print("✅ Model AI (.keras) dan Scaler (.pkl) berhasil dimuat!")
except Exception as e:
    print(f"❌ Gagal memuat file AI: {str(e)}")

# 2. Definisikan struktur data input (Skema validasi FastAPI)
class EmployeeData(BaseModel):
    features: list

@app.post("/predict")
def predict_resign(input_data: EmployeeData):
    try:
        # Konversi list input dari Express menjadi numpy array
        raw_input = np.array(input_data.features)
        
        # Jalankan translasi skala data menggunakan StandardScaler asli bawaan (.pkl)
        ai_friendly_input = real_scaler.transform(raw_input)
        
        # Lakukan prediksi matematika menggunakan model ANN (.keras)
        raw_prediction = trained_model.predict(ai_friendly_input)
        probability = float(raw_prediction[0][0]) # Ambil nilai desimal probabilitas
        
        # Kembalikan response berwujud JSON object ke Node.js
        return {
            "resign_score": round(probability * 100, 2), # Ubah ke skala 0 - 100%
            "potential_resign": bool(probability >= 0.5)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Prediction Error: {str(e)}")