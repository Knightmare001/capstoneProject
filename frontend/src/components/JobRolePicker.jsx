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
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Role</label>
      <div className="grid grid-cols-3 gap-2">
        {JOB_ROLES.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => onChange("jobRole", role.value)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all duration-200 text-center ${
              value === role.value
                ? "bg-[#4F5DB3] border-[#4F5DB3] text-white shadow-lg scale-105"
                : "bg-white border-slate-100 text-slate-600 hover:border-[#7B85CE]"
            }`}
          >
            <span className="text-xl">{role.icon}</span>
            <span className="text-xs font-bold leading-tight">{role.label}</span>
          </button>
        ))}
      </div>
      {value !== "" && (
        <p className="text-xs text-slate-400 text-center mt-1">
          Dipilih: <span className="font-semibold text-[#4F5DB3]">{JOB_ROLES.find(r => r.value === value)?.desc}</span>
        </p>
      )}
    </div>
  );
}
