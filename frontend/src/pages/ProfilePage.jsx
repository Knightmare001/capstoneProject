import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLogOut,
  FiArrowLeft,
  FiBarChart2,
  FiAlertTriangle,
  FiTrendingUp,
  FiActivity,
  FiDollarSign,
  FiClock,
  FiChevronRight,
} from "react-icons/fi";
import Navbar from "../components/Navbar";

const BASE_URL = import.meta.env.VITE_BACKEND_SERVICE_URL;

function StatCard({ label, value, icon, bg, color }) {
  return (
    <div className="bg-white rounded-2xl p-4 text-center shadow-md shadow-black/5 border border-white/60 flex flex-col items-center gap-1">
      <p className="text-xl font-black text-text-main tracking-tight">{value}</p>
      <p className="text-[11px] font-medium text-text-main/40 leading-tight text-center">{label}</p>
    </div>
  );
}

const TYPE_CONFIG = {
  career: {
    icon: <FiActivity size={18} />,
    bg: "bg-primary/10 text-primary",
    label: (item) => `Karier · Skor ${item.score}`,
    score: (item) => Number(item.score),
    tag: "Karier",
    tagColor: "bg-primary/10 text-primary border-primary/20",
    scoreColor: (s) => (s >= 70 ? "text-danger" : s >= 40 ? "text-amber-500" : "text-secondary"),
    scoreLabel: (s) => String(s),
  },
  // Sesi lengkap: career + financial digabung jadi 1 baris
  combined: {
    icon: <FiDollarSign size={18} />,
    bg: "bg-secondary/10 text-secondary",
    label: (item) => `Hasil Analisis`,
    score: (item) => Number(item.final_readiness_score),
    tag: "Lengkap",
    tagColor: "bg-secondary/10 text-secondary border-secondary/20",
    scoreColor: (s) => (s >= 70 ? "text-secondary" : s >= 40 ? "text-amber-500" : "text-danger"),
    scoreLabel: (s) => String(s),
  },
};

function HistoryRow({ item, type, onClick }) {
  const cfg = TYPE_CONFIG[type];
  const score = cfg.score(item);
  const label = cfg.label(item);
  const date = new Date(item.created_at).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-white hover:bg-background rounded-2xl border border-secondary/10 transition-all group text-left"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-text-main text-sm truncate">{label}</p>
        </div>
        <p className="text-xs text-text-main/40 font-medium flex items-center gap-1 mt-0.5">
          <FiClock size={11} /> {date}
        </p>
      </div>
      <span className={`text-sm font-black shrink-0 ${cfg.scoreColor(score)}`}>{cfg.scoreLabel(score)}</span>
      <FiChevronRight size={14} className="text-text-main/30 group-hover:text-primary transition-colors shrink-0" />
    </button>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [careerHistory, setCareer] = useState([]);
  const [financialHistory, setFin] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    try {
      setUser(JSON.parse(stored));
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      try {
        const [careerRes, finRes] = await Promise.all([
          fetch(`${BASE_URL}/api/histories/career`, { credentials: "include" }),
          fetch(`${BASE_URL}/api/histories/financial`, { credentials: "include" }),
        ]);
        if (careerRes.status === 401 || finRes.status === 401) {
          navigate("/login");
          return;
        }
        const careerData = await careerRes.json();
        const finData = await finRes.json();
        setCareer(careerData.data || []);
        setFin(finData.data || []);
      } catch (err) {
        console.error("Gagal fetch histories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  const totalCareer = careerHistory.length;
  const totalFin = financialHistory.length;
  const highRisk = careerHistory.filter((h) => h.riskLevel === "HIGH" || h.risk_level === "HIGH").length;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  // Career ID yang sudah punya pasangan finansial → jangan tampilkan career-nya lagi
  const pairedCareerIds = new Set(financialHistory.map((f) => f.career_history_id).filter(Boolean));

  // Gabungkan: financial jadi "combined", career-only tetap tampil
  const allHistory = [
    ...careerHistory.filter((item) => !pairedCareerIds.has(item.id)).map((item) => ({ ...item, _type: "career" })),
    ...financialHistory.map((item) => ({ ...item, _type: "combined" })),
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 text-text-main flex flex-col font-sans">
      <Navbar />

      <div className="max-w-3xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
        {/*   HERO PROFILE CARD   */}
        <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-black/5 border border-secondary/10 flex flex-col sm:flex-row items-center sm:items-start gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-primary/30 shrink-0">
            {initials}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Profil Akun</span>
            <h1 className="text-2xl font-extrabold text-text-main mt-1 mb-0.5">{user.name}</h1>
            <p className="flex items-center gap-1.5 text-sm text-text-main/50 font-medium justify-center sm:justify-start">
              <FiMail size={13} /> {user.email}
            </p>
            {user.id && (
              <p className="mt-2 font-mono text-[11px] text-text-main/30 bg-background px-3 py-1 rounded-full w-fit mx-auto sm:mx-0">
                ID: {user.id}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-danger/20 text-danger hover:bg-danger/5 font-bold text-sm transition-colors shrink-0"
          >
            <FiLogOut size={15} /> Keluar
          </button>
        </div>

        {/*  STATISTIK  */}
        {!loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <p className="text-xs font-black text-text-main/40 uppercase tracking-widest mb-3">Statistik Kamu</p>
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Analisis Karier" value={totalCareer} bg="bg-primary/10" color="text-primary" />
              <StatCard label="Analisis Finansial" value={totalFin} bg="bg-secondary/10" color="text-secondary" />
              <StatCard label="Risiko Tinggi" value={highRisk} bg="bg-danger/10" color="text-danger" />
            </div>
          </div>
        )}

        {/*   SEMUA RIWAYAT */}
        {!loading && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 pb-10">
            <p className="text-xs font-black text-text-main/40 uppercase tracking-widest mb-3">
              Semua Riwayat
              {allHistory.length > 0 && (
                <span className="ml-2 text-text-main/20 font-medium normal-case tracking-normal">
                  ({allHistory.length} entri)
                </span>
              )}
            </p>

            {allHistory.length > 0 ? (
              <div className="flex flex-col gap-2">
                {allHistory.map((item) => (
                  <HistoryRow
                    key={`${item._type}-${item.id}`}
                    item={item}
                    type={item._type}
                    onClick={() => {
                      const targetId =
                        item._type === "combined" ? item.career_history_id || item.historyId || item.id : item.id;

                      navigate(`/history/${targetId}`);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-secondary/10 text-center">
                <p className="text-sm text-text-main/40 font-medium">Belum ada riwayat analisis.</p>
                <button
                  onClick={() => navigate("/analyze")}
                  className="mt-3 text-xs font-bold text-primary hover:underline"
                >
                  Mulai analisis pertama →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-text-main/40 font-medium">Memuat data profil...</p>
          </div>
        )}
      </div>
    </main>
  );
}
