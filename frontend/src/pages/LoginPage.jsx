import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../hooks/useInput";
import { FiUser, FiLock } from "react-icons/fi";
import Illustration from "../assets/pilihan.jpeg";

const BASE_URL = import.meta.env.VITE_BACKEND_SERVICE_URL;

function LoginPage() {
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setErrorMsg("");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.data));
        navigate("/");
      } else {
        setErrorMsg(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error fetching:", error);
      setErrorMsg("Gagal terhubung ke server");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex flex-col items-center justify-center p-4 sm:p-8 font-sans text-text-main">
      <header className="w-full max-w-5xl mb-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-background font-bold text-xl drop-shadow-md">
          R
        </div>
        <p className="font-extrabold text-text-main text-2xl tracking-tight">ResignAjaDulu</p>
      </header>

      {/* Card Utama */}
      <div className="bg-white/95 backdrop-blur-sm w-full max-w-xl rounded-[40px] shadow-2xl border border-secondary/20 flex overflow-hidden min-h-[500px]">
        {/* Sisi Kiri: Form */}
        <div className="flex-1 p-10 sm:p-16 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-extrabold mb-1 tracking-tight text-text-main">Welcome back</h1>
          <p className="text-text-main/50 font-medium mb-10">Silakan masuk ke akun Anda</p>

          <form onSubmit={onSubmitHandler} className="w-full max-w-sm flex flex-col gap-5">
            <div className="relative">
              <FiUser className="absolute left-4 top-4 text-text-main/40 text-lg" />
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={onChangeEmail}
                required
                className="w-full border-2 border-secondary/20 p-3 pl-12 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-text-main placeholder:text-text-main/30"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-4 text-text-main/40 text-lg" />
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={onChangePassword}
                required
                minLength="6"
                className="w-full border-2 border-secondary/20 p-3 pl-12 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-text-main placeholder:text-text-main/30"
              />
            </div>

            {errorMsg && (
              <div className="bg-danger/10 border border-danger/20 text-danger text-sm text-center p-3 rounded-xl font-bold animate-in fade-in zoom-in-95 duration-200">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-background py-3.5 rounded-xl font-bold mt-2 shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all"
            >
              LOGIN
            </button>
          </form>

          <p className="mt-8 text-text-main/60 text-sm font-medium">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
