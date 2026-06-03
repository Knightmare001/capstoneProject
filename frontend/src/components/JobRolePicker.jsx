const JOB_ROLES = [
  { value: "software_engineer", label: "Software Engineer", icon: "💻" },
  { value: "data_analyst", label: "Data Analyst", icon: "📊" },
  { value: "digital_marketing", label: "Digital Marketing", icon: "📱" },
  { value: "content_creator", label: "Content Creator", icon: "✍️" },
  { value: "sales_executive", label: "Sales Executive", icon: "📈" },
  { value: "sales_representative", label: "Sales Representative", icon: "🛒" },
  { value: "admin_hr", label: "Admin / HR", icon: "👥" },
  { value: "project_manager", label: "Project Manager", icon: "💼" },
];

export default function JobRolePicker({ value, onChange }) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-xs font-black text-text-main/60 uppercase tracking-widest pl-1">
        Job Role
      </label>
      
      <div className="flex flex-wrap gap-3">
        {JOB_ROLES.map((role) => {
          const isSelected = value === role.value;
          return (
            <button
              key={role.value}
              type="button"
              onClick={() => onChange("jobRole", role.value)}
              className={`flex-1 min-w-[120px] flex flex-col items-center justify-center gap-2.5 p-4 rounded-[24px] border-2 transition-all duration-300 text-center group ${
                isSelected
                  ? "bg-primary/10 border-primary text-primary shadow-sm shadow-primary/20 scale-[1.02]"
                  : "bg-white/80 border-secondary/20 text-text-main/70 hover:border-primary/40 hover:bg-white hover:-translate-y-0.5"
              }`}
            >
              <span className="text-2xl drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
                {role.icon}
              </span>
              <span className="text-xs font-bold leading-tight">{role.label}</span>
            </button>
          );
        })}
      </div>

      {value !== "" && (
        <p className="text-[11px] font-bold text-text-main/50 text-center mt-1 animate-in fade-in slide-in-from-top-1">
          Posisi terpilih: <span className="text-primary font-black uppercase tracking-wider ml-1">
            {JOB_ROLES.find(r => r.value === value)?.label}
          </span>
        </p>
      )}
    </div>
  );
}