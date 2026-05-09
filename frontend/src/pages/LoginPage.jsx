import { Link, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput'
import { FiUser, FiLock } from 'react-icons/fi';
import Illustration from '../assets/pilihan.jpeg';

function LoginPage() {
    //siapin state
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');
    //siapin handler(ngerubah state) ketika disubmit
    const onSubmitHandler = (event) => {
        //panggil fungsi agar page tidak kerefresh
        event.preventDefault();
        //kirim data ke api buat validasi

        //kalau aman masuk ke homepage
    }
  
    return (
        <main className="min-h-screen bg-[#7A93AA] flex flex-col items-center p-8">
            {/* Logo */}
            <header className="w-full max-w-5xl mb-8">
                <span className="bg-white px-6 py-2 rounded-full font-bold shadow-sm">apanihcik</span>
            </header>

            {/* Card Utama */}
            <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl flex overflow-hidden min-h-[500px]">
                {/* Sisi Kiri: Form */}
                <div className="flex-1 p-16 flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-semibold mb-10">Welcome back</h1>
                    
                    <form onSubmit={onSubmitHandler} className="w-full max-w-sm flex flex-col gap-4">
                        <div className="relative">
                            <FiUser className="absolute left-4 top-4 text-gray-400" />
                            <input type="email" id="email" placeholder="Email" value={email} onChange={onChangeEmail} required
                                className="w-full border p-3 pl-12 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                            />
                        </div>

                        <div className="relative">
                            <FiLock className="absolute left-4 top-4 text-gray-400" />
                            <input 
                                type="password" id="password" placeholder="Password" value={password} onChange={onChangePassword} required
                                className="w-full border p-3 pl-12 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                            />
                        </div>

                        <button type="submit" 
                            className="bg-[#7B85CE] text-white py-3 rounded-xl font-bold mt-4 hover:bg-indigo-600 transition shadow-lg">
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