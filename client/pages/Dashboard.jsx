import { useState, useEffect } from 'react';
import Drawer from '../components/Drawer';

// Fungsi bantu buat filter dan sorting laci per rak
const groupDrawersByRack = (drawers) => {
  const racks = {};

  drawers.forEach(({ nomor_laci, nama_barang }) => {
    // contoh nomor_laci: A5-22
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

  useEffect(() => {
    fetch('http://localhost:8000/get-item')
      .then((res) => res.json())
      .then((data) => setDrawers(data))
      .catch((err) => console.error('Terjadi kesalahan: ', err));
  }, []);

  const racks = groupDrawersByRack(drawers);

  const rackOrder = [];
  const letters = 'ABCDEFGHIJKLM';
  letters.split('').forEach((letter) => {
    for (let i = 5; i >= 1; i--) {
      rackOrder.push(letter + i);
    }
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      {rackOrder.map((rack) => (
        <div key={rack} className="flex overflow-x-auto gap-2">
          {racks[rack]
            ? racks[rack].map(({ nomor_laci, nama_barang }) => (
                <Drawer
                  key={nomor_laci}
                  kode_laci={nomor_laci}
                  nama_barang={nama_barang || 'Kosong'}
                  isEmpty={!nama_barang}
                />
              ))
            : Array.from({ length: 22 }, (_, idx) => {
                const nomor = 22 - idx;
                const kode = `${rack}-${nomor}`;
                return (
                  <Drawer
                    key={kode}
                    kode_laci={kode}
                    nama_barang="Kosong"
                    isEmpty={true}
                  />
                );
              })}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
