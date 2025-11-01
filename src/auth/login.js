import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('Email atau password salah!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 to-purple-500">
      <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden w-[850px] max-w-full">
        {/* Kiri */}
        <div className="w-1/2 bg-gradient-to-br from-purple-500 to-pink-400 text-white flex flex-col justify-center items-center p-10">
          <h1 className="text-4xl font-bold mb-2">KasirApp</h1>
          <p className="text-center text-lg">
            Selamat datang kembali! <br />
            Silakan login untuk melanjutkan ke dashboard.
          </p>
        </div>

        {/* Kanan */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-purple-600 mb-8">LOGIN</h2>
          <form onSubmit={handleLogin}>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-purple-600">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <div className="text-right text-sm text-purple-600 mt-2 cursor-pointer hover:underline">Lupa Password?</div>

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg mt-6 transition duration-200">
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Belum punya akun?{' '}
            <span onClick={() => navigate('/register')} className="text-purple-600 hover:underline cursor-pointer">
              Daftar di sini
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
