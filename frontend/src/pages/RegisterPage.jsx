import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { FiUser, FiLock, FiMail, FiCheckCircle } from 'react-icons/fi';

function RegisterPage() {
    const [name, onChangeName] = useInput('');       
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');
    const [confirmPassword, onChangeConfirmPassword] = useInput('');
    
    const [errorMsg, setErrorMsg] = useState(""); 
    const [successMsg, setSuccessMsg] = useState(""); 
    const [isLoading, setIsLoading] = useState(false); 

    const navigate = useNavigate();                   

    async function onSubmitHandler(event){
        event.preventDefault();
        setErrorMsg(""); 
        setSuccessMsg("");

        if (password !== confirmPassword) {
            return setErrorMsg("Password dan Konfirmasi Password tidak cocok!");
        }

        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:5001/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name, email, password })  
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMsg("Akun berhasil dibuat! Mengalihkan ke login...");
                
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setErrorMsg(data.message || "Register gagal.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error fetching:", error);
            setErrorMsg("Gagal terhubung ke server. Periksa koneksi Anda.");
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex flex-col items-center justify-center p-4 sm:p-8 font-sans text-text-main">
            
            <header className="w-full max-w-xl mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-background font-bold text-xl drop-shadow-md">R</div>
                <p className="font-extrabold text-text-main text-2xl tracking-tight">ResignAjaDulu</p>
            </header>

            <div className="bg-white/95 backdrop-blur-sm w-full max-w-xl rounded-[40px] shadow-2xl border border-secondary/20 flex overflow-hidden min-h-[500px]">
                <div className="flex-1 p-10 sm:p-16 flex flex-col justify-center items-center">
                    
                    <h1 className="text-3xl font-extrabold mb-1 tracking-tight text-text-main">Buat Akun</h1>
                    <p className="text-text-main/50 font-medium mb-10 text-center">Daftar sekarang untuk mulai menganalisis potensimu</p>
                    
                    <form onSubmit={onSubmitHandler} className="w-full max-w-sm flex flex-col gap-5">
                        
                        <div className="relative">
                            <FiUser className="absolute left-4 top-4 text-text-main/40 text-lg" />
                            <input 
                                type="text" 
                                placeholder="Nama Lengkap" 
                                value={name} 
                                onChange={onChangeName} 
                                required 
                                disabled={isLoading || successMsg}
                                className="w-full border-2 border-secondary/20 p-3 pl-12 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-text-main placeholder:text-text-main/30 disabled:opacity-50 disabled:bg-slate-50"
                            />
                        </div>

                        <div className="relative">
                            <FiMail className="absolute left-4 top-4 text-text-main/40 text-lg" />
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={onChangeEmail} 
                                required 
                                disabled={isLoading || successMsg}
                                className="w-full border-2 border-secondary/20 p-3 pl-12 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-text-main placeholder:text-text-main/30 disabled:opacity-50 disabled:bg-slate-50"
                            />
                        </div>

                        <div className="relative">
                            <FiLock className="absolute left-4 top-4 text-text-main/40 text-lg" />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={onChangePassword} 
                                required 
                                minLength="6"
                                disabled={isLoading || successMsg}
                                className="w-full border-2 border-secondary/20 p-3 pl-12 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-text-main placeholder:text-text-main/30 disabled:opacity-50 disabled:bg-slate-50"
                            />
                        </div>

                        <div className="relative">
                            <FiLock className="absolute left-4 top-4 text-text-main/40 text-lg" />
                            <input 
                                type="password" 
                                placeholder="Konfirmasi Password" 
                                value={confirmPassword} 
                                onChange={onChangeConfirmPassword} 
                                required 
                                minLength="6"
                                disabled={isLoading || successMsg}
                                className="w-full border-2 border-secondary/20 p-3 pl-12 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-text-main placeholder:text-text-main/30 disabled:opacity-50 disabled:bg-slate-50"
                            />
                        </div>

                        {errorMsg && (
                            <div className="bg-danger/10 border border-danger/20 text-danger text-sm text-center p-3 rounded-xl font-bold animate-in fade-in zoom-in-95 duration-200">
                                {errorMsg}
                            </div>
                        )}

                        {successMsg && (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm text-center p-3 rounded-xl font-bold animate-in fade-in zoom-in-95 duration-200 flex items-center justify-center gap-2">
                                <FiCheckCircle size={18} />
                                {successMsg}
                            </div>
                        )}
                    
                        <button 
                            type="submit"
                            disabled={isLoading || successMsg} 
                            className="bg-primary hover:bg-primary/90 text-background py-3.5 rounded-xl font-bold mt-2 shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                        >
                            {isLoading && !successMsg ? "MEMPROSES..." : "DAFTAR SEKARANG"}
                        </button>
                    </form>
                    
                    <p className="mt-8 text-text-main/60 text-sm font-medium">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">
                            Login di sini
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default RegisterPage;