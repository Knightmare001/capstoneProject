export default function Field({ label, icon, description, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        {icon && <span className="text-[#7B85CE]">{icon}</span>}
        {label}
      </label>
      {description && <p className="text-xs text-slate-400">{description}</p>}
      {children}
    </div>
  );
}
