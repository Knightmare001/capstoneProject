import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import { FiUser, FiLock, FiMail} from 'react-icons/fi';

function RegisterPage() {
    const [name, onChangeName] = useInput('');       
    const [email, onChangeEmail] = useInput('');
    const [password, onChangePassword] = useInput('');
    const [confirmPassword, onChangeConfirmPassword] = useInput('');

    const navigate = useNavigate();                   

    async function onSubmitHandler(event){
        event.preventDefault();

        if (password !== confirmPassword) {
            return alert("Password tidak cocok!");
        }
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
                alert("Register berhasil! Silakan login.");
                navigate('/login');
            } else {
                alert(data.message || "Register gagal.");
            }
        } catch (error) {
            console.error("Error fetching:", error);
            alert("Gagal terhubung ke server.");
        }
    }

    return (
        <main className="min-h-screen bg-[#E8EBF5] flex flex-col items-center justify-center p-8">
             <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl flex overflow-hidden min-h-[500px]">
                <div className="flex-1 p-16 flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-semibold mb-10">Register</h1>
                    <form onSubmit={onSubmitHandler} className="w-full max-w-sm flex flex-col gap-4">
                        <div className="relative">
                            <FiUser className="absolute left-4 top-4 text-gray-400" />
                            <input type="text" placeholder="Nama Lengkap" value={name} onChange={onChangeName} required 
                                className="w-full border p-3 pl-12 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                            />
                        </div>

                        <div className="relative">
                            <FiMail className="absolute left-4 top-4 text-gray-400" />
                            <input type="email" placeholder="Email" value={email} onChange={onChangeEmail} required 
                                className="w-full border p-3 pl-12 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                            />
                        </div>

                        <div className="relative">
                            <FiLock className="absolute left-4 top-4 text-gray-400" />
                            <input type="password" placeholder="Password" value={password} onChange={onChangePassword} required 
                                className="w-full border p-3 pl-12 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                            />
                        </div>

                        <div className="relative">
                            <FiLock className="absolute left-4 top-4 text-gray-400" />
                            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={onChangeConfirmPassword} required 
                                className="w-full border p-3 pl-12 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                            />
                        </div>
                    
                        <button type="submit"
                            className="bg-[#7B85CE] text-white py-3 rounded-xl font-bold mt-4 hover:bg-indigo-600 transition shadow-lg">
                            REGISTER
                        </button>
                    </form>
                    <p className="mt-6 text-gray-500 text-sm">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-blue-500 cursor-pointer hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default RegisterPage;
