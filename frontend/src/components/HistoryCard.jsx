import { useState } from "react";
import { FiClock, FiAlertTriangle, FiCheckCircle, FiChevronDown } from "react-icons/fi";

function MiniChip({ label, value }) {
  return (
    <div className="flex-1 min-w-[140px] md:min-w-[calc(50%-0.5rem)] bg-background/50 border border-secondary/10 rounded-2xl p-4 transition-colors hover:bg-white">
      <p className="text-[10px] font-black text-text-main/40 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-text-main mt-1">{value}</p>
    </div>
  );
}

export default function HistoryCard({ history }) {
  const [expanded, setExpanded] = useState(false);
  const isResign = history.is_potential_resign;
  const score = Number(history.score);
  
  // Logika Warna: Menggunakan warna brand (Primary = Merah/Bahaya, Success = Hijau/Aman)
  const scoreColor = score >= 70 ? "text-primary" : score >= 40 ? "text-amber-500" : "text-success";
  const scoreBg = score >= 70 ? "bg-primary/10 border-primary/20" : score >= 40 ? "bg-amber-500/10 border-amber-500/20" : "bg-success/10 border-success/20";

  const formatDate = (dateStr) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(dateStr));

  return (
    // Card Container: Glassmorphism style
    <div className="bg-white/80 backdrop-blur-sm rounded-[32px] overflow-hidden border border-secondary/20 shadow-xl shadow-secondary/5 transition-all duration-300">
      
      {/* HEADER / TOGGLE BUTTON */}
      <button
        className="w-full p-6 flex items-center gap-5 hover:bg-background/60 transition-colors text-left group"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Kotak Skor */}
        <div className={`w-16 h-16 rounded-[20px] ${scoreBg} border flex flex-col items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}>
          <span className={`text-2xl font-black leading-none font-heading ${scoreColor}`}>{score}</span>
        </div>
        
        {/* Info Utama */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider border ${
              isResign ? "bg-primary/10 text-primary border-primary/20" : "bg-success/10 text-success border-success/20"
            }`}>
              {isResign ? <FiAlertTriangle size={12} /> : <FiCheckCircle size={12} />}
              {isResign ? "Risiko Tinggi" : "Aman / Setia"}
            </span>
          </div>
          <p className="text-xs text-text-main/50 font-bold flex items-center gap-1.5">
            <FiClock size={12} /> {formatDate(history.created_at)}
          </p>
        </div>

        {/* Ikon Panah */}
        <FiChevronDown
          size={24}
          className={`text-secondary/50 transition-transform duration-300 flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* EXPANDED CONTENT */}
      {expanded && (
        <div className="px-6 pb-6 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="border-t border-secondary/10 pt-5 mt-1">
            
            {/* Saran */}
            <div className="flex items-start gap-3 bg-background/60 p-5 rounded-3xl border border-secondary/15 mb-6">
              <span className="text-xl mt-0.5">🧠</span>
              <p className="text-[13px] font-semibold text-text-main/70 leading-relaxed italic">
                "{history.suggestion}"
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <MiniChip label="Gaji Bulanan" value={`Rp ${Number(history.monthly_income).toLocaleString("id-ID")}`} />
              <MiniChip label="Pengalaman" value={`${history.total_working_years} Tahun`} />
              <MiniChip label="Di Perusahaan" value={`${history.years_at_company} Tahun`} />
              <MiniChip label="Sejak Promosi" value={`${history.years_since_last_promotion} Tahun`} />
              <MiniChip label="Lembur" value={history.over_time === 1 ? "Ya (Sering)" : "Tidak"} />
              <MiniChip label="Burnout" value={history.burnout_flag === 1 ? "Terdeteksi" : "Aman"} />
              <MiniChip label="Kepuasan" value={`${history.job_satisfaction} / 4`} />
              <MiniChip label="Work-Life Balance" value={`${history.work_life_balance} / 4`} />
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}