import { FiClipboard, FiCpu, FiCheckCircle } from "react-icons/fi";

const STEPS = [
  {
    icon: <FiClipboard size={28} />,
    num: "01",
    title: "Isi Formulir",
    desc: "Masukkan data karier, kondisi kerja, dan situasi finansialmu. Hanya butuh 3-5 menit."
  },
  {
    icon: <FiCpu size={28} />,
    num: "02",
    title: "AI Menganalisis",
    desc: "Model AI kami memproses datamu dan menghitung skor potensi resign serta kesiapan finansial."
  },
  {
    icon: <FiCheckCircle size={28} />,
    num: "03",
    title: "Ambil Keputusan",
    desc: "Dapatkan rekomendasi objektif berbasis data. Bukan berdasarkan emosi sesaat."
  },
];

export default function HowItWorks() {
  return (
    <section className="px-6 lg:px-16 py-24 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-text-main tracking-tight mb-3 font-heading">
          Cara <span className="text-primary">Kerjanya</span>
        </h2>
        <p className="text-text-main/50 font-medium text-sm max-w-md mx-auto">
          Tiga langkah sederhana untuk keputusan karier yang lebih terukur
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {STEPS.map((step, i) => (
          <div key={i} className="flex-1 bg-white border border-secondary/20 rounded-[32px] p-8 flex flex-col gap-4 shadow-sm hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                {step.icon}
              </div>
              <span className="font-black text-4xl text-secondary/20 font-heading">{step.num}</span>
            </div>
            <h3 className="font-black text-xl text-text-main font-heading">{step.title}</h3>
            <p className="text-sm text-text-main/60 font-medium leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}