import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiRefreshCw, FiInfo, FiSave, FiCheck } from "react-icons/fi";
import Navbar from "../components/Navbar";
import ScoreGauge from "../components/ScoreGauge";
import BaseCard from "../components/BaseCard";

export default function SkillResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { result, selectedSkills, minSalary, maxSalary } = location.state || {};

  const [saved, setSaved]   = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!result) navigate("/skill");
  }, [result, navigate]);

  const handleSave = () => {
    if (saving || saved) return;
    setSaving(true);
    try {
      const existing = JSON.parse(localStorage.getItem("skillHistory") || "[]");
      const newEntry = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        result,
        selectedSkills,
        minSalary,
        maxSalary,
        skillMatchPercentage: result.skillMatchPercentage,
      };
      const updated = [newEntry, ...existing].slice(0, 50);
      localStorage.setItem("skillHistory", JSON.stringify(updated));
      setSaved(true);
    } catch (e) {
      console.error("Gagal simpan skill history:", e);
    } finally {
      setSaving(false);
    }
  };

  if (!result) return null;

  const formatRupiah = (val) => {
    if (!val) return "";
    return `Rp ${(Number(val) / 1_000_000).toFixed(1)} Jt`;
  };

  const matchPct   = result?.skillMatchPercentage ?? 0;
  const isGood     = matchPct >= 70;
  const isWarning  = matchPct >= 40 && matchPct < 70;
  const gaugeColor = isGood ? "#10B981" : isWarning ? "#F59E0B" : "#BB4430";

  return (
    <main className="min-h-screen bg-background text-text-main flex flex-col font-sans relative overflow-x-hidden">
      <div className="absolute top-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <Navbar />

      <div className="flex-1 flex flex-col items-center py-12 px-6 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-6 duration-700">

        <div className="text-center mb-8 w-full max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight font-heading mt-2 mb-3">
            Hasil Rekomendasi <span className="text-primary">Kariermu</span>
          </h1>
          <p className="text-text-main/60 font-medium max-w-2xl mx-auto leading-relaxed">
            Kami telah menganalisis profilmu berdasarkan <strong>{selectedSkills?.length} skill</strong> untuk target gaji <strong>{formatRupiah(minSalary)} - {formatRupiah(maxSalary)}</strong>.
          </p>
        </div>

        <div className="w-full flex flex-col items-center mb-14">
          <ScoreGauge
            score={matchPct}
            customColor={gaugeColor}
            title="Market Fit Score"
            statusText={`Rating: ${matchPct >= 70 ? 'Excellent' : matchPct >= 40 ? 'Good' : 'Needs Improvement'}`}
          />
          <p className="mt-3 text-sm font-black uppercase tracking-[0.2em] text-text-main/50">
            Market Fit Score
          </p>
          <span className={`mt-3 px-5 py-1.5 rounded-full  text-xs font-black uppercase tracking-wider ${
            isGood ? "bg-secondary/10 text-secondary border-secondary/20"
              : isWarning ? "bg-amber-50 text-amber-600 border-amber-200"
                : "bg-danger/10 text-danger border-danger/20"
          }`}>
            {isGood ? "Excellent" : isWarning ? "Good" : "Needs Improvement"}
          </span>
        </div>

        <div className="flex flex-wrap gap-6 w-full mb-12 items-stretch justify-center">

          {result.summaryAdvice && (
            <div className="bg-white/50 backdrop-blur-sm border border-secondary/20 p-5 rounded-2xl shadow-sm inline-block w-full">
              <p className="text-sm font-bold text-text-main/80 leading-relaxed italic">
                "{result.summaryAdvice}"
              </p>
            </div>
          )}

          <BaseCard title="Best Time to Apply">
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
          </BaseCard>

          <BaseCard title="Skill Gap Analysis">
            <div className="flex flex-col gap-3 flex-1">
              {result.recommendedSkillsToLearn?.slice(0, 3).map((skill, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-background/80 rounded-2xl border border-secondary/10 transition-transform hover:scale-[1.02]">
                  <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-primary/20">
                    {i + 1}
                  </div>
                  <p className="font-bold text-sm text-text-main leading-tight">{skill}</p>
                </div>
              ))}
            </div>
          </BaseCard>

          <BaseCard title="Current Skill Assets">
            <div className="flex flex-wrap gap-2.5 items-start content-start flex-1">
              {selectedSkills?.map((s) => (
                <span key={s} className="bg-white border border-secondary/20 px-4 py-2 rounded-full text-xs font-black text-text-main/70 shadow-sm hover:border-primary/30 transition-colors">
                  {s}
                </span>
              ))}
            </div>
          </BaseCard>

        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center pt-8 border-t border-secondary/10">
          <button
            onClick={() => navigate("/skill")}
            className="w-full sm:w-auto px-12 py-4 rounded-full font-black text-xs bg-white text-text-main hover:bg-secondary/10 transition-all shadow-xl shadow-black/5 flex items-center justify-center gap-3 uppercase tracking-widest border border-secondary/30 hover:-translate-y-1"
          >
            <FiRefreshCw size={16} /> Analisis Ulang
          </button>
          <button
            onClick={() => navigate("/analyze")}
            className="w-full sm:w-auto px-12 py-4 rounded-full font-black text-xs bg-white text-text-main hover:bg-secondary/10 transition-all flex items-center justify-center gap-3 uppercase tracking-widest border border-secondary/30 hover:-translate-y-1"
          >
            Cek Kesiapan Resign
          </button>
        </div>

      </div>
    </main>
  );
}