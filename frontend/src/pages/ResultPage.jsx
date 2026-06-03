import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ScoreGauge from "../components/ScoreGauge";
import BaseCard from "../components/BaseCard";
import {
  FiBriefcase,
  FiClock,
  FiMapPin,
  FiTrendingUp,
  FiStar,
  FiActivity,
  FiDollarSign,
  FiChevronRight,
  FiArrowLeft,
  FiLoader,
  FiCheckCircle,
  FiShield,
} from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_BACKEND_SERVICE_URL;

export default function ResultPage() {
  const navigate = useNavigate();
  const [careerResult, setCareerResult] = useState(null);
  const [financialResult, setFinancialResult] = useState(null);
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("analyzeResult");
    if (!stored) {
      navigate("/analyze");
      return;
    }

    const parsed = JSON.parse(stored);

    // Menangkap objek dari properti .data sesuai response API
    const careerData = parsed.data || parsed.result || parsed.careerResult || parsed;

    setCareerResult(careerData);
    setFinancialResult(parsed.financialResult || null);
    setFormData(parsed.formData);
  }, [navigate]);

  const handleSave = async () => {
    if (saving || saved) return;
    setSaving(true);
    try {
      const JOB_ROLE_MAP = {
        software_engineer: 6,
        data_analyst: 6,
        digital_marketing: 7,
        content_creator: 6,
        sales_executive: 7,
        sales_representative: 8,
        admin_hr: 3,
        project_manager: 4,
      };

      // Hitung derived fields dari formData (mirror logika backend)
      const overTime = Number(formData.overTime);
      const distanceFromHome = Number(formData.distanceFromHome);
      const totalWorkingYears = Number(formData.totalWorkingYears);
      const numCompaniesWorked = Number(formData.numCompaniesWorked) || 1;
      const yearsSinceLastPromotion = Number(formData.yearsSinceLastPromotion);
      const jobSatisfaction = Number(formData.jobSatisfaction);
      const environmentSatisfaction = Number(formData.environmentSatisfaction);

      let workLifeBalance = 3;
      if (overTime === 1) workLifeBalance -= 1;
      if (distanceFromHome > 25) workLifeBalance -= 1;
      if (workLifeBalance < 1) workLifeBalance = 1;

      const yearsPerCompany = totalWorkingYears / numCompaniesWorked;
      const overallSatisfaction = (jobSatisfaction + environmentSatisfaction + workLifeBalance) / 3;
      const stagnationIndex = yearsSinceLastPromotion / (totalWorkingYears || 1);
      const burnoutFlag = overTime === 1 && (jobSatisfaction <= 2 || workLifeBalance <= 2) ? 1 : 0;

      const careerPayload = {
        score: careerResult.score,
        riskLevel: careerResult.riskLevel,
        monthlyIncome: formData.monthlyIncome,
        jobRole: JOB_ROLE_MAP[formData.jobRole] ?? 0,
        overTime,
        distanceFromHome,
        totalWorkingYears,
        numCompaniesWorked,
        yearsAtCompany: formData.yearsAtCompany,
        yearsInCurrentRole: formData.yearsInCurrentRole,
        yearsSinceLastPromotion,
        jobSatisfaction,
        environmentSatisfaction,
        workLifeBalance,
        stagnationIndex,
        burnoutFlag,
        yearsPerCompany,
        overallSatisfaction,
        workplaceAnalysis: careerResult.workplaceAnalysis,
        recommendation: careerResult.recommendation,
      };

      // nyiimpan career dulu, ambil historyId dari response
      const careerRes = await fetch(`${BASE_URL}/api/histories/career`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(careerPayload),
      });
      const careerData = await careerRes.json();
      if (!careerRes.ok) {
        setSaveError(careerData.message || "Gagal menyimpan riwayat karier.");
        return;
      }

      //Pakai historyId dari career untuk simpan financial
      const historyId = careerData.data?.id;
      const financialPayload = {
        historyId,
        finalReadinessScore: financialResult.finalReadinessScore,
        monthlySavings: formData.monthlySavings,
        monthlyExpenses: formData.monthlyExpenses,
        monthlyDebtObligations: formData.monthlyDebtObligations ?? 0,
        hasDependents: formData.hasDependents,
        hasHealthInsurance: formData.hasHealthInsurance,
        hasSideHustle: formData.hasSideHustle,
        jobProspectStatus: formData.jobProspectStatus,
        workplaceStressScore: formData.workplaceStressScore ?? careerResult.score,
        // status:                 financialResult.status,
        // recommendation:         financialResult.recommendation,
        // runwayMonths:           financialResult.financialAnalysis?.runwayMonths,
        // safetyScore:            financialResult.financialAnalysis?.safetyScore,
        // isSafe:                 financialResult.financialAnalysis?.isSafe,
      };
      const finRes = await fetch(`${BASE_URL}/api/histories/financial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(financialPayload),
      });
      const finData = await finRes.json();
      if (!finRes.ok) {
        setSaveError(finData.message || "Gagal menyimpan riwayat finansial.");
        return;
      }

      setSaved(true);
      localStorage.removeItem("analyzeResult");
    } catch {
      setSaveError("Gagal terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  if (!careerResult) return null;

  // DATA KARIER
  const score = Math.round(careerResult.score || 0);
  const riskLevel = careerResult.riskLevel || "LOW";
  const workplaceAnalysis = careerResult.workplaceAnalysis || "Belum ada analisis tempat kerja.";
  const careerRecommendation = careerResult.recommendation || "Belum ada saran karier.";

  // DATA FINANSIAL
  const finScore = financialResult?.finalReadinessScore || 0;
  const finRunway = financialResult?.financialAnalysis?.runwayMonths || 0;
  const finRecommendation = financialResult?.recommendation || "Belum ada saran finansial.";

  // Logika Warna Gauge
  const gaugeColor = score >= 70 ? "#EF4444" : score >= 40 ? "#F59E0B" : "#10B981";

  return (
    <main className="min-h-screen bg-background text-text-main flex flex-col font-sans relative">
      {/* Background Blobs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

      {/* NAVBAR */}
      <Navbar />

      <div className="flex-1 flex flex-col items-center py-12 px-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* HEADER SECTION */}
        <div className="text-center mb-10 w-full max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight font-heading mt-2 mb-4">
            Realitas <span className="text-primary">Kariermu</span> Saat Ini
          </h1>
          <p className="text-text-main/60 font-medium leading-relaxed max-w-2xl mx-auto">
            Berikut adalah kalkulasi mengenai kondisimu di kantor saat ini beserta kesiapan finansialmu jika memutuskan
            untuk resign.
          </p>
        </div>

        {/*GAUGE SCORE & ANALISIS TEMPAT KERJA */}
        <div className="w-full flex flex-col items-center mb-14">
          <ScoreGauge
            score={score}
            customColor={gaugeColor}
            title="Tingkat Stres & Potensi Resign"
            statusText={`Status Resign: ${riskLevel}`}
          />

          <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-text-main/50 mb-8">Stress Level</p>

          {/* Analisis Tempat Kerja */}
          <div className="max-w-3xl w-full text-center px-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-primary">
              <h3 className="font-black text-xs uppercase tracking-widest">Analisis Kondisi Kerja</h3>
            </div>
            <p className="text-base font-semibold text-text-main/80 leading-relaxed italic bg-white/40 p-4 rounded-2xl border border-secondary/10">
              "{workplaceAnalysis}"
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 w-full mb-12 items-stretch justify-center">
          {/* 1. REALITAS FINANSIAL */}
          <BaseCard title="Realitas Finansial">
            <div className="flex gap-4 flex-1">
              <div className="flex-1 text-center py-6 bg-background/50 rounded-3xl border border-secondary/10 flex flex-col justify-center">
                <p className="text-4xl font-black text-text-main font-heading mb-1">{finScore}</p>
                <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Skor Finansial</p>
              </div>
              <div className="flex-1 text-center py-6 bg-background/50 rounded-3xl border border-secondary/10 flex flex-col justify-center">
                <p className="text-4xl font-black text-text-main font-heading mb-1">{finRunway}</p>
                <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Bulan Bertahan</p>
              </div>
            </div>
          </BaseCard>

          {/* 2. REKOMENDASI KARIER */}
          <BaseCard title="Saran Karier">
            <div className="flex-1 flex items-start bg-background/40 p-5 rounded-3xl border border-secondary/10">
              <p className="text-[13px] font-semibold text-text-main/70 leading-relaxed italic relative pl-6 before:content-['“'] before:absolute before:left-0 before:-top-1 before:text-3xl before:text-secondary/30 before:italic">
                {careerRecommendation}
              </p>
            </div>
          </BaseCard>

          {/* 3. REKOMENDASI FINANSIAL */}
          <BaseCard title="Saran Finansial">
            <div className="flex-1 flex items-start bg-background/40 p-5 rounded-3xl border border-secondary/10">
              <p className="text-[13px] font-semibold text-text-main/70 leading-relaxed italic relative pl-6 before:content-['“'] before:absolute before:left-0 before:-top-1 before:text-3xl before:text-primary/20 before:italic">
                {finRecommendation}
              </p>
            </div>
          </BaseCard>
        </div>
        {saveError && (
          <div className="bg-danger/10 border border-danger/20 text-danger text-sm text-center p-3 rounded-xl font-bold w-full">
            {saveError}
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-8 border-t border-secondary/10">
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`w-full sm:w-auto px-12 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${
              saved
                ? "bg-white border border-secondary/20 text-success cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90 hover:-translate-y-1 shadow-primary/25"
            }`}
          >
            {saving ? (
              <>
                <FiLoader className="animate-spin" size={16} /> Memproses...
              </>
            ) : saved ? (
              "Tersimpan di Riwayat"
            ) : (
              "Simpan Hasil Analisis"
            )}
          </button>

          <button
            onClick={() => navigate("/analyze")}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-black text-xs bg-white text-text-main hover:bg-secondary/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-secondary/30 hover:-translate-y-1"
          >
            Analisis Ulang
          </button>
        </div>
      </div>
    </main>
  );
}
