import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const Header = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-[#1E1E2E] text-white p-5 text-lg flex justify-between">
      {/* nama usaha */}
      <div>Laci Penyimpanan</div>
      {/* navbar */}
      {token && (
        <div>
          <nav>
            <ul className="flex gap-10">
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
        </div>
      )}

      <div className="flex items-center">
        {/* Nama User */}
        {token && user && <p className="font-medium mr-10">{user?.nama}</p>}
        {token && user && (
          <button onClick={() => logout(navigate)} className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 hover:cursor-pointer">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
