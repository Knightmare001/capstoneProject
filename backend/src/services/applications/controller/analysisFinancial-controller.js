import response from "../../../utils/response.js";
export const checkFinancialReadiness = async (req, res) => {
  try {
    const {
      monthlySavings,
      monthlyExpenses,
      hasDependents,
      workplaceStressScore,
      //   Variabel workplaceStressScore itu didapat dari nilai attritionRisk yang dihitung dan dikirim oleh server Python FastAPI
    } = req.validated;

    // --- HITUNG FINANCIAL SAFETY ---
    const savings = Number(monthlySavings);
    const expenses = Number(monthlyExpenses);

    const runwayMonths = expenses > 0 ? savings / expenses : 0;
    const safeZone = hasDependents === "Yes" ? 6 : 3;

    let financialSafetyScore = (runwayMonths / safeZone) * 100;
    if (financialSafetyScore > 100) financialSafetyScore = 100;

    // --- HITUNG SKOR KESIAPAN AKHIR (GABUNGAN) ---
    // Rumus: 30% tingkat keparahan kantor + 70% kesiapan modal bertahan hidup
    const finalReadinessScore = Math.round(0.3 * Number(workplaceStressScore) + 0.7 * financialSafetyScore);

    let finalStatus = "BELUM SIAP";
    let finalRecommendation =
      "Kantor Anda memang toxic, tapi tabungan Anda saat ini sangat riskan. Jika resign sekarang, Anda berisiko mengalami masalah finansial dalam waktu dekat. Tahan dulu sambil cari kerja sampingan.";

    if (finalReadinessScore >= 75) {
      finalStatus = "SIAP TOTAL";
      finalRecommendation =
        "Kondisi kantor sudah tidak sehat dan pondasi keuangan Anda sangat kokoh. Anda punya lampu hijau untuk resign dengan aman.";
    } else if (finalReadinessScore >= 50) {
      finalStatus = "PERLU BACKUP PLAN";
      finalRecommendation =
        "Keuangan Anda pas-pasan untuk bertahan hidup. Sangat disarankan untuk tidak resign secara impulsif sebelum mendapatkan kepastian surat kontrak di perusahaan baru.";
    }

    return response(res, 200, "Financial readiness successfully analyzed", {
      finalReadinessScore,
      status: finalStatus,
      recommendation: finalRecommendation,
      financialAnalysis: {
        safetyScore: Math.round(financialSafetyScore),
        runwayMonths: parseFloat(runwayMonths.toFixed(1)),
        isSafe: runwayMonths >= safeZone,
      },
    });
  } catch (error) {
    console.error("Error in checkFinancialReadiness:", error.message);
    return response(res, 500, "Internal server error", null);
  }
};
