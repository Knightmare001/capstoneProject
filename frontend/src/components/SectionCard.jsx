export default function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-5 border border-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[#4F5DB3]">{icon}</span>
        <h2 className="font-bold text-slate-700">{title}</h2>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
