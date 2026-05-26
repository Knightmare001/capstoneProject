const JOB_ROLES = [
  { value: 0, label: "Human Capital RRserepresentafive", icon: "🤝", desc: "Human Capital Representative" },
  { value: 1, label: "Human Resources", icon: "👥", desc: "Human Resources" },
  { value: 2, label: "Lab Tech", icon: "🔬", desc: "Laboratory Technician" },
  { value: 3, label: "Manager", icon: "💼", desc: "Manager" },
  { value: 4, label: "Manufactoring Director", icon: "🏭", desc: "Manufacturing Director" },
  { value: 5, label: "Research Director", icon: "📊", desc: "Research Director" },
  { value: 6, label: "Research Scientist", icon: "🧪", desc: "Research Scientist" },
  { value: 7, label: "Sales Exec", icon: "📈", desc: "Sales Executive" },
  { value: 8, label: "Sales Rep", icon: "🛒", desc: "Sales Representative" },
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
