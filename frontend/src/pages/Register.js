import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
  try {
    await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, { username, password });
    navigate('/');
  } catch (err) {
    alert(err.response?.data?.error || "Registration failed");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">

      <div className="w-full max-w-sm p-8 rounded-2xl backdrop-blur-xl 
        bg-white/10 shadow-[0_0_25px_rgba(255,255,255,0.15)] border border-white/20">

        <h2 className="text-3xl font-extrabold text-center mb-6 
          bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text drop-shadow-lg">
          Create Account ✨
        </h2>

        {/* Username input */}
        <input 
          placeholder="Username"
          onChange={(e)=>setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-md bg-white/15 border border-white/30
          focus:border-green-400 focus:ring-2 focus:ring-green-400 text-white outline-none
          placeholder-gray-300 transition-all duration-300"
        />

        {/* Password input */}
        <input 
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full mb-5 px-4 py-2 rounded-md bg-white/15 border border-white/30
          focus:border-green-400 focus:ring-2 focus:ring-green-400 text-white outline-none
          placeholder-gray-300 transition-all duration-300"
        />

        <button 
          onClick={handleRegister}
          className="w-full py-2 font-semibold rounded-lg 
          bg-gradient-to-r from-green-500 to-emerald-600 
          hover:scale-105 active:scale-95 transition-all duration-300
          shadow-[0_0_18px_rgba(0,255,140,0.4)] text-white text-lg">
          Register
        </button>

        <p className="text-center text-gray-300 mt-4 text-sm">
          Already have an account?
          <span 
            onClick={()=>navigate('/')}
            className="ml-1 text-cyan-300 font-semibold cursor-pointer hover:underline hover:text-cyan-400">
            Login
          </span>
        </p>

      </div>
    </div>
  );
}
