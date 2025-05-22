import { useNavigate } from 'react-router-dom';
import { Ghost } from 'lucide-react';

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Ghost className="w-20 h-20 text-gray-500" />
        </div>
        <h1 className="text-5xl font-bold text-gray-800">404</h1>
        <p className="mt-2 text-lg text-gray-600">Oops, halaman yang Anda cari tidak ditemukan.</p>
        <p className="mt-1 text-sm text-gray-500">Mungkin Anda salah ketik atau halaman ini sudah tidak ada lagi.</p>
        <div className="mt-6">
          <button onClick={handleBackHome} className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all duration-200 hover:cursor-pointer">
            Tabel Laci
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
