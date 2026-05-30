import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiRefreshCw, FiTrendingUp, FiCalendar, FiPercent, FiAward, FiMessageSquare } from "react-icons/fi";

export default function SkillResult({ result, selectedSkills, minSalary, maxSalary, onReset }) {
  const navigate = useNavigate();
  const [animateGauge, setAnimateGauge] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateGauge(true), 100);
  }, []);


  const matchPct = result?.skillMatchPercentage ?? 0;


  const isGood = matchPct >= 70;
  const isWarning = matchPct >= 40 && matchPct < 70;
  const gaugeColor = isGood ? "#10B981" : isWarning ? "#F59E0B" : "var(--color-primary)";
  const statusText = isGood ? "TINGGI" : isWarning ? "MENENGAH" : "RENDAH";
  const statusColorClass = isGood ? "text-[#10B981]" : isWarning ? "text-[#F59E0B]" : "text-primary";

  return (
    <div className="w-full bg-[#1E1E1E] rounded-[40px] p-6 sm:p-10 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center relative">
      
      {/* HEADER UTAMA */}
      <div className="text-center max-w-2xl mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wider font-heading uppercase text-white mb-3">
          HASIL ANALISIS SKILL
        </h1>
        <p className="text-white/60 text-sm leading-relaxed">
          Analisis kecocokan profil keahlianmu terhadap target pasar industri saat ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-10 items-stretch">
        
        {/* KECOCOKAN SKILL  */}
        <div className="bg-white text-[#222] rounded-[32px] p-6 shadow-xl flex flex-col items-center justify-between min-h-[320px]">
          <div className="flex items-center gap-2 w-full border-b border-secondary/10 pb-3 mb-2">
            <span className="text-primary"><FiPercent size={18} /></span>
            <h3 className="font-bold font-heading text-sm uppercase tracking-wider text-text-main/80">Kecocokan Profil</h3>
          </div>

          <div className="relative w-44 h-24 flex justify-center overflow-hidden mt-2">
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <path d="M 5 50 A 45 45 0 0 1 95 50" fill="none" stroke="#E5E7EB" strokeWidth="10" strokeLinecap="round" />
              <path 
                d="M 5 50 A 45 45 0 0 1 95 50" 
                fill="none" stroke={gaugeColor} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeOffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute bottom-1 flex flex-col items-center">
              <span className="text-3xl font-black leading-none font-heading">{matchPct}%</span>
              <span className="text-[9px] font-bold opacity-50 uppercase mt-0.5">Match Rate</span>
            </div>
          </div>

          <div className="bg-background px-4 py-1.5 rounded-full border border-secondary/15 text-[11px] font-bold mt-2">
            METER DESIGN: <span className={`font-black ${statusColorClass}`}>{statusText}</span>
          </div>

          <p className="text-[11px] text-center text-text-main/60 font-medium mt-4 leading-relaxed bg-background/50 p-3 rounded-xl border border-secondary/10 w-full">
            Ekspektasi: <span className="font-bold text-primary">{formatRupiah(minSalary)} - {formatRupiah(maxSalary)}</span>
          </p>
        </div>

        {/* WAKTU MELAMAR */}
        <div className="bg-white text-[#222] rounded-[32px] p-6 shadow-xl flex flex-col justify-between min-h-[320px]">
          <div className="flex items-center gap-2 w-full border-b border-secondary/10 pb-3 mb-4">
            <span className="text-secondary"><FiCalendar size={18} /></span>
            <h3 className="font-bold font-heading text-sm uppercase tracking-wider text-text-main/80">Hiring Season</h3>
          </div>
          
          <div className="bg-background p-4 rounded-2xl border border-secondary/15 text-center my-auto">
            <p className="text-[9px] font-black opacity-40 uppercase tracking-widest mb-1">Rekomendasi Bulan</p>
            <p className="text-3xl font-black text-text-main font-heading">{result.bestHiringSeason?.recommendedMonth || "-"}</p>
          </div>

          <div className="bg-background/80 p-4 rounded-xl border border-secondary/10 w-full mt-4">
            <p className="text-[10px] font-bold opacity-50 mb-1">Analisis Alasan:</p>
            <p className="text-[11px] leading-relaxed font-medium opacity-80">
              {result.bestHiringSeason?.reason || "Data tren rekrutmen tidak tersedia untuk sektor ini."}
            </p>
          </div>
        </div>

        {/*  SKILL YANG PERLU DIPELAJARI */}
        {result.recommendedSkillsToLearn?.length > 0 && (
          <div className="bg-white text-[#222] rounded-[32px] p-6 shadow-xl flex flex-col justify-between min-h-[320px]">
            <div className="flex items-center gap-2 w-full border-b border-secondary/10 pb-3 mb-3">
              <span className="text-primary"><FiTrendingUp size={18} /></span>
              <h3 className="font-bold font-heading text-sm uppercase tracking-wider text-text-main/80">Rekomendasi Skill</h3>
            </div>

            <div className="flex flex-col gap-2 my-auto w-full">
              {result.recommendedSkillsToLearn.slice(0, 3).map((skill, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 bg-background/60 rounded-xl border border-secondary/10 shadow-sm">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0">{i + 1}</div>
                  <p className="font-bold text-xs text-text-main truncate flex-1">{skill}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-center font-bold text-text-main/40 mt-3 uppercase tracking-wider">
              Prioritas Utama Pasar Kerja
            </p>
          </div>
        )}

        {/*  INSIGHT  */}
        {result.summaryAdvice && (
          <div className="bg-white text-[#222] rounded-[32px] p-6 shadow-xl flex flex-col justify-between min-h-[220px] md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 w-full border-b border-secondary/10 pb-3 mb-3">
              <span className="text-amber-500">🧠</span>
              <h3 className="font-bold font-heading text-sm uppercase tracking-wider text-text-main/80">Saran & Strategi AI</h3>
            </div>
            
            <div className="bg-background/40 p-4 rounded-2xl border border-secondary/15 my-auto overflow-y-auto max-h-40 w-full">
              <p className="text-[11px] leading-relaxed font-medium text-text-main/90 italic">
                "{result.summaryAdvice}"
              </p>
            </div>
          </div>
        )}

        {/*ASSET SKILL SAAT INI */}
        <div className="bg-white text-[#222] rounded-[32px] p-6 shadow-xl flex flex-col justify-between min-h-[220px] md:col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2 w-full border-b border-secondary/10 pb-3 mb-3">
            <span className="text-secondary"><FiAward size={18} /></span>
            <h3 className="font-bold font-heading text-sm uppercase tracking-wider text-text-main/80">Skill yang Kamu Miliki</h3>
          </div>
          
          <div className="flex flex-wrap gap-1.5 overflow-y-auto max-h-40 p-1 w-full my-auto">
            {selectedSkills.map((s) => (
              <span key={s} className="bg-background text-text-main border border-secondary/20 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm">
                {s}
              </span>
            ))}
          </div>
        </div>

      </div>


    </div>
  );
}