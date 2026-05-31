import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft, FiLoader, FiAlertTriangle, FiCheckCircle,
  FiClock, FiBriefcase, FiDollarSign, FiActivity,
  FiHeart, FiShield, FiTrendingUp, FiUser, FiRefreshCw,
} from "react-icons/fi";
import Navbar from "../components/Navbar";
import ScoreGauge from "../components/ScoreGauge";
import BaseCard from "../components/BaseCard";

const BASE_URL = "http://localhost:5001";

const JOB_ROLE_LABELS = {
  0: "Software Engineer", 1: "Data Analyst", 2: "Digital Marketing",
  3: "Content Creator",   4: "Sales Executive", 5: "Sales Representative",
  6: "Admin / HR",        7: "Project Manager",
};

function DetailChip({ label, value, icon }) {
  return (
    <div className="bg-background/60 border border-secondary/10 rounded-2xl p-4 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-text-main/40">
        {icon && <span className="text-xs">{icon}</span>}
        <p className="text-[10px] font-black uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-sm font-bold text-text-main">{value ?? "-"}</p>
    </div>
  );
}

export default function HistoryDetailPage() {
  const navigate     = useNavigate();
  const { careerId } = useParams();

  const [career, setCareer]   = useState(null);
  const [financial, setFin]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const careerRes = await fetch(
          `${BASE_URL}/api/histories/career?id=${careerId}`,
          { credentials: "include" }
        );
        if (careerRes.status === 401) { navigate("/login"); return; }
        const careerData = await careerRes.json();
        if (!careerRes.ok) throw new Error(careerData.message);
        setCareer(careerData.data);

        const finRes = await fetch(
          `${BASE_URL}/api/histories/financial?career_id=${careerId}`,
          { credentials: "include" }
        );
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
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(dateStr));
  };

  const formatRupiah = (val) =>
    val ? `Rp ${Number(val).toLocaleString("id-ID")}` : "-";

  if (loading) return (
    <main className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <FiLoader size={36} className="text-primary animate-spin" />
        <p className="text-sm text-text-main/50 font-medium">Memuat detail riwayat...</p>
      </div>
    </main>
  );

  if (error) return (
    <main className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
        <FiAlertTriangle size={40} className="text-danger" />
        <p className="font-bold text-text-main">{error}</p>
        <button onClick={() => navigate(-1)} className="text-primary font-bold text-sm hover:underline">← Kembali</button>
      </div>
    </main>
  );

  if (!career) return null;

  const score      = Number(career.score);
  const isResign   = career.risk_level === "HIGH";
  const gaugeColor = score >= 70 ? "#EF4444" : score >= 40 ? "#F59E0B" : "#10B981";

  const finScore  = Number(financial?.final_readiness_score || 0);
  const finRunway = financial?.runway_months ?? "-";

  const prospectLabel = {
    NO_LEADS:        "Belum Ada Prospek",
    APPLIED_ONLY:    "Sudah Melamar",
    INTERVIEW_STAGE: "Tahap Interview",
    SIGNED_OFFER:    "Sudah Ada Offer",
  };

  // Ringkasan kondisi kerja berdasarkan data tersimpan
  const burnout      = career.burnout_flag === 1;
  const overtime     = career.over_time === 1;
  const stagnant     = career.years_since_last_promotion >= 3;
  const lowSatisfy   = Number(career.job_satisfaction) <= 2;
  // const conditionText = [
  //   burnout     && "terindikasi burnout",
  //   overtime    && "sering lembur",
  //   stagnant    && "stagnan karier (>3 tahun tanpa promosi)",
  //   lowSatisfy  && "kepuasan kerja rendah",
  // ].filter(Boolean);

  // const workplaceSummary = conditionText.length > 0
  //   ? `Kamu ${conditionText.join(", ")}. ${isResign ? "Risiko resign kamu tergolong TINGGI." : "Namun risiko resign masih tergolong aman."}`
  //   : isResign
  //     ? "Meskipun tidak ada indikator tunggal yang menonjol, kombinasi faktor kerjamu menunjukkan risiko resign yang tinggi."
  //     : "Kondisi kerjamu secara umum tergolong baik dan stabil.";

  return (
    <main className="min-h-screen bg-background text-text-main flex flex-col font-sans relative overflow-x-hidden">

      {/* Background blobs  */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <Navbar />

      <div className="flex-1 flex flex-col items-center py-12 px-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-700">

        {/* HEADER  */}
        <div className="text-center mb-10 w-full max-w-3xl">
          <p className="text-xs text-text-main/40 font-medium flex items-center justify-center gap-1.5 mb-2">
            <FiClock size={12} /> {formatDate(career.created_at)}
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight font-heading mt-2 mb-4">
            Realitas <span className="text-primary">Kariermu</span> Saat Ini
          </h1>
          <p className="text-text-main/60 font-medium leading-relaxed max-w-2xl mx-auto">
            Rekap analisis kondisi kerjamu sebagai{" "}
            <strong>{JOB_ROLE_LABELS[career.job_role] || "Profesional"}</strong>{" "}
            beserta kesiapan finansialmu jika memutuskan untuk resign.
          </p>
        </div>

        {/*  GAUGE + ANALISIS KONDISI KERJA  */}
        <div className="w-full flex flex-col items-center mb-14">
          <ScoreGauge
            score={score}
            customColor={gaugeColor}
            title="Tingkat Stres & Potensi Resign"
            statusText={`Status Resign: ${career.risk_level}`}
          />

          <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-text-main/50 mb-8">
            Stress Level
          </p>

          {/* Badge risk level
          <span className={`inline-flex items-center gap-1.5 px-5 py-2 rounded-full border text-xs font-black uppercase tracking-wider mb-8 ${
            isResign
              ? "bg-danger/10 text-danger border-danger/20"
              : "bg-secondary/10 text-secondary border-secondary/20"
          }`}>
            {isResign ? <FiAlertTriangle size={13} /> : <FiCheckCircle size={13} />}
            {isResign ? "Risiko Tinggi — Pertimbangkan langkah selanjutnya" : "Aman / Setia — Kondisi terkendali"}
          </span> */}

          {/* Analisis Kondisi Kerja */}
          {/* <div className="max-w-3xl w-full text-center px-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-primary">
              <h3 className="font-black text-xs uppercase tracking-widest">
                Analisis Kondisi Kerja
              </h3>
            </div>
            <p className="text-base font-semibold text-text-main/80 leading-relaxed italic bg-white/40 p-4 rounded-2xl border border-secondary/10">
              "{workplaceSummary}"
            </p>
          </div> */}
        </div>

        {/* BASE CARDS  */}
        <div className="flex flex-wrap gap-6 w-full mb-12 items-stretch justify-center">

          {/* 1. REALITAS FINANSIAL */}
          {/* <BaseCard title="Realitas Finansial">
            <div className="flex gap-4 flex-1">
              <div className="flex-1 text-center py-6 bg-background/50 rounded-3xl border border-secondary/10 flex flex-col justify-center">
                <p className="text-4xl font-black text-text-main font-heading mb-1">{finScore || "-"}</p>
                <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Skor Finansial</p>
              </div>
              <div className="flex-1 text-center py-6 bg-background/50 rounded-3xl border border-secondary/10 flex flex-col justify-center">
                <p className="text-4xl font-black text-text-main font-heading mb-1">{finRunway || "-"}</p>
                <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Bulan Bertahan</p>
              </div>
            </div>
          </BaseCard> */}

          {/* 2. DATA KARIER */}
          <BaseCard title="Data Karier">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <DetailChip label="Gaji Bulanan"          value={formatRupiah(career.monthly_income)}               />
              <DetailChip label="Total Pengalaman"      value={`${career.total_working_years} Tahun`}             />
              <DetailChip label="Di Perusahaan"         value={`${career.years_at_company} Tahun`}               />
              <DetailChip label="Peran Saat Ini"        value={`${career.years_in_current_role} Tahun`}          />
              <DetailChip label="Sejak Promosi"         value={`${career.years_since_last_promotion} Tahun`}     />
              <DetailChip label="Perusahaan Sebelumnya" value={`${career.num_companies_worked} Tempat`}      />
              <DetailChip label="Jarak ke Kantor"       value={`${career.distance_from_home} km`}               />
              <DetailChip label="Lembur"                value={career.over_time === 1 ? "Ya (Sering)" : "Tidak"}  />
              <DetailChip label="Burnout"               value={career.burnout_flag === 1 ? "Terdeteksi" : "Aman"}  />
            </div>
          </BaseCard>

          {/* 3. INDEKS KEPUASAN */}
          <BaseCard title="Indeks Kepuasan Kerja">
            <div className="flex gap-4 flex-1">
              <div className="flex-1 text-center py-6 bg-background/50 rounded-3xl border border-secondary/10 flex flex-col justify-center">
                <p className="text-4xl font-black text-text-main font-heading mb-1">{career.job_satisfaction}<span className="text-lg text-text-main/30">/4</span></p>
                <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Kepuasan Kerja</p>
              </div>
              <div className="flex-1 text-center py-6 bg-background/50 rounded-3xl border border-secondary/10 flex flex-col justify-center">
                <p className="text-4xl font-black text-text-main font-heading mb-1">{career.work_life_balance}<span className="text-lg text-text-main/30">/4</span></p>
                <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Work-Life Balance</p>
              </div>
              <div className="flex-1 text-center py-6 bg-background/50 rounded-3xl border border-secondary/10 flex flex-col justify-center">
                <p className="text-4xl font-black text-text-main font-heading mb-1">{career.environment_satisfaction}<span className="text-lg text-text-main/30">/4</span></p>
                <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Lingkungan</p>
              </div>
            </div>
          </BaseCard>

          {/* 4. DATA FINANSIAL  */}
          {/* {financial && (
            <BaseCard title="Detail Kesiapan Finansial">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <DetailChip label="Tabungan/Bulan"     value={formatRupiah(financial.monthly_savings)}              icon={<FiDollarSign />} />
                <DetailChip label="Pengeluaran/Bulan"  value={formatRupiah(financial.monthly_expenses)}             icon={<FiDollarSign />} />
                <DetailChip label="Cicilan/Bulan"      value={formatRupiah(financial.monthly_debt_obligations)}     icon={<FiDollarSign />} />
                <DetailChip label="Tanggungan"         value={financial.has_dependents === "Yes" ? "Ada" : "Tidak"} icon={<FiUser />} />
                <DetailChip label="Asuransi Kesehatan" value={financial.has_health_insurance ? "Ada" : "Tidak"}     icon={<FiShield />} />
                <DetailChip label="Side Hustle"        value={financial.has_side_hustle ? "Ada" : "Tidak"}          icon={<FiTrendingUp />} />
                <DetailChip label="Prospek Kerja"      value={prospectLabel[financial.job_prospect_status] || financial.job_prospect_status} icon={<FiBriefcase />} />
              </div>
            </BaseCard>
          )}

          {!financial && (
            <BaseCard title="Detail Kesiapan Finansial">
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center gap-2">
                <FiDollarSign size={32} className="text-text-main/20" />
                <p className="text-sm text-text-main/40 font-medium">Data finansial tidak tersedia untuk riwayat ini.</p>
              </div>
            </BaseCard>
          )} */}

        </div>

        {/*  ACTIONS  */}
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