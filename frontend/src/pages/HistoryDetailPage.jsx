import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiLoader,
  FiAlertTriangle,
  FiClock,
  FiBriefcase,
  FiDollarSign,
  FiActivity,
  FiUser,
  FiShield,
  FiTrendingUp,
  FiRefreshCw,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import ScoreGauge from "../components/ScoreGauge";
import BaseCard from "../components/BaseCard";

const BASE_URL = import.meta.env.VITE_BACKEND_SERVICE_URL;

const JOB_ROLE_LABELS = {
  0: "Software Engineer",
  1: "Data Analyst",
  2: "Digital Marketing",
  3: "Content Creator",
  4: "Sales Executive",
  5: "Sales Representative",
  6: "Admin / HR",
  7: "Project Manager",
};

// Diubah menggunakan Flexbox penuh agar responsif
function DetailChip({ label, value, icon }) {
  return (
    <div className="flex-1 min-w-[140px] sm:min-w-[180px] bg-background/60 border border-secondary/10 rounded-2xl p-4 flex flex-col gap-1 transition-all hover:bg-white hover:border-secondary/20 shadow-sm shadow-secondary/5">
      <div className="flex items-center gap-1.5 text-text-main/40">
        {icon && <span className="text-[10px]">{icon}</span>}
        <p className="text-[9px] font-black uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-sm font-bold text-text-main">{value ?? "-"}</p>
    </div>
  );
}

