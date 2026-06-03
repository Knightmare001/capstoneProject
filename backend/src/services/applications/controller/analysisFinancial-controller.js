import response from "../../../utils/response.js";

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

    const isOfficeToxic = stressScore >= 60;

    if (finalReadinessScore >= 75) {
      finalStatus = "SIAP TOTAL";
      finalRecommendation = isOfficeToxic
        ? "Kondisi kantor sudah tidak sehat dan pondasi keuangan Anda sangat kokoh. Anda punya lampu hijau untuk resign dengan aman."
        : "Keuangan Anda sangat mapan untuk mengambil langkah baru, meskipun kondisi tempat kerja Anda saat ini relatif aman.";
    } else if (finalReadinessScore >= 50) {
      finalStatus = "PERLU BACKUP PLAN";
      finalRecommendation = isOfficeToxic
        ? "Kantor Anda mulai tidak sehat, namun keuangan Anda pas-pasan untuk bertahan hidup. Sangat disarankan tidak resign secara impulsif sebelum mendapatkan kepastian surat kontrak (signed offer) di perusahaan baru."
        : "Kondisi kerja Anda masih oke, dan keuangan Anda cukup stabil. Jika ingin resign untuk pindah jalur karir, siapkan backup plan atau selesaikan dulu masa transisi dengan matang.";
    } else {
      finalStatus = "BELUM SIAP";
      finalRecommendation = isOfficeToxic
        ? "Kantor Anda memang toxic, tapi tabungan Anda saat ini sangat riskan. Jika resign sekarang, Anda berisiko mengalami masalah finansial dalam waktu dekat. Tahan dulu sambil cari kerja sampingan atau apply lowongan baru."
        : "Tahan dulu impuls Anda. Tingkat stres kerja masih wajar dan tabungan Anda belum mencukupi batas aman bertahan hidup tanpa kerjaan tetap.";
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
