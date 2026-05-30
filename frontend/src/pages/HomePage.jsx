import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiLogOut, FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
const BASE_URL = "http://localhost:5001";

export default function HomePage() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const isLoggedIn = !!user;

  const navButton = isLoggedIn ? (
    <div className="relative">
      <button
        className="bg-primary hover:bg-primary/90 text-background px-5 py-2 rounded-full text-sm font-bold transition-colors shadow-md shadow-primary/20"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {user.name || "Profile"}
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-secondary/20 rounded-xl shadow-xl overflow-hidden z-50">
          <button
            onClick={() => { navigate("/profile"); setShowDropdown(false) }}
            className="block w-full px-5 py-3 text-sm text-left text-text-main hover:bg-background transition-colors font-medium"
          >
            Lihat Profile
          </button>
          <button
            onClick={() => { localStorage.removeItem("user"); navigate("/"); setShowDropdown(false) }}
            className="block w-full px-5 py-3 text-sm text-left text-danger hover:bg-danger/10 transition-colors font-medium border-t border-secondary/10"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <button
      onClick={() => navigate("/login")}
      className="bg-primary hover:bg-primary/90 text-background px-5 py-2 rounded-full text-sm font-bold transition-colors shadow-md shadow-primary/20"
    >
      Sign In
    </button>
  );

  const teamMembers = [
    { 
      id: "CDCC009D6Y2672", 
      name: "Arya Ivan Ghally", 
      role: "Data Scientist", 
    },
    { 
      id: "CDCC009D6Y2147", 
      name: "Ananda Nashril Fikri B.", 
      role: "Data Scientist", 
    },
    { 
      id: "CACC009D6X0546", 
      name: "Devi Oktaviani", 
      role: "AI Engineer", 
    },
    { 
      id: "CACC009D6Y0560", 
      name: "Feri Adiansah", 
      role: "AI Engineer", 
    },
    { 
      id: "CFCC009D6Y1107", 
      name: "Egi Prayogi", 
      role: "Full-Stack Developer", 
    },
    { 
      id: "CFCC009D6Y1879", 
      name: "Muhammad Rafi Putra Pati", 
      role: "Full-Stack Developer", 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 text-text-main flex flex-col font-sans">
      
      <Navbar />

      <main className="flex-1">
        
        <section className="relative flex flex-col lg:flex-row justify-center items-center min-h-[calc(100vh-80px)] px-8 lg:px-16 overflow-hidden max-w-7xl mx-auto gap-12 py-10 lg:py-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-3xl -z-10"></div>

          <div className="w-full lg:w-1/2 z-10 flex flex-col items-start text-left">
            <h1 className="text-text-main text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight leading-[1.1]">
              Yakin Mau <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-danger">Resign?</span><br />
              Coba Analisis Dulu.
            </h1>
            <p className="text-lg text-text-main/80 mb-10 leading-relaxed font-medium">
              Jangan ambil keputusan impulsif. Sistem kami menganalisis kepuasan kerja, work-life balance, dan potensi burnout untuk memberikan prediksi dan rekomendasi yang objektif.
            </p>
            <div className="flex gap-4 w-full sm:w-auto">
              <button 
                onClick={() => isLoggedIn ? navigate("/analyze") : navigate("/login")}
                className="bg-primary hover:bg-primary/90 transition-all transform hover:-translate-y-1 text-background px-8 py-3.5 rounded-full text-base font-bold shadow-xl shadow-primary/30 w-full sm:w-auto text-center"
              >
                Mulai Analisis
              </button>
              <button
                onClick={() => isLoggedIn ? navigate("/skill") : navigate("/login")}
                className="bg-white hover:bg-secondary/5 border-2 border-secondary/20 transition-all transform hover:-translate-y-1 text-text-main px-8 py-3.5 rounded-full text-base font-bold w-full sm:w-auto text-center"
              >
                Cek Skill Kamu
            </button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative z-10 flex justify-center mt-10 lg:mt-0">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl border border-secondary/20 w-full max-w-md transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex justify-between items-center mb-6 border-b border-background pb-4">
                <h3 className="font-bold text-text-main flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-danger animate-pulse"></span>
                  Prediction
                </h3>
              </div>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-1.5 font-bold">
                    <span className="text-text-main/80">Stress Level</span>
                    <span className="text-danger">35%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2.5">
                    <div className="bg-danger h-2.5 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5 font-bold">
                    <span className="text-text-main/80">Keahlian Kerja</span>
                    <span className="text-secondary">60%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2.5">
                    <div className="bg-secondary h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-background p-4 rounded-xl border border-secondary/10 text-sm text-text-main/80">
                <p className="font-bold text-text-main mb-1 flex items-center gap-2">
                   Rekomendasi AI:
                </p>
                Pertimbangkan untuk mengambil cuti sebelum memutuskan resign. Kondisi saat ini sangat dipengaruhi oleh kelelahan kronis.
              </div>
            </div>
          </div>
        </section>

        <section className="px-8 lg:px-20 py-24 flex flex-col items-center justify-center bg-text-main text-background relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-text-main to-text-main opacity-60"></div>
          
          <div className="relative z-10 w-full max-w-6xl text-center">
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">
              Tim Capstone CC26-PSU097
            </span>
            <h2 className="text-4xl font-extrabold mb-4">
              Di Balik Layar ResignAjaDulu
            </h2>
            <p className="text-background/70 text-lg mb-16 max-w-2xl mx-auto">
              Proyek ini dikembangkan secara kolaboratif oleh 6 talenta dari learning path Data Science, AI Engineering, dan Full-Stack Web Development.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 w-full">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="flex-1 min-w-[280px] max-w-[350px] bg-background/5 border border-secondary/20 p-6 rounded-2xl hover:bg-background/10 hover:-translate-y-2 transition-all duration-300 text-left backdrop-blur-sm group flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-lg leading-tight text-background">{member.name}</h3>
                      <p className="text-primary font-semibold text-sm">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-secondary/20">
                    <span className="text-background/50 font-mono text-xs">
                      ID: {member.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}