export default function HistoryDetailPage() {
  const navigate = useNavigate();
  const { careerId } = useParams();

  const [career, setCareer] = useState(null);
  const [financial, setFin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // Optimasi: Fetch API Karier dan Finansial secara bersamaan
        const [careerRes, finRes] = await Promise.all([
          fetch(`${BASE_URL}/api/histories/career?id=${careerId}`, { credentials: "include" }),
          fetch(`${BASE_URL}/api/histories/financial?id=${careerId}`, { credentials: "include" }),
        ]);

        if (careerRes.status === 401) {
          navigate("/login");
          return;
        }

        const careerData = await careerRes.json();
        if (!careerRes.ok) throw new Error(careerData.message);
        setCareer(careerData.data);

        if (finRes.ok) {
          const finData = await finRes.json();
          setFin(finData.data?.financial_analysis || finData.data || null);
        }
      } catch (err) {
        setError(err.message || "Gagal memuat detail riwayat.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [careerId, navigate]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  };

  const formatRupiah = (val) => (val ? `Rp ${Number(val).toLocaleString("id-ID")}` : "-");

  if (loading)
    return (
      <main className="min-h-screen bg-background flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <FiLoader size={40} className="text-primary animate-spin" />
          <p className="text-sm font-black uppercase tracking-widest text-text-main/50">Membongkar Arsip...</p>
        </div>
      </main>
    );

  if (error)
    return (
      <main className="min-h-screen bg-background flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <FiAlertTriangle size={48} className="text-primary" />
          <p className="font-bold text-text-main text-lg">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 text-primary font-bold text-sm uppercase tracking-widest hover:underline"
          >
            Kembali ke Profil
          </button>
        </div>
      </main>
    );

  if (!career) return null;

  const score = Number(career.score);

  // Fallback untuk antisipasi property penamaan snake_case atau camelCase dari backend
  const finScore = Number(financial?.final_readiness_score || financial?.finalReadinessScore || 0);
  const finRunway = financial?.runway_months || financial?.runwayMonths || "-";
  const gaugeColor = finScore >= 70 ? "#10B981" : finScore >= 40 ? "#F59E0B" : "#EF4444";

  const prospectLabel = {
    NO_LEADS: "Belum Ada Bayangan",
    APPLIED_ONLY: "Sudah Melamar",
    INTERVIEW_STAGE: "Tahap Interview",
    SIGNED_OFFER: "Sudah Ttd Kontrak",
  };

  return (
    <main className="min-h-screen bg-background text-text-main flex flex-col font-sans relative overflow-x-hidden pb-12">
      <div className="absolute top-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <Navbar />

      <div className="flex-1 flex flex-col items-center py-12 px-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="text-center mb-12 w-full max-w-3xl">
          <span className="  text-text-main/60 px-4 py-1.5  text-[10px] font-black uppercase tracking-widest mb-4 inline-flex items-center gap-2">
            {formatDate(career.created_at)}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight font-heading mt-2 mb-4">
            Arsip <span className="text-primary">Kariermu</span>
          </h1>
          <p className="text-text-main/60 font-medium leading-relaxed max-w-xl mx-auto">
            Rekap kondisi kerjamu sebagai <strong>{JOB_ROLE_LABELS[career.job_role] || "Profesional"}</strong>
          </p>
        </div>

        <div className="w-full flex flex-col items-center mb-14">
          <ScoreGauge
            score={finScore}
            customColor={gaugeColor}
            title="Tingkat Stres & Potensi Resign"
            statusText={`Status Resign: ${career.risk_level}`}
          />
        </div>

        <div className="flex flex-wrap gap-6 w-full mb-12 items-stretch justify-center">
          {/* 1. REALITAS FINANSIAL */}
          <BaseCard title="Realitas Finansial">
            <div className="flex gap-4 flex-1">
              <div className="flex-1 text-center py-6 bg-background/50 rounded-3xl border border-secondary/10 flex flex-col justify-center">
                <p className="text-4xl font-black text-text-main font-heading mb-1">{financial.safety_score || "-"}</p>
                <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Skor Finansial</p>
              </div>
            </div>
          </BaseCard>

          {/* 2. INDEKS KEPUASAN */}
          <BaseCard title="Indeks Kepuasan Kerja">
            <div className="flex gap-4 flex-1">
              <div className="flex-1 text-center py-6 bg-background/50 rounded-3xl border border-secondary/10 flex flex-col justify-center">
                <p className="text-4xl font-black text-text-main font-heading mb-1">
                  {career.job_satisfaction}
                  <span className="text-lg text-text-main/30">/4</span>
                </p>
                <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Kepuasan Kerja</p>
              </div>
              <div className="flex-1 text-center py-6 bg-background/50 rounded-3xl border border-secondary/10 flex flex-col justify-center">
                <p className="text-4xl font-black text-text-main font-heading mb-1">
                  {career.work_life_balance}
                  <span className="text-lg text-text-main/30">/4</span>
                </p>
                <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Work-Life Balance</p>
              </div>
              <div className="flex-1 text-center py-6 bg-background/50 rounded-3xl border border-secondary/10 flex flex-col justify-center">
                <p className="text-4xl font-black text-text-main font-heading mb-1">
                  {career.environment_satisfaction}
                  <span className="text-lg text-text-main/30">/4</span>
                </p>
                <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Lingkungan</p>
              </div>
            </div>
          </BaseCard>

          {/* 3. DATA KARIER */}
          <BaseCard title="Kilas Balik Karier">
            <div className="flex flex-wrap gap-3">
              <DetailChip label="Gaji Bulanan" value={formatRupiah(career.monthly_income)} />
              <DetailChip label="Total Pengalaman" value={`${career.total_working_years} Tahun`} />
              <DetailChip label="Di Perusahaan" value={`${career.years_at_company} Tahun`} />
              <DetailChip label="Peran Saat Ini" value={`${career.years_in_current_role} Tahun`} />
              <DetailChip label="Sejak Promosi" value={`${career.years_since_last_promotion} Tahun`} />
              <DetailChip label="Lembur" value={career.over_time === 1 ? "Ya (Sering)" : "Tidak"} />
              <DetailChip label="Burnout" value={career.burnout_flag === 1 ? "Terdeteksi" : "Aman"} />
            </div>
          </BaseCard>

          {/* 4. DATA FINANSIAL (DI AKTIFKAN) */}
          {financial ? (
            <BaseCard title="Detail Kesiapan Finansial">
              <div className="flex flex-wrap gap-3">
                <DetailChip
                  label="Tabungan Mentah"
                  value={formatRupiah(financial.monthly_savings || financial.monthlySavings)}
                  icon={<FiDollarSign />}
                />
                <DetailChip
                  label="Pengeluaran Pokok"
                  value={formatRupiah(financial.monthly_expenses || financial.monthlyExpenses)}
                  icon={<FiDollarSign />}
                />
                <DetailChip
                  label="Cicilan Bulanan"
                  value={formatRupiah(financial.monthly_debt_obligations || financial.monthlyDebtObligations)}
                  icon={<FiDollarSign />}
                />
                <DetailChip
                  label="Tanggungan"
                  value={(financial.has_dependents || financial.hasDependents) === "Yes" ? "Ada" : "Tidak"}
                  icon={<FiUser />}
                />
                <DetailChip
                  label="Asuransi Kesehatan"
                  value={financial.has_health_insurance || financial.hasHealthInsurance ? "Ada" : "Tidak"}
                  icon={<FiShield />}
                />
                <DetailChip
                  label="Prospek Kerja"
                  value={prospectLabel[financial.job_prospect_status || financial.jobProspectStatus] || "-"}
                  icon={<FiBriefcase />}
                />
              </div>
            </BaseCard>
          ) : (
            <BaseCard title="Detail Kesiapan Finansial">
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center gap-2">
                <FiDollarSign size={32} className="text-text-main/20" />
                <p className="text-sm font-bold text-text-main/40">Data finansial tidak tersedia untuk riwayat ini.</p>
              </div>
            </BaseCard>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-8 border-t border-secondary/10">
          <button
            onClick={() => navigate("/analyze")}
            className="w-full sm:w-auto px-12 py-4 rounded-full font-black text-xs bg-primary text-white hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-3 uppercase tracking-widest hover:-translate-y-1"
          >
            <FiRefreshCw size={16} /> Analisis Ulang
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="w-full sm:w-auto px-8 py-4 rounded-full font-black text-xs bg-white text-text-main hover:bg-secondary/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-secondary/30 hover:-translate-y-1"
          >
            Semua Riwayat
          </button>
        </div>
      </div>
    </main>
  );
}
