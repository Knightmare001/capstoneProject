import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SectionCard from "../components/SectionCard";
import Field from "../components/Field";
import RatingInput from "../components/RatingInput";
import ToggleInput from "../components/ToggleInput";
import JobRolePicker from "../components/JobRolePicker";
import Navbar from "../components/Navbar";

const BASE_URL = "http://localhost:5001"; 

const inputClass = "w-full bg-background border-2 border-secondary/20 rounded-2xl p-3.5 text-text-main font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-main/30 placeholder:font-normal shadow-sm";

const STEPS = [
  { num: 1, label: "Karier", desc: "Peran & Mobilitas" },
  { num: 2, label: "Kondisi Kerja", desc: "Kepuasan & Lingkungan" },
  { num: 3, label: "Finansial", desc: "Kesiapan & Transisi" },
];

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [form, setForm] = useState({
    monthlyIncome: "",
    jobRole: "",
    distanceFromHome: "",
    totalWorkingYears: "",
    numCompaniesWorked: "",
    yearsAtCompany: "",
    yearsInCurrentRole: "",
    yearsSinceLastPromotion: "",
    jobSatisfaction: 1,
    environmentSatisfaction: 1,
    overTime: 0,
    monthlySavings: "", 
    monthlyExpenses: "",
    monthlyDebtObligations: "",
    hasDependents: 0, 
    hasHealthInsurance: 1, 
    hasSideHustle: 0,
    jobProspectStatus: "NO_LEADS",
  });

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const handleInput = (e) => setField(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payloadCareer = {
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
        environmentSatisfaction: Number(form.environmentSatisfaction),
      };

      const resCareer = await fetch(`${BASE_URL}/api/application/analysis/career`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payloadCareer),
      });

      const dataCareer = await resCareer.json();
      if (!resCareer.ok) throw new Error(dataCareer.message || "Gagal menganalisis karier.");

      const aiStressScore = dataCareer.data.score; 

      const payloadFinancial = {
        monthlySavings: Number(form.monthlySavings),
        monthlyExpenses: Number(form.monthlyExpenses),
        monthlyDebtObligations: Number(form.monthlyDebtObligations),
        hasDependents: form.hasDependents === 1 ? "Yes" : "No", 
        hasHealthInsurance: form.hasHealthInsurance === 1,
        hasSideHustle: form.hasSideHustle === 1,
        jobProspectStatus: form.jobProspectStatus,
        workplaceStressScore: aiStressScore, 
      };
      
      const resFinancial = await fetch(`${BASE_URL}/api/application/analysis/financial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payloadFinancial),
      });

      const dataFinancial = await resFinancial.json();
      if (!resFinancial.ok) throw new Error(dataFinancial.message || "Gagal menganalisis finansial.");

      localStorage.setItem("analyzeResult", JSON.stringify({ 
        careerResult: dataCareer.data,
        financialResult: dataFinancial.data,
        formData: { ...payloadCareer, ...payloadFinancial } 
      }));
      
      navigate("/result");
      
    } catch (err) {
      setErrorMsg(err.message || "Gagal terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const stepContent = {
    1: {
      title: "Riwayat Kariermu.",
      text: "Mari mulai dari peran dan pengalamanmu. Data ini digunakan untuk melihat potensi kebuntuan (stagnasi) atau pergerakan dalam kariermu saat ini."
    },
    2: {
      title: "Kondisi & Kepuasan.",
      text: "Bagaimana kondisimu di kantor? AI kami akan membaca respons ini untuk memprediksi tingkat stres dan risiko burnout secara otomatis."
    },
    3: {
      title: "Realitas Finansial.",
      text: "Resign butuh kesiapan nyata. Kalkulator finansial kami akan mengukur seberapa panjang napas tabunganmu jika kamu berhenti kerja hari ini."
    }
  };

  const flexFieldClass = "flex-1 min-w-[100%] sm:min-w-[240px]";

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 text-text-main flex flex-col font-sans relative overflow-hidden">
      
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-3xl -z-10"></div>

      <Navbar />

      <div className="max-w-7xl mx-auto w-full px-6 lg:px-16 py-12 flex flex-col lg:flex-row gap-12 lg:gap-20 relative z-10 flex-1">
        
        {/* SBLAHH KIRI INDIKATOR STEP */}
        <div className="w-full lg:w-5/12 flex flex-col lg:sticky lg:top-32 h-fit">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-5 tracking-tight leading-[1.1] text-text-main transition-all font-heading">
            {stepContent[step].title}
          </h1>
          <p className="text-lg text-text-main/70 mb-10 leading-relaxed font-medium transition-all">
            {stepContent[step].text}
          </p>

          <div className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-3xl shadow-xl border border-secondary/20 w-full transform transition-transform duration-500 hover:-translate-y-1">
            <h3 className="font-bold text-text-main flex items-center gap-2 mb-6 border-b border-secondary/10 pb-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Progres Analisis
            </h3>
            
            <div className="space-y-6">
              {STEPS.map((s, index) => {
                const isCompleted = step > s.num;
                const isActive = step === s.num;
                return (
                  <div key={s.num} className="relative flex items-center gap-4">
                    {index !== STEPS.length - 1 && (
                      <div className={`absolute left-5 top-10 w-[2px] h-6 -ml-px ${isCompleted ? 'bg-primary' : 'bg-secondary/20'}`}></div>
                    )}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors duration-300 ${
                      isCompleted ? "bg-primary text-white shadow-md shadow-primary/30" : 
                      isActive ? "bg-white border-2 border-primary text-primary" : 
                      "bg-white border-2 border-secondary/20 text-text-main/40"
                    }`}>
                      {isCompleted ? <FiCheckCircle size={18} /> : s.num}
                    </div>
                    <div onClick={() => isCompleted && setStep(s.num)} className={isCompleted ? 'cursor-pointer hover:opacity-80' : ''}>
                      <p className={`font-bold transition-colors ${isActive ? "text-text-main" : isCompleted ? "text-primary" : "text-text-main/40"}`}>
                        {s.label}
                      </p>
                      <p className={`text-xs font-medium ${isActive || isCompleted ? "text-text-main/60" : "text-text-main/30"}`}>
                        {s.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* SISI KANAN: FORM */}
        <div className="w-full lg:w-7/12">
          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md rounded-[40px] p-6 sm:p-10 shadow-2xl border border-secondary/20 flex flex-col gap-6 relative">
            
            {/* TAHAP 1 */}
            {step === 1 && (
              <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <SectionCard title="Pilih Bidang Pekerjaan" icon={<FiBriefcase />}>
                  <JobRolePicker value={form.jobRole} onChange={setField} />
                </SectionCard>

                <SectionCard title="Riwayat & Mobilitas">
                  <div className="flex flex-wrap gap-5 items-start">
                    <div className={flexFieldClass}>
                      <Field label="Total Pengalaman (Tahun)">
                        <input type="number" name="totalWorkingYears" value={form.totalWorkingYears}
                          onChange={handleInput} required min="0" placeholder="cth: 5" className={inputClass} />
                      </Field>
                    </div>
                    <div className={flexFieldClass}>
                      <Field label="Jumlah Perusahaan">
                        <input type="number" name="numCompaniesWorked" value={form.numCompaniesWorked}
                          onChange={handleInput} required min="0" placeholder="cth: 2" className={inputClass} />
                      </Field>
                    </div>
                    <div className={flexFieldClass}>
                      <Field label="Lama di Kantor Ini? (Tahun)">
                        <input type="number" name="yearsAtCompany" value={form.yearsAtCompany}
                          onChange={handleInput} required min="0" placeholder="cth: 3" className={inputClass} />
                      </Field>
                    </div>
                    <div className={flexFieldClass}>
                      <Field label="Lama di Posisi Ini? (Tahun)">
                        <input type="number" name="yearsInCurrentRole" value={form.yearsInCurrentRole}
                          onChange={handleInput} required min="0" placeholder="cth: 2" className={inputClass} />
                      </Field>
                    </div>
                    <div className={flexFieldClass}>
                      <Field label="Sejak Naik Jabatan? (Tahun)">
                        <input type="number" name="yearsSinceLastPromotion" value={form.yearsSinceLastPromotion}
                          onChange={handleInput} required min="0" placeholder="cth: 1" className={inputClass} />
                      </Field>
                    </div>
                    <div className={flexFieldClass}>
                      <Field label="Jarak dari Rumah (km)" icon={<FiMapPin size={16} />}>
                        <input type="number" name="distanceFromHome" value={form.distanceFromHome}
                          onChange={handleInput} required min="0" placeholder="cth: 15" className={inputClass} />
                      </Field>
                    </div>
                  </div>
                </SectionCard>

                <button type="button" onClick={() => setStep(2)}
                  className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:-translate-y-0.5">
                  Lanjut ke Kondisi Kerja <FiChevronRight size={20} />
                </button>
              </div>
            )}

            {/* TAHAP 2 */}
            {step === 2 && (
              <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <SectionCard title="Skala Kepuasan">
                  <p className="text-xs text-text-main/50 font-medium mb-1">Skala 1 (Sangat Rendah) — 4 (Sangat Tinggi)</p>
                  <RatingInput label="Kepuasan Pekerjaan" name="jobSatisfaction"
                    value={form.jobSatisfaction} onChange={setField}
                    description="Kecocokanmu terhadap *jobdesk* dan tanggung jawab." />
                  <RatingInput label="Lingkungan Kantor" name="environmentSatisfaction"
                    value={form.environmentSatisfaction} onChange={setField}
                    description="Kenyamanan dengan rekan kerja dan budaya kantor." />
                </SectionCard>

                <SectionCard title="Beban Kerja">
                  <ToggleInput label="Sering Lembur (OverTime)" name="overTime" value={form.overTime}
                    onChange={setField} description="Apakah kamu dituntut bekerja di luar jam operasional?" />
                </SectionCard>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-white hover:bg-secondary/5 text-text-main font-bold rounded-2xl border-2 border-secondary/20 transition-colors flex items-center justify-center gap-2">
                    <FiArrowLeft /> Kembali
                  </button>
                  <button type="button" onClick={() => setStep(3)}
                    className="flex-1 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all">
                    Lanjut ke Finansial <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* TAHAP 3 */}
            {step === 3 && (
              <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <SectionCard title="Finansial (IDR)" icon={<FiDollarSign />}>
                  <div className="flex flex-wrap gap-5 items-start">
                    <div className={flexFieldClass}>
                      <Field label="Gaji Bulanan">
                        <input type="number" name="monthlyIncome" value={form.monthlyIncome}
                          onChange={handleInput} required min="0" placeholder="cth: 8000000" className={inputClass} />
                      </Field>
                    </div>
                    <div className={flexFieldClass}>
                      <Field label="Beban / Pengeluaran Pokok">
                        <input type="number" name="monthlyExpenses" value={form.monthlyExpenses}
                          onChange={handleInput} required min="0" placeholder="cth: 3000000" className={inputClass} />
                      </Field>
                    </div>
                    <div className={flexFieldClass}>
                      <Field label="Cicilan / Utang Bulanan">
                        <input type="number" name="monthlyDebtObligations" value={form.monthlyDebtObligations}
                          onChange={handleInput} required min="0" placeholder="cth: 1500000" className={inputClass} />
                      </Field>
                    </div>
                    <div className={flexFieldClass}>
                      <Field label="Total Tabungan Darurat" description="Jumlah aset tunai milikmu">
                        <input type="number" name="monthlySavings" value={form.monthlySavings}
                          onChange={handleInput} required min="0" placeholder="cth: 20000000" className={inputClass} />
                      </Field>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Kesiapan Transisi">
                  <Field label="Status Prospek Kerja Baru">
                    <select 
                      name="jobProspectStatus" 
                      value={form.jobProspectStatus} 
                      onChange={handleInput} 
                      className={`${inputClass} cursor-pointer appearance-none`}
                    >
                      <option value="NO_LEADS">Belum ada bayangan sama sekali</option>
                      <option value="APPLIED_ONLY">Sudah mulai sebar CV / Melamar</option>
                      <option value="INTERVIEW_STAGE">Sedang dalam proses Interview</option>
                      <option value="SIGNED_OFFER">Sudah tanda tangan kontrak baru (Aman)</option>
                    </select>
                  </Field>
                  <div className="flex flex-col gap-3 mt-4">
                    <ToggleInput label="Memiliki Tanggungan?" name="hasDependents" value={form.hasDependents} onChange={setField} description="Istri, anak, atau orang tua yang dibiayai." />
                    <ToggleInput label="Asuransi Kesehatan Pribadi" name="hasHealthInsurance" value={form.hasHealthInsurance} onChange={setField} description="Punya BPJS Mandiri atau asuransi swasta jika *resign*." />
                    <ToggleInput label="Punya Side Hustle / Freelance?" name="hasSideHustle" value={form.hasSideHustle} onChange={setField} description="Ada pemasukan sampingan untuk bantalan sementara." />
                  </div>
                </SectionCard>
                {errorMsg && (
                  <div className="bg-danger/10 border border-danger/20 text-danger text-sm text-center p-3 rounded-xl font-bold">
                    {errorMsg}
                  </div>
                )}
                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)}
                    className="flex-1 py-4 bg-white hover:bg-secondary/5 text-text-main font-bold rounded-2xl border-2 border-secondary/20 transition-colors flex items-center justify-center gap-2">
                    <FiArrowLeft /> Kembali
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-[1.5] py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5">
                    {loading ? <><FiLoader className="animate-spin" /> Sedang Menghitung...</> : <> Lihat Hasil Analisis</>}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

      </div>
    </main>
  );
}