import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock } from 'react-icons/fi';
import Illustration from '../assets/pilihan.jpeg';

export default function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Data Login:", data);
    alert("Berhasil Login! (Simulasi)");
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#7A93AA] flex flex-col items-center p-8">
        {/* Logo */}
        <div className="w-full max-w-5xl mb-8">
            <span className="bg-white px-6 py-2 rounded-full font-bold shadow-sm">apanihcik</span>
        </div>

        {/* Card Utama */}
        <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl flex overflow-hidden min-h-[500px]">
            {/* Sisi Kiri: Form */}
            <div className="flex-1 p-16 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-semibold mb-10">Welcome back</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm flex flex-col gap-4">
                <div className="relative">
                <FiUser className="absolute left-4 top-4 text-gray-400" />
                <input 
                    {...register("email", { required: "Email wajib diisi" })}
                    type="email" placeholder="Email"
                    className="w-full border p-3 pl-12 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div className="relative">
                <FiLock className="absolute left-4 top-4 text-gray-400" />
                <input 
                    {...register("password", { required: "Password wajib diisi", minLength: { value: 6, message: "Minimal 6 karakter" } })}
                    type="password" placeholder="Password"
                    className="w-full border p-3 pl-12 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <button className="bg-[#7B85CE] text-white py-3 rounded-xl font-bold mt-4 hover:bg-indigo-600 transition shadow-lg">
                LOGIN
                </button>
            </form>

            <p className="mt-6 text-gray-500 text-sm">
                Don't have account? <span className="text-blue-500 cursor-pointer hover:underline">Register</span>
            </p>
            </div>

            {/* Sisi Kanan: Ilustrasi */}
            <div className="flex-1 hidden md:flex items-center justify-center p-10">
                <img src={Illustration} alt="Illustration" className="max-w-full" />
            </div>
        </div>
    </div>
  );
}