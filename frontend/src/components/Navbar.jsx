import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiLogOut, FiSettings, FiChevronDown } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  // Cek localStorage saat mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); }
      catch { setUser({ name: "User" }); }
    }
  }, []);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-secondary/15 sticky top-0 z-50 transition-all">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl leading-none transition-transform group-hover:scale-105 shadow-sm shadow-primary/20">
            R
          </div>
          <p className="font-extrabold text-text-main text-lg tracking-tight font-heading">
            ResignAjaDulu
          </p>
        </Link>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="h-10 px-4 rounded-full border border-secondary/30 bg-white hover:border-secondary hover:bg-secondary/5 flex items-center justify-center gap-2.5 transition-all shadow-sm"
            >
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-[11px] font-black shrink-0">
                {initials}
              </div>
              <FiChevronDown
                size={14}
                className={`text-text-main/40 transition-transform duration-300 shrink-0 ${showDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-secondary/20 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Info user */}
                <div className="px-5 py-4 border-b border-secondary/10 bg-background/50 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-black shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-text-main/40 uppercase tracking-widest">Selamat Datang,</p>
                    <p className="font-extrabold text-text-main truncate">{user.name || "User"}</p>
                    {user.email && (
                      <p className="text-[11px] text-text-main/50 font-medium truncate">{user.email}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                  className="w-full px-5 py-3.5 text-sm text-left text-text-main hover:bg-secondary/10 font-semibold flex items-center gap-3 transition-colors"
                >
                  <FiSettings size={16} className="text-secondary" />
                  Profil & Riwayat
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-3.5 text-sm text-left text-danger hover:bg-danger/10 font-bold border-t border-secondary/10 flex items-center gap-3 transition-colors"
                >
                  <FiLogOut size={16} />
                  Keluar Aplikasi
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