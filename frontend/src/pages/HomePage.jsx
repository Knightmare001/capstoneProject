import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiLogOut, FiArrowRight } from 'react-icons/fi';

const BASE_URL = "http://localhost:5001";

export default function HomePage() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!user

  const navButton = isLoggedIn ? (
    <div>
      <button
        className="bg-gray-200 px-4 py-2 rounded-full text-sm"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {user.name || "Profile"}
      </button>
      {showDropdown && (
        <div className="absolute right-6 top-14 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden z-10">
          <button
            onClick={() => { navigate("/profile"); setShowDropdown(false) }}
            className="block w-full px-5 py-3 text-sm text-left hover:bg-gray-50"
          >
            Lihat Profile
          </button>
          <button
            onClick={() => { localStorage.removeItem("user"); navigate("/"); setShowDropdown(false) }}
            className="block w-full px-5 py-3 text-sm text-left text-red-500 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <button
      onClick={() => navigate("/login")}
      className="bg-gray-200 px-4 py-2 rounded-full text-sm"
    >
      Sign In
    </button>
  )

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white px-6 py-4 flex justify-between items-center relative">
        <p className="font-bold">ResignAjaDulu</p>
        {navButton}
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex-1 bg-blue-500 flex items-center justify-center px-10 gap-10">
        <div className="w-1/2">
          <h1 className="text-white text-5xl font-bold mb-6">Capek Kerja Terus tapi Takut Resign? Yuk, kita Cek Kesiapanmu!</h1>
          <p className="text-xl text-white mb-10 leading-relaxed text-slate-600">
            Jangan asal ambil keputusan. ResignAjaDulu menganalisis kepuasan kerja, work-life balance, hingga potensi burnout kamu menggunakna model AI untuk memberikan prediksi yang objektif.
          </p>
          <button
            onClick={() => isLoggedIn ? navigate("/analyze") : navigate("/login")}
            className="bg-blue-400 text-white px-5 py-2 rounded-full text-sm"
          >
            Mulai Analisis
          </button>
        </div>
        <div className="w-1/2 h-130 bg-blue-400 rounded-2xl flex items-center justify-center text-white text-sm">
          buat gambar
        </div>
      </section>

      {/* About Us */}
      <section className="bg-blue-500 px-10 py-12 flex items-center justify-center flex-col">
        <h2 className="text-white text-2xl font-bold text-gray-800 mb-2">About Us</h2>
        <p className="text-gray-100 text-sm mb-6">Tim di balik ResignAjaDulu</p>
      </section>
    </div>
  );
}
