export default function SliderInput({ label, name, value, onChange, min = 0, max = 10, step = 0.1, description }) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
        <span className="text-sm font-bold text-[#4F5DB3] bg-[#EEF0FF] px-3 py-0.5 rounded-full">
          {Number(value).toFixed(step < 1 ? 1 : 0)}
        </span>
      </div>
      {description && <p className="text-xs text-slate-400">{description}</p>}
      <div className="relative py-2">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#4F5DB3] to-[#7B85CE] rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(name, parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-6 top-0"
        />
        {/* Custom thumb */}
        <div
          className="absolute top-0.5 w-5 h-5 bg-white border-2 border-[#4F5DB3] rounded-full shadow-md -translate-x-1/2 transition-all pointer-events-none"
          style={{ left: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-300">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
