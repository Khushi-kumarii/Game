import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleLogin = async () => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, { username, password });
    localStorage.setItem('token', res.data.token);
    navigate('/game');
  } catch (err) {
    alert(err.response?.data?.error || "Login failed");
  }
};

return (
  <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">

    <div className="w-full max-w-sm p-8 rounded-2xl backdrop-blur-xl 
      bg-white/10 shadow-[0_0_25px_rgba(255,255,255,0.15)] border border-white/20">

      <h2 className="text-3xl font-extrabold text-center mb-6 
        bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text drop-shadow-lg">
        Welcome Back 👋
      </h2>

      {/* Username input */}
      <input 
        placeholder="Username"
        onChange={(e)=>setUsername(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded-md bg-white/15 border border-white/30
        focus:border-blue-400 focus:ring-2 focus:ring-blue-400 text-white outline-none
        placeholder-gray-300 transition-all duration-300"
      />

      {/* Password input */}
      <input 
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
        className="w-full mb-5 px-4 py-2 rounded-md bg-white/15 border border-white/30
        focus:border-pink-400 focus:ring-2 focus:ring-pink-400 text-white outline-none
        placeholder-gray-300 transition-all duration-300"
      />

      <button 
        onClick={handleLogin}
        className="w-full py-2 font-semibold rounded-lg 
        bg-gradient-to-r from-blue-500 to-purple-600 
        hover:scale-105 active:scale-95 transition-all duration-300
        shadow-[0_0_18px_rgba(0,200,255,0.4)] text-white text-lg">
        Login
      </button>

      <p className="text-center text-gray-300 mt-4 text-sm">
        Don't have an account?
        <span 
          onClick={()=>navigate('/register')}
          className="ml-1 text-cyan-300 font-semibold cursor-pointer hover:underline hover:text-cyan-400">
          Create one
        </span>
      </p>

    </div>
  </div>
);

}
