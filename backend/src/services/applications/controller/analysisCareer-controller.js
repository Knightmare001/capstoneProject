import response from "../../../utils/response.js";

function mapJobRole(jobRole) {
  const mapping = {
    software_engineer: 6, // Sesuai dengan label encoding 'Research Scientist' saat training
    data_analyst: 6, // 'Research Scientist'
    digital_marketing: 7, // 'Sales Executive'
    content_creator: 6, // 'Research Scientist'
    sales_executive: 7, // 'Sales Executive'
    sales_representative: 8, // 'Sales Representative'
    admin_hr: 3, // 'Human Resources'
    project_manager: 4, // 'Manager'
  };

  // Jika tidak ditemukan, default ke 6 ('Research Scientist')
  return mapping[jobRole] !== undefined ? mapping[jobRole] : 6;
}

export const checkResignReadiness = async (req, res) => {
  try {
    // 1. Ambil 11 Parameter Murni dari User Frontend
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
      environmentSatisfaction,
    } = req.validated;

    // 2. HITUNG 5 PARAMETER SISA SECARA OTOMATIS DI BACKEND

    // A. Hitung yearsPerCompany
    const numCompanies = Number(numCompaniesWorked);
    const yearsPerCompany = numCompanies > 0 ? Number(totalWorkingYears) / numCompanies : Number(yearsAtCompany);

    // B. Hitung overallSatisfaction (Rata-rata kepuasan)
    const overallSatisfaction = Math.round((Number(jobSatisfaction) + Number(environmentSatisfaction)) / 2);

    // C. Tentukan workLifeBalance otomatis (Skala 1 - 4)
    // Default 3 (Good). Kalau lembur terus dan rumah jauh, kurangi jadi 1 atau 2.
    let workLifeBalance = 3;
    if (overTime === 1) workLifeBalance -= 1;
    // overtime === 1 artinya overtime === yes
    if (Number(distanceFromHome) > 25) workLifeBalance -= 1;
    if (workLifeBalance < 1) workLifeBalance = 1;

    // D. Tentukan burnoutFlag (0 atau 1)
    // Jika lembur DAN kepuasan lingkungan kerja buruk, set jadi 1 (True)
    const burnoutFlag = overTime === 1 && Number(environmentSatisfaction) <= 2 ? 1 : 0;

    // E. Tentukan stagnationIndex (Skala 1 - 4)
    // Semakin lama tidak dipromosikan di peran yang sama, indeks stagnasi naik
    let stagnationIndex = 1;
    if (Number(yearsSinceLastPromotion) >= 3) stagnationIndex = 3;
    if (Number(yearsSinceLastPromotion) >= 5) stagnationIndex = 4;

    // 3. Konversi JobRole populer Indonesia ke standar Dataset IBM AI
    const mappedJobRole = mapJobRole(jobRole);

    // 4. Tembak ke Python Microservice dengan membawa 16 parameter lengkap
    const aiResponse = await fetch(process.env.AI_SERVICE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        monthlyIncome: Number(monthlyIncome),
        jobRole: mappedJobRole,
        overTime,
        distanceFromHome: Number(distanceFromHome),
        totalWorkingYears: Number(totalWorkingYears),
        numCompaniesWorked: Number(numCompaniesWorked),
        yearsAtCompany: Number(yearsAtCompany),
        yearsInCurrentRole: Number(yearsInCurrentRole),
        yearsSinceLastPromotion: Number(yearsSinceLastPromotion),
        jobSatisfaction: Number(jobSatisfaction),
        environmentSatisfaction: Number(environmentSatisfaction),
        // Hasil hitungan backend:
        yearsPerCompany,
        overallSatisfaction,
        workLifeBalance,
        burnoutFlag,
        stagnationIndex,
      }),
    });

    if (!aiResponse.ok) {
      return response(res, 502, "Bad Gateway - AI Service is unreachable", null);
    }

    const aiData = await aiResponse.json();

    return response(res, 200, "AI analysis processed successfully", {
      attritionRisk: aiData.attritionRisk,
      riskLevel: aiData.attritionRisk >= 80 ? "HIGH" : aiData.attritionRisk >= 50 ? "MEDIUM" : "LOW",
      workplaceAnalysis: aiData.isHighRisk
        ? "Terdapat indikasi tekanan kerja dan kecenderungan attrition yang tinggi."
        : "Kondisi kerja relatif stabil.",
      recommendation: aiData.suggestion,
    });
  } catch (error) {
    console.error("Error connecting to AI Microservice:", error.message);
    return response(res, 500, "Internal server error", null);
  }
};
