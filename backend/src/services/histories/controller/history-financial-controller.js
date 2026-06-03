import FinancialHistoryRepository from "../repositories/history-financial-repositoreis.js";
import { getUserHistoriesCareer } from "./history-career-controller.js";
import CareerHistoryRepository from "../repositories/history-career-repositories.js";
import response from "../../../utils/response.js";

export const saveFinancialHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const newHistory = await FinancialHistoryRepository.createFinancialAnalysis({
      userId, 
      ...req.validated, 
    });

    return response(res, 201, "Financial history saved successfully!", newHistory);
  } catch (error) {
    console.error("Error in saveFinancialHistory:", error.message);
    return response(res, 500, "Internal server error", null);
  }
};

const getAllFinancialHistories = async (req, res) => {
  const userId = req.user.id;
  // Mengambil semua data finansial khusus milik user yang sedang login
  const histories = await FinancialHistoryRepository.findByUserId(userId); 
  return response(res, 200, "Fetch all user financial histories success", histories);
};

const getFinancialDetailByCareerId = async (req, res, careerId) => {
  const financialHistory = await FinancialHistoryRepository.findByCareerId(careerId);

  if (!financialHistory) {
    return response(res, 404, "Financial history not found for this career session", null);
  }

  // Ambil data karier pasangannya untuk digabungkan
  const careerHistory = await CareerHistoryRepository.findById(financialHistory.career_history_id || careerId);

  return response(res, 200, "Fetch combined user histories success", {
    career_analysis: careerHistory,
    financial_analysis: financialHistory,
  });
};

export const getUserHistoriesFinancial = async (req, res) => {
  try {
    const { id } = req.query;

    if (id) {
      return await getFinancialDetailByCareerId(req, res, id);
    }

    return await getAllFinancialHistories(req, res);
  } catch (error) {
    console.error("Error in getUserHistoriesFinancial controller:", error.message);
    return response(res, 500, "Internal server error", null);
  }
};
