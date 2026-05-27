import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useInput from "../hooks/useInput";
import { FiUser, FiLock } from "react-icons/fi";
import Illustration from "../assets/pilihan.jpeg";

function LoginPage() {
  //siapin state
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [errorMsg, setErrorMsg] = useState("");
  //siapin handler(ngerubah state) ketika disubmit

  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    //panggil fungsi agar page tidak kerefresh
    event.preventDefault();
    setErrorMsg("");

    try {
      //kirim data ke api buat validasi
      const response = await fetch(`http://localhost:5001/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/home");
      } else {
        setErrorMsg(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error fetching:", error);
      alert("failed to connect to the server");
    }
  };

  return (
    <main className="min-h-screen bg-blue-500 flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <header className="w-full max-w-5xl mb-8">
        <span className="bg-white px-6 py-2 rounded-full font-bold shadow-sm">iniLogobanh</span>
      </header>

      {/* Card Utama */}
      <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl flex overflow-hidden min-h-[500px]">
        {/* Sisi Kiri: Form */}
        <div className="flex-1 p-16 flex flex-col justify-center items-center">
          <h1 className="text-3xl font-semibold mb-10">Welcome back</h1>

          <form onSubmit={onSubmitHandler} className="w-full max-w-sm flex flex-col gap-4">
            <div className="relative">
              <FiUser className="absolute left-4 top-4 text-gray-400" />
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={onChangeEmail}
                required
                className="w-full border p-3 pl-12 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-4 text-gray-400" />
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={onChangePassword}
                required
                className="w-full border p-3 pl-12 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
            {errorMsg && (
              <div lassName="bg-red-100 text-red-600 text-sm text-center p-3 rounded-xl font-semibold">{errorMsg}</div>
            )}
            <button
              type="submit"
              className="bg-[#7B85CE] text-white py-3 rounded-xl font-bold mt-4 hover:bg-indigo-600 transition shadow-lg"
            >
              LOGIN
            </button>
          </form>

          <p className="mt-6 text-gray-500 text-sm">
            Don't have account?
            <Link to="/register" className="text-blue-500 cursor-pointer hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Sisi Kanan: Ilustrasi */}
        <div className="flex-1 hidden md:flex items-center justify-center p-10">
          <img src={Illustration} alt="Illustration" className="max-w-full" />
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
