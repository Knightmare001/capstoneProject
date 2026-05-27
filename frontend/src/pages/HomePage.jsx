import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiLogOut, FiArrowRight } from 'react-icons/fi';

const BASE_URL = "http://localhost:5001";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

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
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white px-6 py-4 flex justify-between items-center">
        <p className="font-bold">ResignAjaDulu</p>
        <div>
          <button 
            className="bg-gray-200 px-4 py-2 rounded-full text-sm"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            profile
          </button>
          {showDropdown && (
            <div className="absolute right-6 top-14 bg-white border border-gray-200 rounded-xl shadown-md overflow-hidden">
              <button
                onClick={() => { navigate("/profile"); setShowDropdown(false) }}
                className="block w-full px-5 py-3 text-sm text-left text-red-500 hover:bg-gray-50"
              >
                Lihat Profile
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("user")
                  navigate("/")
                  setShowDropdown(false)
                 }}
                className="block w-full px-5 py-3 text-sm text-left hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 bg-blue-500 flex items-center px-10 gap-6">
        <div className="flex-1">
          <h1 className="text-white text-5xl font-bold mb-6">Prediksi Resign Karyawan</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/analyze")}
              className="bg-blue-400 text-white px-5 py-2 rounded-full text-sm"
            >
              Mulai Analisis
            </button>
            <button 
              onClick={() => navigate("/team")}
              className="bg-blue-400 text-white px-5 py-2 rounded-full text-sm"
            >
              About Us
            </button>
          </div>
        </div>
        <div className="w-104 h-102 bg-blue-400 rounded-2xl flex items-center justify-center text-white text-sm">
          buat gambar
        </div>
      </section>
    </div>
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