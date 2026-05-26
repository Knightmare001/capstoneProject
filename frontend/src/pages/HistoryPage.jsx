import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLoader, FiInbox, FiPlus, FiArrowLeft, FiBarChart2, FiAlertTriangle, FiTrendingUp } from "react-icons/fi";
import HistoryCard from "../components/HistoryCard";

const BASE_URL = "http://localhost:5001";

function StatCard({ label, value, icon, iconColor, bgColor }) {
  return (
    <div className="bg-white rounded-2xl p-4 text-center shadow-md shadow-black/5 border border-white/60">
      <div className={`w-10 h-10 ${bgColor} ${iconColor} rounded-xl flex items-center justify-center mx-auto mb-2 text-xl shadow-inner`}>
        {icon}
      </div>
      <p className="text-xl font-black text-slate-800 tracking-tight">{value}</p>
      <p className="text-[11px] font-medium text-slate-400 mt-0.5 leading-none">{label}</p>
    </div>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();
  const [histories, setHistories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/histories`, { credentials: "include" });
        if (res.status === 401) { navigate("/login"); return; }
        const data = await res.json();
        setHistories(data.data || []);
      } catch (err) {
        console.error("Gagal fetch histories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistories();
  }, [navigate]);

  const totalAnalysis = histories.length;
  const highRisk = histories.filter((h) => h.is_potential_resign).length;
  const avgScore = totalAnalysis
    ? Math.round(histories.reduce((sum, h) => sum + Number(h.score), 0) / totalAnalysis)
    : 0;

  return (
    <main className="min-h-screen bg-[#EBF0F5] flex flex-col font-sans">
      <header className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate("/home")} 
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors border border-slate-50 shadow-sm"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-extrabold text-slate-800 text-lg leading-none">Riwayat Analisis</h1>
            <p className="text-xs text-slate-400 mt-1">Semua data prediksi turnover yang telah disimpan</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto w-full px-6 py-6 flex flex-col gap-5">
        {!loading && totalAnalysis > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <StatCard 
              label="Total Analisis" 
              value={totalAnalysis} 
              icon={<FiBarChart2 />} 
              iconColor="text-[#4F5DB3]" 
              bgColor="bg-[#EEF0FF]" 
            />
            <StatCard 
              label="Risiko Tinggi" 
              value={highRisk} 
              icon={<FiAlertTriangle />} 
              iconColor="text-red-500" 
              bgColor="bg-red-50 text-red-500" 
            />
            <StatCard 
              label="Rata-rata Skor" 
              value={`${avgScore}%`} 
              icon={<FiTrendingUp />} 
              iconColor="text-amber-600" 
              bgColor="bg-amber-50" 
            />
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <FiLoader size={36} className="text-[#4F5DB3] animate-spin" />
            <p className="text-sm font-medium text-slate-500">Menarik data dari server...</p>
          </div>
        )}

        {!loading && histories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-20 h-20 bg-white border border-white rounded-full flex items-center justify-center shadow-md">
              <FiInbox size={36} className="text-[#7B85CE]" />
            </div>
            <div>
              <h2 className="font-bold text-slate-700 text-lg">Belum Ada Riwayat</h2>
              <p className="text-slate-400 text-sm mt-1 max-w-[80%] mx-auto">Kamu belum pernah menyimpan hasil analisis prediksi karyawan apa pun saat ini.</p>
            </div>
            <button onClick={() => navigate("/analyze")}
              className="flex items-center gap-2 bg-[#4F5DB3] hover:bg-[#3d4a99] text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-[#4F5DB3]/20 transition-all active:scale-95">
              <FiPlus /> Mulai Analisis Pertama
            </button>
          </div>
        )}

        {!loading && histories.length > 0 && (
          <div className="flex flex-col gap-3 pb-28">
            {histories.map((h) => (
              <HistoryCard key={h.id} history={h} />
            ))}
          </div>
        )}

        {!loading && histories.length > 0 && (
          <div className="fixed bottom-8 right-6 z-20">
            <button onClick={() => navigate("/analyze")}
              className="flex items-center gap-2 bg-gradient-to-r from-[#4F5DB3] to-[#7B85CE] hover:from-[#3d4a99] text-white font-extrabold px-5 py-4 rounded-2xl shadow-xl shadow-[#4F5DB3]/30 transition-all active:scale-95">
              <FiPlus size={18} /> Analisis Baru
            </button>
          </div>
        )}
      </div>
    </main>
  );
}