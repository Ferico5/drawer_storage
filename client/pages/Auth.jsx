import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await login(email, password);

        if (response.status === 200 && response.data.msg === 'Login berhasil') {
          localStorage.setItem('token', response.data.token);
          navigate('/dashboard');
        } else if (response.status === 400 && response.data?.msg === 'Email atau password salah!') {
          setMessage('Gagal masuk! Harap periksa kembali email dan password Anda');
        }
      } else {
        if (password !== confirmPassword) {
          setMessage('Harap konfirmasi password anda dengan benar');
          return;
        }

        const response = await axios.post('http://localhost:8000/users', {
          nama: name,
          nomor_telepon: mobileNumber,
          email,
          password,
        });

        if (response.status === 201 && response.data.msg === 'User berhasil dibuat!') {
          setIsLogin(true);
          setName('');
          setMobileNumber('');
          setEmail('');
          setPassword('');
          setMessage('');
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.data.msg === 'Email atau password salah!') {
          setMessage('Gagal masuk! Harap periksa kembali email dan password Anda');
        } else if (error.response.data.msg === 'Email sudah dipakai, coba pakai email lain!') {
          setMessage('Email sudah dipakai, silakan coba email lain!');
        } else if (error.response.data.msg === 'Terjadi kesalahan, mohon dicoba lagi beberapa saat kemudian!') {
          setMessage('Terjadi kesalahan! Harap coba lagi nanti');
        }
      } else {
        setMessage('Terjadi kesalahan! Harap coba lagi nanti');
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#313244] to-[#1E1E2E] w-2/3 m-auto flex flex-col justify-center text-white mt-[3em] px-5 py-3 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">{isLogin ? 'Masuk' : 'Buat Akun'}</h1>

      <form onSubmit={handleLogin}>
        {/* Full Name */}
        {!isLogin && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none"
              required
              autoComplete="off"
            />
          </div>
        )}

        {/* Mobile Number */}
        {!isLogin && (
          <div className="mb-4">
            <label htmlFor="mobile_number" className="block text-sm font-medium text-gray-300">
              Nomor Telepon
            </label>
            <input
              type="text"
              id="mobile_number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Masukkan nomor telepon Anda"
              className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none"
              required
              autoComplete="off"
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none"
            placeholder="Masukkan email Anda"
            required
            autoComplete="off"
          />
        </div>

        {/* Password & Confirm Password */}
        <div className={`mb-4 ${isLogin ? '' : 'grid grid-cols-2 gap-4'}`}>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none"
              placeholder="Masukkan password Anda"
              required
              autoComplete="off"
            />
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="confirm_password" className="text-sm font-medium text-gray-300">
                Konfirmasi Password
              </label>
              <input
                type="password"
                id="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 mt-1 rounded-lg bg-[#313244] text-white border border-gray-600 focus:border-[#8BE9FD] focus:outline-none"
                placeholder="Konfirmasi password Anda"
                required
                autoComplete="off"
              />
            </div>
          )}
        </div>

        {/* Message */}
        {message && <p className="text-sm text-red-400 font-semibold mb-2">{message}</p>}

        {/* Button */}
        <button className="w-full bg-[#4c59ae] mt-2 font-semibold py-2 px-4 text-white rounded-lg hover:bg-[#5a639c] transition">{isLogin ? 'Masuk' : 'Registrasi'}</button>
        <p className="mt-4 text-center text-sm text-gray-400">
          {isLogin ? "Tidak punya akun?" : 'Sudah punya akun?'}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
              setName('');
              setMobileNumber('');
              setEmail('');
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-[#8BE9FD] cursor-pointer ml-2 hover:underline"
          >
            {isLogin ? 'Registrasi' : 'Masuk'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Auth;
