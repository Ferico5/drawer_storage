import { useState, useEffect } from 'react';
import Drawer from '../components/Drawer';

// Fungsi bantu buat filter dan sorting laci per rak
const groupDrawersByRack = (drawers) => {
  const racks = {};

  drawers.forEach(({ nomor_laci, nama_barang }) => {
    const [rack, number] = nomor_laci.split('-'); // ["A5", "22"]

    if (!racks[rack]) racks[rack] = [];

    racks[rack].push({ nomor_laci, nama_barang, number: parseInt(number, 10) });
  });

  // Sort tiap rak dari nomor 22 ke 1 (desc)
  Object.keys(racks).forEach((rack) => {
    racks[rack].sort((a, b) => b.number - a.number);
  });

  return racks;
};

const Dashboard = () => {
  const [drawers, setDrawers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayedRacks, setDisplayedRacks] = useState([]);

  const letters = 'ABCDEFGHIJKLM';

  // Urutan rak A5..A1, B5..B1, dll.
  const rackOrder = [];
  letters.split('').forEach((letter) => {
    for (let i = 5; i >= 1; i--) {
      rackOrder.push(letter + i);
    }
  });

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch semua data atau hasil pencarian
  const fetchItems = async (query = '') => {
    setLoading(true);
    try {
      const url = query
        ? `http://localhost:8000/search-item?q=${encodeURIComponent(query)}`
        : 'http://localhost:8000/get-item';

      const res = await fetch(url);
      const data = await res.json();

      if (query) {
        const searchMap = {};
        data.forEach(({ nomor_laci, nama_barang }) => {
          searchMap[nomor_laci] = nama_barang;
        });

        const fullList = [];

        rackOrder.forEach((rack) => {
          for (let num = 22; num >= 1; num--) {
            const kode = `${rack}-${num}`;
            if (searchMap[kode]) {
              fullList.push({
                nomor_laci: kode,
                nama_barang: searchMap[kode],
              });
            }
          }
        });

        setDrawers(fullList);

        const racksWithData = [...new Set(fullList.map(item => item.nomor_laci.split('-')[0]))];
        setDisplayedRacks(racksWithData);
      } else {
        setDrawers(data);
        setDisplayedRacks(rackOrder);
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat fetch data:', error);
      setDrawers([]);
      setDisplayedRacks([]);
    }
    setLoading(false);
  };

  const racks = groupDrawersByRack(drawers);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);

    if (val.length === 0) {
      fetchItems();
    } else if (val.length >= 2) {
      fetchItems(val);
    }
  };

  return (
    <div>
      {/* Kolom Pencarian */}
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Cari barang:
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Ketik nama barang minimal 2 huruf..."
          className="w-full max-w-md p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {loading && <p className="text-sm text-gray-500 mb-4">Memuat data...</p>}

      {/* Table */}
      <div className="flex flex-col gap-4 p-4">
        {displayedRacks.length === 0 && !loading && (
          <p className="text-center text-gray-500 italic">Tidak ada data untuk ditampilkan.</p>
        )}

        {displayedRacks.map((rack) => (
          <div key={rack} className="flex overflow-x-auto gap-2">
            {racks[rack]?.length > 0 ? (
              racks[rack].map(({ nomor_laci, nama_barang }) => (
                <Drawer
                  key={nomor_laci}
                  kode_laci={nomor_laci}
                  nama_barang={nama_barang || 'Kosong'}
                  isEmpty={!nama_barang}
                />
              ))
            ) : (
              <p className="text-gray-500 italic">Rak kosong</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
