import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiLogOut, FiSettings, FiChevronDown } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);

  // Mengecek status login dari localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser({ name: "User" });
      }
    }
  }, []);

  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    navigate("/");
  };

  return (
    // NAVBAR 
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-secondary/15 sticky top-0 z-50 transition-all">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        
        <Link to="/home" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl leading-none transition-transform group-hover:scale-105 shadow-sm shadow-primary/20">
            R
          </div>
          <p className="font-extrabold text-text-main text-lg tracking-tight font-heading">
            ResignAjaDulu
          </p>
        </Link>

        {/* Logika Tombol Auth */}
        {isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="h-10 px-4 rounded-full border border-secondary/30 bg-white hover:border-secondary hover:bg-secondary/5 flex items-center justify-center gap-2.5 transition-all shadow-sm group"
            >
              <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary/20 transition-colors">
                <FiUser size={15} />
              </div>
              <FiChevronDown className={`text-text-main/40 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
            </button>
            
            {/* Dropdown Menu Style Glassmorphism Putih */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-52 bg-white/95 backdrop-blur-sm border border-secondary/20 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-5 py-4 border-b border-secondary/10 bg-background/50">
                  <p className="text-[10px] font-black text-text-main/40 uppercase tracking-widest">Selamat Datang,</p>
                  <p className="font-extrabold text-text-main truncate">{user.name || "User"}</p>
                </div>

                <button
                  onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                  className="w-full px-5 py-3.5 text-sm text-left text-text-main hover:bg-secondary/10 font-semibold flex items-center gap-3 transition-colors"
                >
                  <FiSettings size={16} className="text-secondary" /> 
                  Pengaturan Profil
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-3.5 text-sm text-left text-danger hover:bg-danger/10 font-bold border-t border-secondary/10 flex items-center gap-3 transition-colors"
                >
                  <FiLogOut size={16} /> 
                  Keluar Aplikasii
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="h-10 px-6 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all text-sm font-extrabold shadow-md shadow-primary/20 hover:-translate-y-0.5"
          >
            Masuk
          </button>
        )}
        
      </div>
    </nav>
  );
}