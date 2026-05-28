import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiCheckCircle, FiSave, FiHome, FiClock, FiLoader } from "react-icons/fi";
import ScoreGauge from "../components/ScoreGauge";

const BASE_URL = "http://localhost:5001";

function ScoreBar({ label, range, score, color }) {
  const isActive = score >= range[0] && score <= range[1];
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? "bg-slate-50" : ""}`}>
      <div className={`w-3 h-3 rounded-full ${color} ${isActive ? "scale-125" : "opacity-30"}`} />
      <span className={`text-sm flex-1 ${isActive ? "font-bold text-slate-700" : "text-slate-400"}`}>{label}</span>
      {isActive && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">← Skor kamu</span>}
    </div>
  );
}

function DataChip({ label, value, highlight }) {
  return (
    <div className={`p-3 rounded-xl ${highlight ? "bg-red-50" : "bg-slate-50"}`}>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p className={`text-sm font-bold ${highlight ? "text-red-600" : "text-slate-700"}`}>{value}</p>
    </div>
  );
}

export default function ResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("analyzeResult");
    if (!stored) { navigate("/analyze"); return; }
    const parsed = JSON.parse(stored);
    setResult(parsed.result);
    setFormData(parsed.formData);
  }, [navigate]);

  const handleSave = async () => {
    if (saving || saved) return;
    setSaving(true);
    try {
      const payload = { ...result, ...formData };
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

  if (!result) return null;

  //Menyimpan tiap property result ke variable 
  const score = Number(result.score);
  const riskLevel = result.riskLevel;
  const workplaceAnalysis = result.workplaceAnalysis;
  const recommendation = result.recommendation;
  const bgGradient = workplaceAnalysis?.includes("tekanan kerja") ? "from-red-50 via-orange-50 to-[#F5F7FF]" : "from-green-50 via-emerald-50 to-[#F5F7FF]";

  return (
    <main className={`min-h-screen bg-blue-500 flex flex-col`}>
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between relative">
          <h1 className="font-bold text-slate-800 text-lg">Hasil Analisis</h1>
          <button onClick={() => navigate("/home")} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <FiHome size={20} />
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto w-full px-6 py-8 flex flex-col gap-6">
        {/* Score Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <ScoreGauge score={score} />
          <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-4 ${
            workplaceAnalysis?.includes("tekanan kerja") ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
          }`}>
            {riskLevel}
          </div>
          <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${
            workplaceAnalysis?.includes("tekanan kerja") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
            
          }`}>
           <p>{workplaceAnalysis}</p> 
          </div>
          <div className="w-full mt-1 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left text-sm text-slate-600">
            <span className="font-bold text-slate-700 block mb-1">Rekomendasi:</span>
            <p>{recommendation}</p>
          </div>
          {/* <div className="mt-3 text-xs text-slate-400">
            Raw prediction: {JSON.stringify(result)}
          </div> */}
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-700 mb-4"> Interpretasi Skor</h2>
          <ScoreBar label="Rendah (0–39)" range={[0, 39]} score={score} color="bg-green-400" />
          <ScoreBar label="Sedang (40–69)" range={[40, 69]} score={score} color="bg-yellow-400" />
          <ScoreBar label="Tinggi (70–100)" range={[70, 100]} score={score} color="bg-red-400" />
          <p className="text-xs text-slate-400 mt-4 text-center">
            Skor {score}% {workplaceAnalysis}
          </p>
        </div>

        {/* Input Summary */}
        {formData && (
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h2 className="font-bold text-slate-700 mb-4"> Ringkasan Data Input</h2>
            <div className="grid grid-cols-2 gap-3">
              <DataChip label="Gaji Bulanan" value={`Rp ${Number(formData.monthlyIncome).toLocaleString("id-ID")}`} />
              <DataChip label="Total Pengalaman" value={`${formData.totalWorkingYears} tahun`} />
              <DataChip label="Di Perusahaan Ini" value={`${formData.yearsAtCompany} tahun`} />
              <DataChip label="Sejak Promosi" value={`${formData.yearsSinceLastPromotion} tahun`} />
              <DataChip label="Lembur" value={formData.overTime === 1 ? "Ya" : "Tidak"} highlight={formData.overTime === 1} />
              <DataChip label="Job Satisfaction" value={`${formData.jobSatisfaction}/4`} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {!saved ? (
            <button onClick={handleSave} disabled={saving}
              className="w-full py-4 bg-[#4F5DB3] hover:bg-[#3d4a99] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#4F5DB3]/30 disabled:opacity-60">
              {saving ? <><FiLoader className="animate-spin" /> Menyimpan...</> : <><FiSave /> Simpan ke Riwayat</>}
            </button>
          ) : (
            <div className="w-full py-4 bg-green-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2">
              <FiCheckCircle /> Tersimpan!
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => navigate("/analyze")}
              className="flex-1 py-4 bg-white text-slate-600 font-bold rounded-2xl border-2 border-slate-100 text-sm">
               Analisis Baru
            </button>
            <button onClick={() => navigate("/history")}
              className="flex-1 py-4 bg-white text-slate-600 font-bold rounded-2xl border-2 border-slate-100 text-sm flex items-center justify-center gap-2">
              <FiClock size={15} /> Riwayat
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
