import { useState, useEffect } from 'react';
import axios from 'axios';
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
      const url = query ? `http://localhost:8000/search-item?q=${encodeURIComponent(query)}` : 'http://localhost:8000/get-item';

      const res = await axios.get(url);
      const data = res.data;

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

        const racksWithData = [...new Set(fullList.map((item) => item.nomor_laci.split('-')[0]))];
        setDisplayedRacks(racksWithData);
      } else {
        setDrawers(data);
        setDisplayedRacks(rackOrder);
      }
    } catch (error) {
      console.error('Terjadi kesalahan saat mengambil data:', error);
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
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Kolom Pencarian */}
      <div className="mt-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-4">
        <label htmlFor="search" className="block font-medium text-gray-700 text-base sm:text-lg">
          Cari barang:
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Ketik nama barang minimal 2 huruf..."
          className="w-full sm:w-96 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {loading && <p className="text-sm text-gray-500 mb-4 text-center">Memuat data...</p>}

      {/* Table */}
      <div className="flex flex-col gap-6">
        {displayedRacks.length === 0 && !loading && <p className="text-center text-gray-500 italic">Tidak ada data untuk ditampilkan.</p>}

        {displayedRacks.map((rack) => (
          <div key={rack} className="flex overflow-x-auto gap-2 p-2 sm:p-3 border-b border-gray-200">
            {racks[rack]?.length > 0 ? (
              racks[rack].map(({ nomor_laci, nama_barang }) => <Drawer key={nomor_laci} kode_laci={nomor_laci} nama_barang={nama_barang || 'Kosong'} isEmpty={!nama_barang} />)
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
