from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
import joblib
import numpy as np

app = FastAPI()

# Load model & scaler sekali saja saat server start
model = tf.keras.models.load_model("model_ai.keras")
scaler = joblib.load("scaler_ai.pkl")

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

    scaled_input = scaler.transform(human_input)

    prediction = model.predict(scaled_input)

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