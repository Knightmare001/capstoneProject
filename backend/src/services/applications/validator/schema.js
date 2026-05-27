// src/services/applications/validator/schema.js
import Joi from "joi";

export const AnalysisCareerPayloadSchema = Joi.object({
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
  // workLifeBalance: Joi.number().integer().min(1).max(4).required(),
  // stagnationIndex: Joi.number().min(0).required(),
  // burnoutFlag: Joi.number().integer().valid(0, 1).required(),
  // yearsPerCompany: Joi.number().min(0).required(),
  // overallSatisfaction: Joi.number().min(0).required(),
  environmentSatisfaction: Joi.number().integer().min(1).max(4),
});

export const AnalysisFinancialPayloadSchema = Joi.object({
  monthlySavings: Joi.number().min(0).required().messages({
    "number.base": "Tabungan bulanan harus berupa angka",
    "number.min": "Tabungan bulanan tidak boleh minus",
    "any.required": "Tabungan bulanan wajib diisi",
  }),

  // Validasi pengeluaran bulanan: harus berupa angka positif dan lebih besar dari 0
  monthlyExpenses: Joi.number().positive().required().messages({
    "number.base": "Pengeluaran bulanan harus berupa angka",
    "number.positive": "Pengeluaran bulanan harus lebih besar dari 0",
    "any.required": "Pengeluaran bulanan wajib diisi",
  }),

  // Validasi tanggungan: hanya menerima string 'Yes' atau 'No' sesuai kondisi UI kamu
  hasDependents: Joi.string().valid("Yes", "No").required().messages({
    "any.only": 'Status tanggungan harus berupa "Yes" atau "No"',
    "any.required": "Status tanggungan wajib diisi",
  }),

  // Validasi skor stres yang dioper balik oleh React State dari Route Tahap 1
  workplaceStressScore: Joi.number().min(0).max(100).required().messages({
    "number.base": "Skor stres kerja harus berupa angka",
    "number.min": "Skor stres kerja minimal 0",
    "number.max": "Skor stres kerja maksimal 100",
    "any.required": "Skor stres kerja dari tahap sebelumnya wajib dikirim balik",
  }),
});
