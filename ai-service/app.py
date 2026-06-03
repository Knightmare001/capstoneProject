from fastapi import FastAPI
from pydantic import BaseModel
import ai_edge_litert.interpreter as tflite  # Nama import yang benar untuk Windows saat ini
import joblib
import numpy as np

app = FastAPI()

# 1. Load Scaler
scaler = joblib.load("scaler_ai.pkl")

# 2. Load Model TFLite & Alokasikan Tensor (Sangat hemat RAM)
interpreter = tflite.Interpreter(model_path="model_ai.tflite")
interpreter.allocate_tensors()

# Ambil detail input dan output layer dari model
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Schema request
class PredictionInput(BaseModel):
    monthlyIncome: float
    jobRole: int
    overTime: int
    distanceFromHome: int
    totalWorkingYears: int
    numCompaniesWorked: int
    yearsAtCompany: int
    yearsInCurrentRole: int
    yearsSinceLastPromotion: int
    jobSatisfaction: int
    workLifeBalance: int
    stagnationIndex: float
    burnoutFlag: int
    yearsPerCompany: float
    overallSatisfaction: float
    environmentSatisfaction: int

@app.post("/predict")
def predict(data: PredictionInput):

    human_input = [[
        data.monthlyIncome,
        data.jobRole,
        data.overTime,
        data.distanceFromHome,
        data.totalWorkingYears,
        data.numCompaniesWorked,
        data.yearsAtCompany,
        data.yearsInCurrentRole,
        data.yearsSinceLastPromotion,
        data.jobSatisfaction,
        data.workLifeBalance,
        data.stagnationIndex,
        data.burnoutFlag,
        data.yearsPerCompany,
        data.overallSatisfaction,
        data.environmentSatisfaction
    ]]

    # Lakukan scaling data
    scaled_input = scaler.transform(human_input)
    
    # Pastikan tipe datanya float32 agar sesuai dengan standar TFLite
    scaled_input = np.array(scaled_input, dtype=np.float32)

    # 3. Proses Prediksi menggunakan TFLite Interpreter
    interpreter.set_tensor(input_details[0]['index'], scaled_input)
    interpreter.invoke()
    prediction = interpreter.get_tensor(output_details[0]['index'])

    # Ambil nilai probabilitas hasil prediksi
    probability = float(prediction[0][0])
    attrition_score = round(probability * 100, 2)

    # Recommendation logic
    if attrition_score >= 80:
        suggestion = "Risiko attrition sangat tinggi. Disarankan mengevaluasi kondisi kerja dan kesiapan karier."
    elif attrition_score >= 50:
        suggestion = "Terdapat indikasi ketidakpuasan kerja. Pertimbangkan evaluasi work-life balance."
    else:
        suggestion = "Kondisi kerja relatif stabil."

    return {
        "attritionRisk": attrition_score,
        "isHighRisk": probability >= 0.5,
        "suggestion": suggestion
    }