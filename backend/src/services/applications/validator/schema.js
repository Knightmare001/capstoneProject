// src/services/applications/validator/schema.js
import Joi from "joi";

export const AnalyzeResignPayloadSchema = Joi.object({
  monthlyIncome: Joi.number().positive().required(),
  jobRole: Joi.number().integer().min(0).required(),
  overTime: Joi.number().integer().valid(0, 1).required(),
  distanceFromHome: Joi.number().min(0).required(),
  totalWorkingYears: Joi.number().min(0).required(),
  numCompaniesWorked: Joi.number().integer().min(0).required(),
  yearsAtCompany: Joi.number().min(0).required(),
  yearsInCurrentRole: Joi.number().min(0).required(),
  yearsSinceLastPromotion: Joi.number().min(0).required(),
  jobSatisfaction: Joi.number().integer().min(1).max(4).required(),
  workLifeBalance: Joi.number().integer().min(1).max(4).required(),
  stagnationIndex: Joi.number().min(0).required(),
  burnoutFlag: Joi.number().integer().valid(0, 1).required(),
  yearsPerCompany: Joi.number().min(0).required(),
  overallSatisfaction: Joi.number().min(0).required(),
  environmentSatisfaction: Joi.number().integer().min(1).max(4),
});
