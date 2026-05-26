import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiLogOut, FiArrowRight } from 'react-icons/fi';

const BASE_URL = "http://localhost:5001";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate('/login');
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      setUser(parsed.data || parsed);
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (e) {
      // tetap logout meski server error
    }
    localStorage.removeItem("user");
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-[#F1F5F9] pb-12 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Selamat datang,</p>
            <h1 className="font-extrabold text-slate-800 text-lg leading-none mt-0.5">
              {user?.name || "User"} 
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-500 font-bold hover:text-red-500 transition-colors bg-white/80 border border-slate-100 px-4 py-2 rounded-xl shadow-sm"
          >
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto w-full px-6 py-8 flex flex-col gap-6">

        {/* Hero Banner dengan warna gradasi yang pop-out di atas background abu-abu */}
        <div className="bg-gradient-to-br from-[#3B4891] via-[#4F5DB3] to-[#6A79CE] rounded-3xl p-7 text-white relative overflow-hidden shadow-2xl shadow-black/20 border border-white/10">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-sm" />
          <div className="absolute -right-4 -bottom-10 w-28 h-28 bg-white/10 rounded-full blur-sm" />
          <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-1">ResignAjaDulu</p>
          <h2 className="text-2xl font-extrabold mb-2 leading-snug">
            Prediksi Potensi<br />Resign Karyawan
          </h2>
          <p className="text-sm text-white/80 mb-5 max-w-[85%] leading-relaxed">
            Gunakan kekuatan AI untuk menganalisis apakah karyawanmu berisiko turnover.
          </p>
          <button
            onClick={() => navigate('/analyze')}
            className="bg-white text-[#4F5DB3] font-extrabold px-6 py-3 rounded-2xl text-sm hover:bg-slate-50 transition-all shadow-lg active:scale-95"
          >
             Mulai Analisis
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-4">
          <FeatureCard
            icon={<FiSearch size={22} className="text-[#4F5DB3]" />}
            bg="bg-[#EEF0FF]"
            title="Analisis Resign"
            description="Masukkan 14 parameter ringkas karyawan dan dapatkan prediksi AI secara instan."
            onClick={() => navigate('/analyze')}
            cta="Mulai"
          />
          <FeatureCard
            icon={<FiClock size={22} className="text-amber-600" />}
            bg="bg-amber-50"
            title="Riwayat Analisis"
            description="Lihat semua hasil manajemen prediksi yang pernah kamu simpan sebelumnya."
            onClick={() => navigate('/history')}
            cta="Lihat Riwayat"
          />
        </div>

        {/* Info Section - Ditambahkan border tipis agar pop up */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-black/5">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-50 pb-2">💡 Cara Kerja Aplikasi</h3>
          <div className="flex flex-col gap-4">
            <Step num="1" text="Isi data yang diperlukan" />
            <Step num="2" text="Sistem menghitung indeks stagnasi dan rasio loyalitas di background" />
            <Step num="3" text="AI menganalisis pola retensi data untuk memprediksi risiko resign" />
            <Step num="4" text="Dapatkan rekomendasi taktis serta simpan hasil analisis ke riwayat" />
          </div>
        </div>

      </div>
    </main>
  );
}

function FeatureCard({ icon, bg, title, description, onClick, cta }) {
  return (
    <button
      onClick={onClick}
      // ✨ FIX: Ditambahkan border luar 'border-white/40' dan shadow-xl hitam transparan agar kartu tidak tenggelam di atas warna abu-abu
      className="bg-white rounded-3xl p-5 border border-white/40 text-left shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 hover:border-white/80 transition-all flex items-center gap-4 group"
    >
      <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-800 group-hover:text-[#4F5DB3] transition-colors">{title}</h3>
        <p className="text-sm text-slate-400 mt-0.5 leading-snug">{description}</p>
      </div>
      <span className="text-[#4F5DB3] font-bold text-sm flex-shrink-0 flex items-center gap-1 bg-[#EEF0FF] px-3 py-1.5 rounded-xl group-hover:bg-[#4F5DB3] group-hover:text-white transition-all">
        {cta} <FiArrowRight size={14} />
      </span>
    </button>
  );
}

function Step({ num, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 bg-[#EEF0FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-xs font-extrabold text-[#4F5DB3]">{num}</span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}