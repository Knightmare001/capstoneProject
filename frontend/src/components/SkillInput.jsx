import { FiCheck, FiBookOpen, FiStar, FiZap, FiLoader } from "react-icons/fi";

const inputClass =
  "w-full bg-background/50 backdrop-blur-sm border-2 border-secondary/20 rounded-2xl p-3.5 text-text-main font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-text-main/40 placeholder:font-medium shadow-sm hover:border-secondary/40";

export const SKILL_LIST = [
  { code: "ACCT", label: "Accounting" },
  { code: "ADM", label: "Administrative" },
  { code: "ADV", label: "Advertising" },
  { code: "ANLT", label: "Analyst" },
  { code: "ART", label: "Art/Creative" },
  { code: "BD", label: "Business Development" },
  { code: "CHEF", label: "Chefs/Cooks" },
  { code: "CS", label: "Customer Service" },
  { code: "DSGN", label: "Design" },
  { code: "EDU", label: "Education" },
  { code: "ENG", label: "Engineering" },
  { code: "FIN", label: "Finance" },
  { code: "GEN", label: "General Business" },
  { code: "HCPR", label: "Healthcare Practice" },
  { code: "HR", label: "Human Resources" },
  { code: "IT", label: "Information Technology" },
  { code: "LAW", label: "Legal" },
  { code: "MGMT", label: "Management" },
  { code: "MNFC", label: "Manufacturing" },
  { code: "MRKT", label: "Marketing" },
  { code: "PR", label: "Public Relations" },
  { code: "PROD", label: "Production" },
  { code: "PRCH", label: "Purchasing" },
  { code: "PRJM", label: "Project Management" },
  { code: "QA", label: "Quality Assurance" },
  { code: "RE", label: "Real Estate" },
  { code: "RSCH", label: "Research" },
  { code: "SALE", label: "Sales" },
  { code: "SCI", label: "Science" },
  { code: "STRG", label: "Strategy/Planning" },
  { code: "SUPL", label: "Supply Chain" },
  { code: "TRAI", label: "Training" },
  { code: "WRT", label: "Writing/Editing" },
];

function SkillCheckbox({ skill, selected, onToggle }) {
  const isSelected = selected.includes(skill.label);
  return (
    <button
      type="button"
      onClick={() => onToggle(skill.label)}
      // PERUBAHAN: Menghapus w-full dan menggunakan w-fit agar menyesuaikan isi teks, serta padding disesuaikan agar lebih proporsional sebagai pill
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border-2 text-sm font-bold transition-all duration-300 text-left w-fit shrink-0
        ${isSelected
          ? "bg-primary/5 border-primary text-primary shadow-sm shadow-primary/10"
          : "bg-white/80 border-secondary/20 text-text-main/70 hover:border-primary/40 hover:text-primary hover:bg-white"
        }`}
    >
      <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300
        ${isSelected ? "bg-primary border-primary scale-110" : "border-secondary/40 bg-background/50 group-hover:border-primary/50"}`}>
        {isSelected && <FiCheck size={10} className="text-white stroke-[3] animate-in zoom-in duration-200" />}
      </span>
      {skill.label}
    </button>
  );
}

export default function SkillInput({
  selectedSkills,
  onToggleSkill,
  minSalary,
  maxSalary,
  onMinSalary,
  onMaxSalary,
  search,
  onSearch,
  loading,
  error,
  onSubmit,
}) {
  const filteredSkills = SKILL_LIST.filter((s) =>
    s.label.toLowerCase().includes(search.toLowerCase())
  );

  const formatRupiah = (val) => {
    if (!val) return "";
    return `Rp ${(Number(val) / 1_000_000).toFixed(1)} Jt`;
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white/70 backdrop-blur-xl rounded-[40px] p-6 sm:p-10 shadow-xl border border-secondary/20 flex flex-col gap-10"
    >
      <div className="flex flex-col gap-5">
        <div className="border-b border-secondary/15 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-extrabold text-text-main text-xl tracking-tight font-heading">Skill Saat Ini</h2>
          </div>
          {selectedSkills.length > 0 && (
            <span className=" text-primary  text-xs font-black px-3 py-1.5  uppercase tracking-wider">
              {selectedSkills.length} Dipilih
            </span>
          )}
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Cari keahlianmu (cth: Design, IT, Marketing)..."
          className={inputClass}
        />

        <div className="flex flex-wrap gap-3 max-h-72 overflow-y-auto pr-2 scroll-smooth scrollbar-thin scrollbar-thumb-secondary/30 scrollbar-track-transparent">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill) => (
              <SkillCheckbox
                key={skill.code}
                skill={skill}
                selected={selectedSkills}
                onToggle={onToggleSkill}
              />
            ))
          ) : (
            <div className="w-full flex flex-col items-center justify-center text-text-main/40 py-8 bg-background/50 rounded-2xl border border-dashed border-secondary/30">
              <span className="text-2xl mb-2">🔍</span>
              <p className="text-sm font-bold">Skill tidak ditemukan.</p>
              <p className="text-xs font-medium mt-1">Coba kata kunci lain.</p>
            </div>
          )}
        </div>

        {/* Selected pills */}
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-2.5 p-4 bg-background/80 rounded-2xl border border-secondary/15 animate-in fade-in slide-in-from-top-2 duration-300">
            {selectedSkills.map((s) => (
              <span
                key={s}
                onClick={() => onToggleSkill(s)}
                className="inline-flex items-center gap-2 bg-white text-text-main border border-secondary/20 px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-all shadow-sm group"
                title="Klik untuk hapus"
              >
                {s} 
                <span className="w-4 h-4 rounded-full bg-secondary/10 flex items-center justify-center text-text-main/50 group-hover:bg-danger/20 group-hover:text-danger transition-colors">×</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/*Ekspektasi Gaji */}
      <div className="flex flex-col gap-5">
        <div className="border-b border-secondary/15 pb-4 flex items-center gap-3">
          <h2 className="font-extrabold text-text-main text-xl tracking-tight font-heading">Ekspektasi Gaji</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-text-main/60 uppercase tracking-widest pl-1">Gaji Minimum (IDR)</label>
            <input
              type="number"
              value={minSalary}
              onChange={(e) => onMinSalary(e.target.value)}
              required min="0"
              placeholder="cth: 7000000"
              className={inputClass}
            />
            {minSalary && <p className="text-xs text-primary font-bold pl-1 animate-in fade-in duration-300">{formatRupiah(minSalary)} / bulan</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-text-main/60 uppercase tracking-widest pl-1">Gaji Maksimum (IDR)</label>
            <input
              type="number"
              value={maxSalary}
              onChange={(e) => onMaxSalary(e.target.value)}
              required min="0"
              placeholder="cth: 15000000"
              className={inputClass}
            />
            {maxSalary && <p className="text-xs text-primary font-bold pl-1 animate-in fade-in duration-300">{formatRupiah(maxSalary)} / bulan</p>}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-danger/10 border border-danger/30 text-danger text-sm font-bold rounded-2xl px-5 py-4 flex items-center gap-3 animate-in shake duration-300">
          <span className="text-lg">⚠️</span> {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 mt-2 bg-primary hover:bg-primary/90 text-white font-extrabold tracking-wide rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:-translate-y-1 active:translate-y-0 text-base"
      >
        {loading
          ? <>AI Sedang Menganalisis...</>
          : <>Analisis Job Market</>
        }
      </button>
    </form>
  );
}