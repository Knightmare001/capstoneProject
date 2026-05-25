// src/services/histories/validator/schema.js
import Joi from "joi";

export const SaveHistoryPayloadSchema = Joi.object({
  // 1. Validasi untuk Output AI
  score: Joi.number().min(0).max(100).required(),
  isPotentialResign: Joi.boolean().required(),
  suggestion: Joi.string().required(),

  // 2. Validasi untuk 16 Parameter Input User
  monthlyIncome: Joi.number().positive().required(),
  jobRole: Joi.number().integer().min(0).required(),
  overTime: Joi.number().integer().valid(0, 1).required(), // 0 = No, 1 = Yes
  distanceFromHome: Joi.number().min(0).required(),
  totalWorkingYears: Joi.number().min(0).required(),
  numCompaniesWorked: Joi.number().integer().min(0).required(),
  yearsAtCompany: Joi.number().min(0).required(),
  yearsInCurrentRole: Joi.number().min(0).required(),
  yearsSinceLastPromotion: Joi.number().min(0).required(),
  jobSatisfaction: Joi.number().integer().min(1).max(4).required(), // Skala 1-4
  workLifeBalance: Joi.number().integer().min(1).max(4).required(), // Skala 1-4
  stagnationIndex: Joi.number().min(0).required(),
  burnoutFlag: Joi.number().integer().valid(0, 1).required(), // 0 = No, 1 = Yes
  yearsPerCompany: Joi.number().min(0).required(),
  overallSatisfaction: Joi.number().min(0).required(),
  environmentSatisfaction: Joi.number().integer().min(1).max(4).required(), // Skala 1-4
});
