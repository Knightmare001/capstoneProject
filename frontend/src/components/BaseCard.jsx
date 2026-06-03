export default function BaseCard({ title, children }) {
  return (
    <div className="flex-1 min-w-[100%] md:min-w-[calc(50%-1.5rem)] bg-white/80 backdrop-blur-sm border border-secondary/20 rounded-[40px] p-8 shadow-xl shadow-secondary/5 flex flex-col min-h-[250px] transition-transform hover:scale-[1.01]">
      
      {/* Bagian Header / Judul Card (Hanya muncul kalau ada props title) */}
      {title && (
        <div className="w-full flex items-center justify-between border-b border-secondary/10 pb-4 mb-6">
          <h3 className="font-black text-xs uppercase tracking-widest text-text-main/40">
            {title}
          </h3>
        </div>
      )}
      
      {/* Tempat Konten Dinamis (Terserah mau diisi apa saja dari luar) */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      
    </div>
  );
}