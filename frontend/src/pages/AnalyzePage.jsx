import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBriefcase, FiClock, FiMapPin, FiTrendingUp, FiStar, FiActivity, FiDollarSign, FiChevronRight, FiArrowLeft, FiLoader } from "react-icons/fi";

import SectionCard from "../components/SectionCard";
import Field from "../components/Field";
import RatingInput from "../components/RatingInput";
import ToggleInput from "../components/ToggleInput";
import SliderInput from "../components/SliderInput";
import JobRolePicker from "../components/JobRolePicker";

const BASE_URL = "http://localhost:5001";

const inputClass = "w-full bg-white border-2 border-slate-100 rounded-2xl p-3.5 text-slate-700 font-medium focus:outline-none focus:border-[#7B85CE] transition-colors placeholder:text-slate-300 placeholder:font-normal";

const STEPS = [
  { num: 1, label: "Data Dasar" },
  { num: 2, label: "Karier" },
  { num: 3, label: "Kepuasan" },
];

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    monthlyIncome: "",
    jobRole: "",
    overTime: 0,
    distanceFromHome: "",
    totalWorkingYears: "",
    numCompaniesWorked: "",
    yearsAtCompany: "",
    yearsInCurrentRole: "",
    yearsSinceLastPromotion: "",
    jobSatisfaction: 1,
    environmentSatisfaction: 1,
  });

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const handleInput = (e) => setField(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      //payload buat backend dan ai
      const payload = {
        monthlyIncome: Number(form.monthlyIncome),
        jobRole: form.jobRole,
        overTime: Number(form.overTime),
        distanceFromHome: Number(form.distanceFromHome),
        totalWorkingYears: Number(form.totalWorkingYears),
        numCompaniesWorked: Number(form.numCompaniesWorked),
        yearsAtCompany: Number(form.yearsAtCompany),
        yearsInCurrentRole: Number(form.yearsInCurrentRole),
        yearsSinceLastPromotion: Number(form.yearsSinceLastPromotion),
        jobSatisfaction: Number(form.jobSatisfaction),
        environmentSatisfaction: Number(form.environmentSatisfaction)
      };
      
      // ngirim ke backend
      const res = await fetch(`${BASE_URL}/api/application/analysis/career`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) { alert(data.message || "Gagal menganalisis data."); return; }

      localStorage.setItem("analyzeResult", JSON.stringify({ result: data.data, formData: payload }));
      navigate("/result");
    } catch (err) {
      alert("Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-blue-500 flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-2xl px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/home")} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-slate-800 text-lg leading-none">Analisis Potensi Resign</h1>
            <p className="text-xs text-slate-400 mt-0.5">Isi data karyawan dengan lengkap</p>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto w-full px-6 pt-6">
        <div className="flex gap-2 mb-6">
          {STEPS.map((s) => (
            <button key={s.num} type="button" onClick={() => setStep(s.num)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                step === s.num ? "bg-[#4F5DB3] text-white shadow-md"
                : step > s.num ? "bg-[#7B85CE]/20 text-[#4F5DB3]"
                : "bg-white text-slate-400 border border-slate-100"
              }`}>
              {s.num}. {s.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto w-full px-6 pb-10 flex flex-col gap-4">

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <SectionCard title="Informasi Dasar" icon={<FiDollarSign />}>
              <Field label="Gaji Bulanan (IDR)" icon={<FiDollarSign size={16} />}>
                <input type="number" name="monthlyIncome" value={form.monthlyIncome}
                  onChange={handleInput} required min="0" placeholder="cth: 8000000" className={inputClass} />
              </Field>
              <JobRolePicker value={form.jobRole} onChange={setField} />
              <Field label="Jarak dari Rumah (km)" icon={<FiMapPin size={16} />}>
                <input type="number" name="distanceFromHome" value={form.distanceFromHome}
                  onChange={handleInput} required min="0" placeholder="cth: 15" className={inputClass} />
              </Field>
            </SectionCard>

            <button type="button" onClick={() => setStep(2)}
              className="w-full py-4 bg-[#4F5DB3] hover:bg-[#3d4a99] text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#4F5DB3]/30">
              Lanjut ke Karier <FiChevronRight />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <SectionCard title="Riwayat Karier" icon={<FiTrendingUp />}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Total Pengalaman Kerja (Tahun)">
                  <input type="number" name="totalWorkingYears" value={form.totalWorkingYears}
                    onChange={handleInput} required min="0" placeholder="cth: 10" className={inputClass} />
                </Field>
                <Field label="Jumlah Perusahaan">
                  <input type="number" name="numCompaniesWorked" value={form.numCompaniesWorked}
                    onChange={handleInput} required min="0" placeholder="cth: 3" className={inputClass} />
                </Field>
                <Field label="Sudah Berapa Lama di Perusahaan Sekarang? (Tahun)">
                  <input type="number" name="yearsAtCompany" value={form.yearsAtCompany}
                    onChange={handleInput} required min="0" placeholder="cth: 4" className={inputClass} />
                </Field>
                <Field label="Sudah Berapa Lama di Posisi yang Sekarang? (Tahun)">
                  <input type="number" name="yearsInCurrentRole" value={form.yearsInCurrentRole}
                    onChange={handleInput} required min="0" placeholder="cth: 2" className={inputClass} />
                </Field>
                <Field label="Berapa Tahun Sejak Promosi/Naik Jabatan Terakhir?">
                  <input type="number" name="yearsSinceLastPromotion" value={form.yearsSinceLastPromotion}
                    onChange={handleInput} required min="0" placeholder="cth: 1" className={inputClass} />
                </Field>
              </div>
            </SectionCard>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 py-4 bg-white text-slate-600 font-bold rounded-2xl border-2 border-slate-100">
                ← Kembali
              </button>
              <button type="button" onClick={() => setStep(3)}
                className="flex-1 py-4 bg-[#4F5DB3] hover:bg-[#3d4a99] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#4F5DB3]/30">
                Lanjut <FiChevronRight />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <SectionCard title="Tingkat Kepuasan" icon={<FiStar />}>
              <p className="text-xs text-slate-400">Skala 1 (Sangat Rendah) — 4 (Sangat Tinggi)</p>
              <RatingInput label="Job Satisfaction" name="jobSatisfaction"
                value={form.jobSatisfaction} onChange={setField}
                description="Kepuasan terhadap pekerjaan itu sendiri" />
              <RatingInput label="Environment Satisfaction" name="environmentSatisfaction"
                value={form.environmentSatisfaction} onChange={setField}
                description="Kepuasan terhadap lingkungan kerja" />
            </SectionCard>

            <SectionCard title="Status Kerja" icon={<FiClock />}>
              <ToggleInput label="Lembur (OverTime)" name="overTime" value={form.overTime}
                onChange={setField} description="Apakah kamu sering lembur?" />
            </SectionCard>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(2)}
                className="flex-1 py-4 bg-white text-slate-600 font-bold rounded-2xl border-2 border-slate-100">
                ← Kembali
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-[#4F5DB3] to-[#7B85CE] text-white font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-[#4F5DB3]/30">
                {loading ? <><FiLoader className="animate-spin" /> Menganalisis...</> : <> Analisis Sekarang</>}
              </button>
            </div>
          </div>
        )}
      </form>
    </main>
  );
}
