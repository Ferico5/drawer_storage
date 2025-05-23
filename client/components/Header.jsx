import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const Header = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#1E1E2E] text-white p-3 md:p-5 text-sm md:text-lg flex justify-between items-center flex-wrap">
      {/* Nama usaha - disembunyikan di layar kecil */}
      <div className="hidden sm:block text-xs md:text-lg">Laci Penyimpanan</div>

      {/* Navbar */}
      {token && (
        <nav>
          <ul className="flex gap-4 md:gap-10 text-xs md:text-base">
            <li>
              <Link to="/dashboard" className="hover:text-gray-400">
                Tabel Laci
              </Link>
            </li>
            <li>
              <Link to="/insert-item" className="hover:text-gray-400">
                Tambahkan Barang
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {/* User Section */}
      <div className="flex items-center gap-2 md:gap-4 text-xs md:text-base">
        {token && user && <p className="font-medium truncate max-w-[100px] md:max-w-none">{user?.nama}</p>}
        {token && user && (
          <button
            onClick={() => logout(navigate)}
            className="bg-red-500 px-2 py-1 md:px-3 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
