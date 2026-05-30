import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiRefreshCw, FiClock, FiLoader, FiBriefcase, FiDollarSign, FiActivity, FiMessageSquare } from "react-icons/fi";
import Navbar from '../components/Navbar';
import ScoreGauge from '../components/ScoreGauge';

const BASE_URL = "http://localhost:5001";

export default function ResultPage() {
  const navigate = useNavigate();
  const [careerResult, setCareerResult] = useState(null);
  const [financialResult, setFinancialResult] = useState(null);
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("analyzeResult");
    if (!stored) { navigate("/analyze"); return; }
    
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
      const payload = { ...careerResult, financial: financialResult, ...formData };
      const res = await fetch(`${BASE_URL}/api/histories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaved(true);
        localStorage.removeItem("analyzeResult");
      } else {
        const data = await res.json();
        alert(data.message || "Gagal menyimpan riwayat.");
      }
    } catch { alert("Gagal terhubung ke server."); }
    finally { setSaving(false); }
  };

  if (!careerResult) return null;

  // DATA Karir (Membulatkan angka desimal dari API)
  const score = Math.round(careerResult.score || 0); 
  const riskLevel = careerResult.riskLevel || "LOW";
  const workplaceAnalysis = careerResult.workplaceAnalysis || "Belum ada analisis tempat kerja.";
  const careerRecommendation = careerResult.recommendation || "Belum ada saran Karir.";
  
  // DATA FINANSIAL
  const finScore = financialResult?.finalReadinessScore || 0;
  const finRunway = financialResult?.financialAnalysis?.runwayMonths || 0;
  const finRecommendation = financialResult?.recommendation || "Belum ada saran finansial.";

  // Logika Warna Gauge: Makin tinggi tingkat stres/risiko resign
  const gaugeColor = score >= 70 ? "#EF4444" : score >= 40 ? "#F59E0B" : "#10B981";

  // Class dasar untuk Kartu (Glassmorphism + Flex properties)
  const cardClass = "flex-1 min-w-[100%] md:min-w-[calc(50%-1.5rem)] bg-white/80 backdrop-blur-sm border border-secondary/20 rounded-[40px] p-8 shadow-xl shadow-secondary/5 flex flex-col min-h-[250px] transition-transform hover:scale-[1.01]";

  return (
    <main className="min-h-screen bg-background text-text-main flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

      {/* NAVBAR */}
      <Navbar />

      <div className="flex-1 flex flex-col items-center py-12 px-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-10 w-full max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight font-heading mt-2 mb-4">
            Realitas <span className="text-primary">Karirmu</span> Saat Ini
          </h1>
          <p className="text-text-main/60 font-medium leading-relaxed max-w-2xl mx-auto">
            Berikut adalah kalkulasi mengenai kondisimu di kantor saat ini beserta kesiapan finansialmu jika memutuskan untuk resign.
          </p>
        </div>

        {/* ── GAUGE SCORE Karir ── */}
        <div className="w-full flex flex-col items-center mb-14">
          <ScoreGauge 
            score={score} 
            customColor={gaugeColor} 
            title="Tingkat Stres & Potensi Resign"
            statusText={`Status Resign: ${riskLevel}`}
          />

          <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-text-main/50">
            Stress Level
          </p>
        </div>

        <div className="flex flex-wrap gap-6 w-full mb-12 items-stretch justify-center">
          
          {/* REALITAS FINANSIAL */}
          <div className={cardClass}>
            <div className="w-full flex items-center justify-between border-b border-secondary/10 pb-4 mb-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-text-main/40">Realitas Finansial</h3>
            </div>
            
            <div className="flex gap-4 flex-1">
              <div className="flex-1 text-center py-6 bg-background/50 rounded-3xl border border-secondary/10 flex flex-col justify-center">
                <p className="text-4xl font-black text-text-main font-heading mb-1">{finScore}</p>
                <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Skor Kesiapan Finansial</p>
              </div>
              <div className="flex-1 text-center py-6 bg-background/50 rounded-3xl border border-secondary/10 flex flex-col justify-center">
                <p className="text-4xl font-black text-text-main font-heading mb-1">{finRunway}</p>
                <p className="text-[9px] font-black text-secondary uppercase tracking-widest">Bulan Bertahan</p>
              </div>
            </div>
          </div>

          {/* ANALISIS TEMPAT KERJA */}
          <div className={cardClass}>
            <div className="w-full flex items-center justify-between border-b border-secondary/10 pb-4 mb-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-text-main/40">Analisis Tempat Kerja</h3>
            </div>
            <div className="flex-1 flex items-center bg-background/40 p-5 rounded-3xl border border-secondary/10">
              <p className="text-sm font-bold text-text-main/80 leading-relaxed">
                {workplaceAnalysis}
              </p>
            </div>
          </div>

          {/*  REKOMENDASI Karir */}
          <div className={cardClass}>
            <div className="w-full flex items-center justify-between border-b border-secondary/10 pb-4 mb-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-text-main/40">Saran Karir</h3>
            </div>
            <div className="flex-1 flex items-start bg-background/40 p-5 rounded-3xl border border-secondary/10">
              <p className="text-[13px] font-semibold text-text-main/70 leading-relaxed italic relative pl-6 before:content-['“'] before:absolute before:left-0 before:-top-1 before:text-3xl before:text-secondary/30 before:italic">
                {careerRecommendation}
              </p>
            </div>
          </div>

          {/*  REKOMENDASI FINANSIAL */}
          <div className={cardClass}>
            <div className="w-full flex items-center justify-between border-b border-secondary/10 pb-4 mb-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-text-main/40">Saran Finansial</h3>
            </div>
            <div className="flex-1 flex items-start bg-background/40 p-5 rounded-3xl border border-secondary/10">
              <p className="text-[13px] font-semibold text-text-main/70 leading-relaxed italic relative pl-6 before:content-['“'] before:absolute before:left-0 before:-top-1 before:text-3xl before:text-primary/20 before:italic">
                {finRecommendation}
              </p>
            </div>
          </div>

        </div>

        {/* BUTTON*/}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-8 border-t border-secondary/10">
          
          <button 
            onClick={handleSave} 
            disabled={saving || saved}
            className={`w-full sm:w-auto px-12 py-4 rounded-full font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${
              saved ? "bg-white border border-secondary/20 text-success cursor-not-allowed" 
                    : "bg-primary text-white hover:bg-primary/90 hover:-translate-y-1 shadow-primary/25"
            }`}
          >
            {saving ? <><FiLoader className="animate-spin" size={16} /> Memproses...</> : 
             saved ? "Tersimpan di Riwayat" : "Simpan Hasil Analisis"}
          </button>

          <button 
            onClick={() => navigate("/analyze")} 
            className="w-full sm:w-auto px-8 py-4 rounded-full font-black text-xs bg-white text-text-main hover:bg-secondary/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-secondary/30 hover:-translate-y-1"
          >
            <FiRefreshCw size={14} /> Analisis Ulang
          </button>
          
          <button 
            onClick={() => navigate("/history")} 
            className="w-full sm:w-auto px-8 py-4 rounded-full font-black text-xs bg-white text-text-main hover:bg-secondary/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest border border-secondary/30 hover:-translate-y-1"
          >
            <FiClock size={14} /> Riwayat
          </button>

        </div>

      </div>
    </main>
  );
}