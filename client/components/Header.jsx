import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="w-full bg-[#1E1E2E] text-white p-5 text-lg flex justify-between">
      {/* nama usaha */}
      <div>Laci Penyimpanan</div>
      {/* navbar */}
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
    </div>
  );
};

export default Header;
