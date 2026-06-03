import response from "../../../utils/response.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const checkFinancialReadiness = async (req, res) => {
  try {
    const {
      monthlySavings,
      monthlyExpenses,
      monthlyDebtObligations,
      hasDependents,
      hasHealthInsurance,
      jobProspectStatus, // NO_LEADS, APPLIED_ONLY, INTERVIEW_STAGE, SIGNED_OFFER
      hasSideHustle,
      workplaceStressScore,
    } = req.validated;

    // Definisikan nilai stressScore agar tidak menyebabkan ReferenceError
    const stressScore = Number(workplaceStressScore || 0);

    // Total beban riil bulanan termasuk cicilan/utang
    const totalCommitment = Number(monthlyExpenses) + Number(monthlyDebtObligations);
    const savings = Number(monthlySavings);

    // 1. Hitung ulang runway months berdasarkan total beban nyata
    let runwayMonths = totalCommitment > 0 ? savings / totalCommitment : 0;
    const safeZone = hasDependents === "Yes" ? 6 : 3;

    let financialSafetyScore = (runwayMonths / safeZone) * 100;
    if (financialSafetyScore > 100) financialSafetyScore = 100;

    // Penalti jika tidak punya asuransi kesehatan mandiri (kurangi 10 poin dari financial score)
    if (!hasHealthInsurance && financialSafetyScore > 20) {
      financialSafetyScore -= 10;
    }

    // Pastikan nilai score berupa angka bulat positif dan tidak minus setelah penalti
    financialSafetyScore = Math.max(0, Math.round(financialSafetyScore));

    // 2. Hitung Career Certainty Score (Skor Kepastian Masa Depan) - Bobot Maksimal 100
    let careerCertaintyScore = 0;
    if (jobProspectStatus === "SIGNED_OFFER") careerCertaintyScore = 100;
    else if (jobProspectStatus === "INTERVIEW_STAGE") careerCertaintyScore = 70;
    else if (jobProspectStatus === "APPLIED_ONLY") careerCertaintyScore = 40;
    else careerCertaintyScore = 10;

    // Bonus poin jika punya side hustle/freelance untuk bantalan
    if (hasSideHustle) {
      careerCertaintyScore = Math.min(100, careerCertaintyScore + 15);
    }

    // 3. RUMUS AKHIR GABUNGAN (30% Stres + 50% Finansial + 20% Kepastian Karir)
    const finalReadinessScore = Math.round(0.3 * stressScore + 0.5 * financialSafetyScore + 0.2 * careerCertaintyScore);

    let finalStatus = "BELUM SIAP";
    let finalRecommendation = "";

    const promptAI = `
      Anda adalah Konsultan Karir dan Perencana Keuangan AI. 
      Berikan analisis komprehensif (maksimal 3 kalimat) untuk pengguna yang sedang mempertimbangkan untuk resign dari pekerjaannya berdasarkan data berikut:

      - Status Kesiapan Akhir: ${finalStatus} (Skor Keseluruhan: ${finalReadinessScore}/100)
      - Tingkat Stres/Risiko Burnout Kerja: ${stressScore}% 
      - Skor Keamanan Keuangan: ${financialSafetyScore}/100 (Dana Darurat bertahan: ${runwayMonths.toFixed(1)} bulan, Target aman: ${safeZone} bulan)
      - Kepastian Karir Baru (Job Prospect): ${jobProspectStatus}
      - Memiliki Side Hustle: ${hasSideHustle ? "Ya" : "Tidak"}

      Berikan rekomendasi tindakan nyata yang objektif, empati namun tegas, menyangkut aspek mental kerja dan finansialnya.
    `;

    try {
      const aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptAI,
      });
      finalRecommendation = aiResponse.text.trim();
    } catch (aiError) {
      console.error("Gagal memanggil Gemini API, menggunakan fallback manual:", aiError.message);
      // Fallback logic manual Anda yang lama jika API down
      finalRecommendation =
        stressScore >= 60
          ? "Kantor Anda terindikasi kurang sehat, harap tinjau kembali tabungan Anda sebelum mengambil keputusan resign."
          : "Kondisi keuangan atau stabilitas kerja Anda belum mencapai batas aman untuk resign saat ini.";
    }

    return response(res, 200, "Financial readiness successfully analyzed", {
      finalReadinessScore,
      status: finalStatus,
      recommendation: finalRecommendation,
      financialAnalysis: {
        safetyScore: financialSafetyScore,
        runwayMonths: parseFloat(runwayMonths.toFixed(1)),
        isSafe: runwayMonths >= safeZone,
      },
    });
  } catch (error) {
    console.error("Error in checkFinancialReadiness:", error.message);
    return response(res, 500, "Internal server error", null);
  }
};
