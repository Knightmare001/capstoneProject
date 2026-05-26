export default function RatingInput({ label, name, value, onChange, min = 1, max = 4, description }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">{label}</label>
      {description && <p className="text-xs text-slate-400">{description}</p>}
      <div className="flex gap-2">
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => onChange(name, val)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border-2 ${
              value === val
                ? "bg-[#4F5DB3] text-white border-[#4F5DB3] shadow-lg scale-105"
                : "bg-white text-slate-500 border-slate-200 hover:border-[#4F5DB3] hover:text-[#4F5DB3]"
            }`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
}
