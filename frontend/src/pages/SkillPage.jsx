import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiHome, FiTarget, FiTrendingUp, FiCalendar } from "react-icons/fi";
import Navbar from "../components/Navbar";

import SkillInput from "../components/SkillInput";

const BASE_URL = "http://localhost:5001";

export default function SkillPage() {
  const navigate = useNavigate();

  // State Form
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [search, setSearch] = useState("");

  // State API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSkill = (label) => {
    setSelectedSkills((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (selectedSkills.length === 0) {
      setError("Pilih minimal 1 skill yang kamu kuasai."); return;
    }
    if (!minSalary || !maxSalary) {
      setError("Isi ekspektasi gaji minimum dan maksimum."); return;
    }
    if (Number(minSalary) > Number(maxSalary)) {
      setError("Gaji minimum tidak boleh lebih besar dari gaji maksimum."); return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/application/analysis/competency`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          minExpectedSalary: Number(minSalary),
          maxExpectedSalary: Number(maxSalary),
          userSkills: selectedSkills,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mendapatkan rekomendasi.");

      navigate("/skill-result", { 
        state: { 
          result: data.data, 
          selectedSkills, 
          minSalary, 
          maxSalary 
        } 
      });

    } catch (err) {
      setError(err.message || "Gagal terhubung ke server. Periksa jaringan kamu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 text-text-main flex flex-col font-sans relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-secondary/15 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />

      {/*INI NAVBAR BAHN*/}
      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-16 py-12 flex flex-col lg:flex-row gap-12 lg:gap-20 relative z-10 flex-1">
        
        {/* Sisi Kiri Informasi */}
        <div className="w-full lg:w-5/12 flex flex-col lg:sticky lg:top-32 h-fit">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight leading-[1.1] text-text-main font-heading">
            Skill Apa yang Harus Kamu Kuasai?
          </h1>
          <p className="text-lg text-text-main/70 mb-10 leading-relaxed font-medium">
            Pilih skill yang sudah kamu miliki, masukkan ekspektasi gaji, dan kami akan mencocokkan dengan data job market untuk merekomendasikan skill yang paling perlu kamu tingkatkan.
          </p>

          <div className="flex flex-col gap-3">
            {[
              { title: "Analisis Job Market", desc: "Berbasis data ribuan lowongan kerja nyata." },
              { title: "Gap Analysis", desc: "Temukan skill yang hilang antara profilmu dan pasar." },
              { title: "Waktu Terbaik Melamar", desc: "Tahu bulan mana paling banyak lowongan sesuai profilmu." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-white/70 rounded-2xl border border-secondary/15 shadow-sm">
                <div>
                  <p className="font-bold text-text-main text-sm">{item.title}</p>
                  <p className="text-xs text-text-main/50 font-medium mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* di Kanan Form Input */}
        <div className="w-full lg:w-7/12">
          <SkillInput 
            selectedSkills={selectedSkills}
            onToggleSkill={toggleSkill}
            minSalary={minSalary}
            maxSalary={maxSalary}
            onMinSalary={setMinSalary}
            onMaxSalary={setMaxSalary}
            search={search}
            onSearch={setSearch}
            loading={loading}
            error={error}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </main>
  );
}