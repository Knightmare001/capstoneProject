import { useState } from "react";
import { FiClock, FiAlertTriangle, FiCheckCircle, FiChevronDown } from "react-icons/fi";

function MiniChip({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-2.5">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-700 mt-0.5">{value}</p>
    </div>
  );
}

export default function HistoryCard({ history }) {
  const [expanded, setExpanded] = useState(false);
  const isResign = history.is_potential_resign;
  const score = Number(history.score);
  const scoreColor = score >= 70 ? "text-red-500" : score >= 40 ? "text-amber-500" : "text-green-500";
  const scoreBg = score >= 70 ? "bg-red-50" : score >= 40 ? "bg-amber-50" : "bg-green-50";

  const formatDate = (dateStr) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }).format(new Date(dateStr));

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
      <button
        className="w-full p-5 flex items-center gap-4 hover:bg-slate-50 transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-14 h-14 rounded-2xl ${scoreBg} flex flex-col items-center justify-center flex-shrink-0`}>
          <span className={`text-lg font-extrabold leading-none ${scoreColor}`}>{score}</span>
          <span className="text-xs text-slate-400">%</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              isResign ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
            }`}>
              {isResign ? <FiAlertTriangle size={10} /> : <FiCheckCircle size={10} />}
              {isResign ? "Risiko Tinggi" : "Setia"}
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <FiClock size={11} /> {formatDate(history.created_at)}
          </p>
        </div>
        <FiChevronDown
          size={18}
          className={`text-slate-400 transition-transform flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-100">
          <p className={`text-sm font-medium p-3 rounded-xl mt-4 mb-4 ${
            isResign ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}>
            {history.suggestion}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <MiniChip label="Gaji Bulanan" value={`Rp ${Number(history.monthly_income).toLocaleString("id-ID")}`} />
            <MiniChip label="Total Pengalaman" value={`${history.total_working_years} thn`} />
            <MiniChip label="Di Perusahaan" value={`${history.years_at_company} thn`} />
            <MiniChip label="Sejak Promosi" value={`${history.years_since_last_promotion} thn`} />
            <MiniChip label="Lembur" value={history.over_time === 1 ? "Ya" : "Tidak"} />
            <MiniChip label="Burnout" value={history.burnout_flag === 1 ? "Ya" : "Tidak"} />
            <MiniChip label="Job Satisfaction" value={`${history.job_satisfaction}/4`} />
            <MiniChip label="Work-Life Balance" value={`${history.work_life_balance}/4`} />
          </div>
        </div>
      )}
    </div>
  );
}
