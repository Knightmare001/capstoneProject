// src/services/applications/controller/application-controller.js
import response from "../../../utils/response.js"; // Helper response terpisah milikmu

export const checkResignReadiness = async (req, res) => {
  try {
    //Ambil 16 parameter inputan manusia dari body request
    const {
      monthlyIncome,
      jobRole,
      overTime,
      distanceFromHome,
      totalWorkingYears,
      numCompaniesWorked,
      yearsAtCompany,
      yearsInCurrentRole,
      yearsSinceLastPromotion,
      jobSatisfaction,
      workLifeBalance,
      stagnationIndex,
      burnoutFlag,
      yearsPerCompany,
      overallSatisfaction,
      environmentSatisfaction,
    } = req.validated;

    const humanInput = [
      [
        monthlyIncome,
        jobRole,
        overTime,
        distanceFromHome,
        totalWorkingYears,
        numCompaniesWorked,
        yearsAtCompany,
        yearsInCurrentRole,
        yearsSinceLastPromotion,
        jobSatisfaction,
        workLifeBalance,
        stagnationIndex,
        burnoutFlag,
        yearsPerCompany,
        overallSatisfaction,
        environmentSatisfaction,
      ],
    ];

    //Tembak ke Python Microservice menggunakan native fetch Node.js
    const aiResponse = await fetch(process.env.AI_SERVICE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: humanInput }),
    });

    // Jika server Python sedang mati atau error
    if (!aiResponse.ok) {
      return response(res, 502, "Bad Gateway - AI Service is unreachable", null);
    }

    // Tangkap hasil dari Python: { resign_score: 78.5, potential_resign: true }
    const aiData = await aiResponse.json();

    //Kembalikan response akhir yang seragam ke frontend
    return response(res, 200, "AI analysis processed successfully", {
      score: aiData.resign_score,
      isPotentialResign: aiData.potential_resign,
      suggestion: aiData.potential_resign
        ? "🚨 POTENSI RESIGN TINGGI: Segera jadwalkan sesi perbincangan mendalam dengan pekerja ini!"
        : "✅ PEKERJA SETIA: Pertahankan performa dengan program penghargaan berkala.",
    });
  } catch (error) {
    console.error("Error connecting to AI Microservice:", error.message);
    return response(res, 500, "Internal server error", null);
  }
};
