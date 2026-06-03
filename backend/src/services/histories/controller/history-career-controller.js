import CareerHistoryRepository from "../repositories/history-career-repositories.js";
import response from "../../../utils/response.js";

export const saveCareerHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Tangkap semuanya dari req.body yang dikirim frontend
    const newHistory = await CareerHistoryRepository.createHistory({
      userId,
      ...req.validated,
    });

    return response(res, 201, "History saved successfully with form parameters!", newHistory);
  } catch (error) {
    console.error("Error in savePredictionHistory:", error.message);
    return response(res, 500, "Internal server error", null);
  }
};

// Ambil Semua List Data (Internal saja, tidak di-export ke router)
const getAllHistories = async (req, res) => {
  const userId = req.user.id;
  const histories = await CareerHistoryRepository.findByUserId(userId);
  return response(res, 200, "Fetch user histories success", histories);
};

// Ambil Detail Berdasarkan ID (Internal saja, tidak di-export ke router)
const getHistoryDetailById = async (req, res, id) => {
  const userId = req.user.id;
  const careerHistory = await CareerHistoryRepository.findById(id, userId);
  if (!careerHistory) {
    return response(res, 404, "Riwayat karir tidak ditemukan", null);
    // atau pakai middleware error: return next(new NotFoundError("..."));
  }
  return response(res, 200, "Fetch combined user histories success", careerHistory);
};

// CONTROLLER UTAMA YANG DI-EXPORT KE ROUTER
export const getUserHistoriesCareer = async (req, res, next) => {
  try {
    const { id } = req.query;

    // Jika ada query ?id=...,
    if (id) {
      return await getHistoryDetailById(req, res, id);
    }

    // Jika tidak ada query id
    return await getAllHistories(req, res);
  } catch (error) {
    console.error("Error in getUserHistoriesCombined controller:", error.message);
    return response(res, 500, "Internal server error", null);
  }
};
