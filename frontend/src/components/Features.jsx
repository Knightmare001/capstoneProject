import { FiCpu, FiDollarSign, FiClock, FiShield } from "react-icons/fi";

const FEATURES = [
  {
    icon: <FiCpu size={24} />,
    title: "Prediksi Berbasis AI",
    desc: "Model Deep Learning kami dilatih dengan IBM HR Attrition Dataset untuk memprediksi potensi resignmu secara objektif."
  },
  {
    icon: <FiDollarSign size={24} />,
    title: "Kalkulator Finansial",
    desc: "Hitung berapa bulan tabunganmu bisa bertahan tanpa gaji. Resign butuh angka, bukan perasaan."
  },
  {
    icon: <FiClock size={24} />,
    title: "Riwayat Analisis",
    desc: "Pantau perkembangan kondisi kerjamu dari waktu ke waktu. Setiap analisis tersimpan di akunmu."
  },
  {
    icon: <FiShield size={24} />,
    title: "Data Aman",
    desc: "Data yang kamu masukkan hanya digunakan untuk kalkulasi pribadimu dan tidak dibagikan ke pihak manapun."
  },
];

export default function Features() {
  return (
    <section className="bg-text-main relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-text-main to-text-main opacity-80" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white tracking-tight mb-3 font-heading">
            Kenapa <span className="text-primary">ResignAjaDulu?</span>
          </h2>
          <p className="text-white/70 font-medium text-sm max-w-md mx-auto">
            Bukan sekadar kalkulator biasa. Ini alat bantu keputusan karier yang serius.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] p-8 flex flex-col gap-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-black text-lg text-white font-heading">{f.title}</h3>
              <p className="text-sm text-white/60 font-medium leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}