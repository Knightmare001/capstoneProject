export default function ToggleInput({ label, name, value, onChange, description }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-slate-100 hover:border-[#7B85CE] transition-colors">
      <div>
        <p className="font-semibold text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(name, value === 1 ? 0 : 1)}
        className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
          value === 1 ? "bg-[#4F5DB3]" : "bg-slate-200"
        }`}
      >
        <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
          value === 1 ? "left-8" : "left-1"
        }`} />
      </button>
    </div>
  );
}
