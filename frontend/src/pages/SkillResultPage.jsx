import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiRefreshCw, FiTrendingUp, FiCalendar, FiAward, FiInfo } from "react-icons/fi";
import Navbar from "../components/Navbar";
import ScoreGauge from "../components/ScoreGauge";

export default function SkillResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { result, selectedSkills, minSalary, maxSalary } = location.state || {};

  useEffect(() => {
    if (!result) navigate("/skill");
  }, [result, navigate]);

  if (!result) return null;

  const matchPct = result?.skillMatchPercentage ?? 0;
  const isGood = matchPct >= 70;
  const isWarning = matchPct >= 40 && matchPct < 70;
  
  const gaugeColor = isGood ? "#10B981" : isWarning ? "#F59E0B" : "#BB4430"; 
  const statusColorClass = isGood ? "text-success" : isWarning ? "text-amber-500" : "text-primary";

  return (
    <main className="min-h-screen bg-background text-text-main flex flex-col font-sans relative overflow-x-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <Navbar />

      <div className="flex-1 flex flex-col items-center py-12 px-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-700">

        {/* ── HEADER & AI ADVICE ── */}
        <div className="text-center mb-10 w-full max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight font-heading mt-2 mb-4">
            Hasil Rekomendasi <span className="text-primary">Karirmu</span>
          </h1>
          
        </div>

        <div className="w-full flex flex-col items-center mb-14">
          <h3 className="font-black text-xs uppercase tracking-widest text-text-main/40 mb-2">
            Market Fit Score
          </h3>
          
          <ScoreGauge score={matchPct} customColor={gaugeColor} />
          
          <div className={`mt-2 px-6 py-2 rounded-full bg-white border border-secondary/20 text-xs font-black uppercase tracking-wider shadow-sm ${statusColorClass}`}>
            Rating: {matchPct >= 70 ? 'Excellent' : matchPct >= 40 ? 'Good' : 'Needs Improvement'}
          </div>
          <p className="mt-4 text-sm font-black uppercase tracking-[0.2em] text-text-main/50">
            Match Score Keahlian
          </p>
          
        </div>
        {result.summaryAdvice && (
            <div className="bg-white/50 backdrop-blur-sm border border-secondary/20 p-5 rounded-2xl shadow-sm inline-block w-full">
            <p className="text-sm font-bold text-text-main/80 leading-relaxed italic">
                "{result.summaryAdvice}"
            </p>
            </div>
        )}
        <div className="flex flex-col lg:flex-row gap-6 w-full mb-12 items-stretch justify-center">
          
          {/* HIRING SEASON */}
          <div className="flex-1 min-w-[280px] bg-white/80 backdrop-blur-sm border border-secondary/20 rounded-[40px] p-8 shadow-xl shadow-secondary/5 flex flex-col">
            <div className="w-full flex items-center justify-between border-b border-secondary/10 pb-4 mb-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-text-main/40">Best Time to Apply</h3>
            </div>
            
            <div className="text-center py-6 bg-background/50 rounded-[32px] border border-secondary/10 flex-1 flex flex-col justify-center">
              <p className="text-5xl font-black text-text-main font-heading mb-2">{result.bestHiringSeason?.recommendedMonth || "-"}</p>
              <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Recommended Month</p>
            </div>

            <div className="mt-5 flex gap-3 items-start bg-background p-4 rounded-2xl border border-secondary/10">
              <FiInfo className="text-secondary shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed font-semibold text-text-main/70">
                {result.bestHiringSeason?.reason}
              </p>
            </div>
          </div>

          {/* SKILL GAP */}
          <div className="flex-1 min-w-[280px] bg-white/80 backdrop-blur-sm border border-secondary/20 rounded-[40px] p-8 shadow-xl shadow-secondary/5 flex flex-col">
            <div className="w-full flex items-center justify-between border-b border-secondary/10 pb-4 mb-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-text-main/40">Skill Gap Analysis</h3>
            </div>

            <div className="flex flex-col gap-3 flex-1">
              {result.recommendedSkillsToLearn?.slice(0, 3).map((skill, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-background/80 rounded-2xl border border-secondary/10 transition-transform hover:scale-[1.02]">
                  <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                    {i + 1}
                  </div>
                  <p className="font-bold text-sm text-text-main leading-tight">{skill}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CURRENT ASSETS */}
          <div className="flex-1 min-w-[280px] bg-white/80 backdrop-blur-sm border border-secondary/20 rounded-[40px] p-8 shadow-xl shadow-secondary/5 flex flex-col">
            <div className="w-full flex items-center justify-between border-b border-secondary/10 pb-4 mb-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-text-main/40">Current Skill Assets</h3>
            </div>
            <div className="flex flex-wrap gap-2.5 items-start content-start flex-1">
              {selectedSkills?.map((s) => (
                <span key={s} className="bg-white border border-secondary/20 px-4 py-2 rounded-full text-xs font-black text-text-main/70 shadow-sm hover:border-primary/30 transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* INI BUTOON BANH*/}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-8 border-t border-secondary/10">
          <button 
            onClick={() => navigate("/skill")}
            className="w-full sm:w-auto px-12 py-4 rounded-full font-black text-xs bg-primary text-white hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 flex items-center justify-center gap-3 uppercase tracking-widest hover:-translate-y-1"
          >
            <FiRefreshCw size={16} /> Analisis Ulang
          </button>
          <button 
            onClick={() => navigate("/analyze")} 
            className="w-full sm:w-auto px-12 py-4 rounded-full font-black text-xs bg-white text-text-main hover:bg-secondary/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest border border-secondary/30 hover:-translate-y-1"
          >
            Analisis Stress
          </button>
        </div>

      </div>
    </main>
  );
}