import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiClock, FiLogOut, FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import HowItWork from '../components/HowItWork';
import Features from '../components/Features';
const BASE_URL = "http://localhost:5001";

export default function HomePage() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const isLoggedIn = !!user;

  // Data Tim 
  const teamMembers = [
    { id: "CDCC009D6Y2672", name: "Arya Ivan Ghally", role: "Data Scientist" },
    { id: "CDCC009D6Y2147", name: "Ananda Nashril Fikri B.", role: "Data Scientist" },
    { id: "CACC009D6X0546", name: "Devi Oktaviani", role: "AI Engineer" },
    { id: "CACC009D6Y0560", name: "Feri Adiansah", role: "AI Engineer" },
    { id: "CFCC009D6Y1107", name: "Egi Prayogi", role: "Full-Stack Developer" },
    { id: "CFCC009D6Y1879", name: "Muhammad Rafi Putra Pati", role: "Full-Stack Developer" }
  ];

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col font-sans relative">
      
      {/* Background Blobs Global */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/2 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-3xl -z-10"></div>

      <Navbar />

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative flex flex-col lg:flex-row justify-center items-center min-h-[calc(100vh-80px)] px-6 lg:px-16 max-w-7xl mx-auto gap-12 py-12 lg:py-0">
          
          <div className="w-full lg:w-1/2 z-10 flex flex-col items-start text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-text-main text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-[1.1] font-heading">
              Yakin Mau <span className="text-primary">Resign?</span><br />
              Coba Analisis Dulu.
            </h1>
            <p className="text-lg text-text-main/70 mb-10 leading-relaxed font-medium max-w-lg">
              Jangan ambil keputusan impulsif. Sistem kami menganalisis kepuasan kerja, work-life balance, dan potensi burnout untuk memberikan prediksi dan rekomendasi yang objektif.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <button 
                onClick={() => isLoggedIn ? navigate("/analyze") : navigate("/login")}
                className="w-full sm:w-auto px-10 py-4 rounded-full font-black text-xs bg-primary text-white hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 uppercase tracking-widest hover:-translate-y-1 text-center"
              >
                Mulai Analisis
              </button>
              <button
                onClick={() => isLoggedIn ? navigate("/skill") : navigate("/login")}
                className="w-full sm:w-auto px-10 py-4 rounded-full font-black text-xs bg-white text-text-main hover:bg-secondary/10 transition-all uppercase tracking-widest border border-secondary/30 hover:-translate-y-1 text-center shadow-sm"
              >
                Cek Skill Kamu
              </button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative z-10 flex justify-center mt-10 lg:mt-0 animate-in fade-in zoom-in-95 duration-700 delay-200">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[40px] shadow-2xl shadow-secondary/10 border border-secondary/20 w-full max-w-md transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
              
              <div className="flex justify-between items-center mb-6 border-b border-secondary/10 pb-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-text-main flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Prediction
                </h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs mb-2 font-black uppercase tracking-wider">
                    <span className="text-text-main/60">Stress Level</span>
                    <span className="text-primary">35%</span>
                  </div>
                  <div className="w-full bg-secondary/10 rounded-full h-3 overflow-hidden border border-secondary/20">
                    <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2 font-black uppercase tracking-wider">
                    <span className="text-text-main/60">Keahlian Kerja</span>
                    <span className="text-secondary">60%</span>
                  </div>
                  <div className="w-full bg-secondary/10 rounded-full h-3 overflow-hidden border border-secondary/20">
                    <div className="bg-secondary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-background/60 p-5 rounded-3xl border border-secondary/10">
                <p className="font-black text-[10px] text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                   Rekomendasi:
                </p>
                <p className="text-[13px] font-semibold text-text-main/70 leading-relaxed italic">
                  "Pertimbangkan untuk mengambil cuti sebelum memutuskan resign. Kondisi saat ini sangat dipengaruhi oleh kelelahan kronis."
                </p>
              </div>
            </div>
          </div>
        </section>
         
        <Features />

        <HowItWork />
        
        {/* TEAM SECTION*/}
        <section className="px-6 lg:px-16 py-24 flex flex-col items-center justify-center bg-text-main text-background relative overflow-hidden mt-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-text-main to-text-main opacity-80"></div>
          
          <div className="relative z-10 w-full max-w-6xl text-center">
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">
              Tim Capstone CC26-PSU097
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 font-heading text-white tracking-tight">
              Di Balik Layar ResignAjaDulu
            </h2>
            <p className="text-white/70 text-base md:text-lg mb-16 max-w-2xl mx-auto font-medium leading-relaxed">
              Proyek ini dikembangkan secara kolaboratif oleh 6 talenta dari learning path Data Science, AI Engineering, dan Full-Stack Web Development.
            </p>

            <div className="flex flex-wrap justify-center gap-6 w-full items-stretch">
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  className="flex-1 min-w-[100%] sm:min-w-[calc(50%-1.5rem)] lg:min-w-[calc(33.333%-1.5rem)] bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[32px] hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-left group flex flex-col shadow-2xl hover:-translate-y-2"
                >
                  <div className="flex-1">
                    <h3 className="font-black text-xl leading-tight text-white font-heading">{member.name}</h3>
                    <p className="text-primary font-bold text-[11px] uppercase tracking-widest mt-2">{member.role}</p>
                  </div>
                  
                  <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                    <span className="text-white/50 font-bold text-[10px] uppercase tracking-widest">
                      ID Cohort
                    </span>
                    <span className="text-white/60 font-mono text-xs bg-white/10 px-2 py-1 rounded-md">
                      {member.id}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <FAQ />
        <Footer />
      </main>
    </div>
  );
}