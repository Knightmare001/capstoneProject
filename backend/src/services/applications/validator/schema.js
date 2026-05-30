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
    "number.min": "Tabungan tidak boleh minus",
    "any.required": "Tabungan bulanan wajib diisi",
  }),

  monthlyExpenses: Joi.number().min(0).required().messages({
    "number.base": "Pengeluaran bulanan harus berupa angka",
    "number.min": "Pengeluaran tidak boleh minus",
    "any.required": "Pengeluaran bulanan wajib diisi",
  }),

  monthlyDebtObligations: Joi.number().min(0).default(0).messages({
    "number.base": "Cicilan/utang bulanan harus berupa angka",
    "number.min": "Cicilan tidak boleh minus",
  }),

  hasDependents: Joi.string().valid("Yes", "No").required().messages({
    "any.only": "Status tanggungan harus berupa 'Yes' atau 'No'",
    "any.required": "Status tanggungan wajib diisi",
  }),

  hasHealthInsurance: Joi.boolean().default(false).messages({
    "boolean.base": "Status asuransi kesehatan harus berupa boolean (true/false)",
  }),

  jobProspectStatus: Joi.string()
    .valid("NO_LEADS", "APPLIED_ONLY", "INTERVIEW_STAGE", "SIGNED_OFFER")
    .default("NO_LEADS")
    .messages({
      "any.only": "Status prospek kerja harus salah satu dari: NO_LEADS, APPLIED_ONLY, INTERVIEW_STAGE, SIGNED_OFFER",
    }),

  hasSideHustle: Joi.boolean().default(false).messages({
    "boolean.base": "Status side hustle harus berupa boolean (true/false)",
  }),

  workplaceStressScore: Joi.number().min(0).max(100).required().messages({
    "number.base": "Skor stres kerja harus berupa angka",
    "number.min": "Skor stres minimal 0",
    "number.max": "Skor stres maksimal 100",
    "any.required": "Skor stres kerja wajib diisi",
  }),
});

export const CompetencyPayloadSchema = Joi.object({
  // Ekspektasi gaji harus berupa angka dan minimal 0
  minExpectedSalary: Joi.number().min(0).required().messages({
    "number.base": "Minimal gaji harus berupa angka",
    "any.required": "Minimal gaji wajib diisi",
  }),
  maxExpectedSalary: Joi.number().min(0).required().messages({
    "number.base": "Maximal gaji harus berupa angka",
    "any.required": "Maximal gaji wajib diisi",
  }),

  // expectedSalary: Joi.number().required().messages({
  //   "number.base": "Target gaji harus berupa angka",
  //   "any.required": "Target gaji wajib diisi",
  // }),
  // Skill harus berupa array yang berisi teks (string)
  userSkills: Joi.array().items(Joi.string().trim()).required().messages({
    "array.base": "Format skill harus berupa array/daftar teks",
    "any.required": "Daftar skill yang dikuasai wajib dikirim",
  }),
});
