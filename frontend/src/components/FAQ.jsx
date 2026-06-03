import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const FAQ_LIST = [
  {
    question: "Apa itu ResignAjaDulu?",
    answer: "ResignAjaDulu adalah aplikasi web cerdas yang membantu kamu mengambil keputusan resign secara terukur, bukan impulsif. Kami menggabungkan analisis karier berbasis AI dan kalkulator finansial untuk memberikan gambaran objektif tentang kesiapanmu."
  },
  {
    question: "Bagaimana cara kerja analisis karier?",
    answer: "Kami menggunakan model Deep Learning berbasis IBM HR Attrition Dataset yang dilatih untuk memprediksi probabilitas seseorang akan resign berdasarkan data demografi, masa kerja, kepuasan kerja, dan kondisi lingkungan kantor."
  },
  {
    question: "Apakah data saya aman?",
    answer: "Ya. Data yang kamu masukkan hanya digunakan untuk kalkulasi analisis dan disimpan di akun pribadimu. Kami tidak membagikan data apapun ke pihak ketiga."
  },
  {
    question: "Berapa akurat prediksi AI-nya?",
    answer: "Model AI kami mencapai akurasi minimal 90% dengan F1-score di atas 0.75 berdasarkan evaluasi pada dataset validasi. Namun tetap ingat, hasil ini bersifat prediktif dan bukan keputusan final."
  },
  {
    question: "Apa itu Skor Finansial?",
    answer: "Skor Finansial (0-100) mengukur seberapa siap kamu secara finansial jika resign hari ini. Dihitung dari tabungan, pengeluaran bulanan, cicilan, status asuransi, prospek kerja baru, dan ada tidaknya side hustle."
  },
  {
    question: "Apakah saya harus login untuk menggunakan aplikasi?",
    answer: "Ya, kamu perlu login untuk mengakses fitur analisis dan menyimpan riwayat. Daftar gratis hanya butuh nama, email, dan password."
  },
];

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-secondary/20 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-background transition-colors gap-4"
      >
        <p className="font-bold text-text-main text-sm">{question}</p>
        <FiChevronDown
          size={18}
          className={`text-primary shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm text-text-main/70 font-medium leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="w-full max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-text-main tracking-tight mb-2">
            <span className="text-primary">FAQ</span>
        </h2>
        <p className="text-text-main/50 font-medium text-sm">Semua yang perlu kamu tahu tentang ResignAjaDulu</p>
      </div>
      <div className="flex flex-col gap-3">
        {FAQ_LIST.map((item, i) => (
          <FAQItem key={i} question={item.question} answer={item.answer} />
        ))}
      </div>
    </section>
  );
}