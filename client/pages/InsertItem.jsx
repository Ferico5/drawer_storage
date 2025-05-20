import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InsertItem = () => {
  const [drawerNumber, setDrawerNumber] = useState('');
  const [itemName, setItemName] = useState('');
  const [drawerList, setDrawerList] = useState([]);
  const [filteredDrawer, setFilteredDrawer] = useState([]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [invalidDrawer, setInvalidDrawer] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrawerList();
  }, []);

  const fetchDrawerList = async () => {
    try {
      const res = await fetch('http://localhost:8000/get-item');
      const data = await res.json();
      setDrawerList(data);
      setFilteredDrawer(data);
    } catch (err) {
      console.error('Gagal mengambil data laci:', err);
    }
  };

  const handleDrawerInput = (value) => {
    setDrawerNumber(value);

    if (value === '') {
      setFilteredDrawer([]);
      setShowDropdown(false);
      setInvalidDrawer(false);
      setErrorMsg('');
      return;
    }

    const lowerVal = value.toLowerCase();

    // Semua item yang start dengan input dan masih kosong
    const filtered = drawerList.filter((item) => item.nama_barang === null && item.nomor_laci.toLowerCase().startsWith(lowerVal));

    // Cek apakah input persis match ke laci yang sudah terisi
    const isExistButUsed = drawerList.find((item) => item.nomor_laci.toLowerCase() === lowerVal && item.nama_barang !== null);

    // Cek apakah input persis match ke laci kosong
    const isExistAndEmpty = drawerList.find((item) => item.nomor_laci.toLowerCase() === lowerVal && item.nama_barang === null);

    if (isExistAndEmpty || filtered.length > 0) {
      setInvalidDrawer(false);
      setErrorMsg('');
    } else if (isExistButUsed) {
      setInvalidDrawer(true);
      setErrorMsg('Nomor laci ini sudah diisi barang lain.');
    } else {
      setInvalidDrawer(true);
      setErrorMsg('Nomor laci tidak valid!');
    }

    setFilteredDrawer(filtered);
    setShowDropdown(filtered.length > 0);
  };

  const handleSelectDrawer = (laci) => {
    setDrawerNumber(laci);
    setShowDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!drawerNumber || !itemName) {
      setMessage('Nomor laci dan nama barang wajib diisi.');
      setStatus('error');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/insert-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomor_laci: drawerNumber, nama_barang: itemName }),
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage(result.msg || 'Gagal menambahkan barang.');
        setStatus('error');
      } else {
        setMessage(result.msg || 'Barang berhasil ditambahkan!');
        setStatus('success');
        setDrawerNumber('');
        setItemName('');
        fetchDrawerList();
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setMessage('Terjadi kesalahan saat koneksi ke server.');
      setStatus('error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded-lg shadow-lg bg-white relative">
      <h2 className="text-xl font-semibold mb-4">Tambah Barang ke Laci</h2>

      {message && <div className={`mb-4 p-3 rounded text-sm ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input + Dropdown autocomplete untuk nomor laci */}
        <div className="relative">
          <label htmlFor="drawerNumber" className="block text-sm font-medium text-gray-700">
            Nomor Laci
          </label>
          <input
            type="text"
            id="drawerNumber"
            value={drawerNumber}
            onChange={(e) => handleDrawerInput(e.target.value)}
            onFocus={() => drawerNumber && setShowDropdown(true)}
            className="w-full mt-1 p-2 border rounded"
            placeholder="Contoh: D2-1"
            autoComplete="off"
          />
          {invalidDrawer && <p className="text-sm text-red-500 mt-1">{errorMsg}</p>}
          {showDropdown && (
            <ul className="absolute z-10 bg-white border w-full max-h-48 overflow-y-auto shadow-md rounded mt-1">
              {filteredDrawer.map((item) => (
                <li key={item.nomor_laci} onClick={() => handleSelectDrawer(item.nomor_laci)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  {item.nomor_laci}
                </li>
              ))}
              {filteredDrawer.length === 0 && <li className="px-4 py-2 text-gray-500">Tidak ditemukan</li>}
            </ul>
          )}
        </div>

        {/* Input nama barang */}
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
            Nama Barang
          </label>
          <input type="text" id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} className="w-full mt-1 p-2 border rounded" placeholder="Contoh: Pipet steril" />
        </div>

        <button type="submit" className="w-full bg-amber-500 text-white font-semibold py-2 px-4 rounded hover:bg-amber-600">
          Tambah Barang
        </button>
      </form>
    </div>
  );
};

export default InsertItem;
