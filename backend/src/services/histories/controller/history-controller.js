import HistoryRepository from "../repositories/history-repositories.js";
import response from "../../../utils/response.js";

export const savePredictionHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Tangkap semuanya dari req.body yang dikirim frontend
    const newHistory = await HistoryRepository.createHistory({
      userId,
      ...req.body,
    });

    return response(res, 201, "History saved successfully with form parameters!", newHistory);
  } catch (error) {
    console.error("Error in savePredictionHistory:", error.message);
    return response(res, 500, "Internal server error", null);
  }
};

export const getUserHistories = async (req, res) => {
  try {
    // ID didapatkan dari middleware authenticateToken
    const userId = req.user.id;

    // Ambil list data dari PostgreSQL melalui repository
    const histories = await HistoryRepository.findByUserId(userId);

    // Kembalikan response sukses beserta datanya ke frontend
    return response(res, 200, "Fetch user histories success", histories);
  } catch (error) {
    console.error("Error in getUserHistories controller:", error.message);
    return response(res, 500, "Internal server error", null);
  }
};
