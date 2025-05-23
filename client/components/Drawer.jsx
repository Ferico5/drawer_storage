/* eslint-disable react/prop-types */
import { useState } from 'react';

const Drawer = ({ kode_laci, nama_barang }) => {
  const [showModal, setShowModal] = useState(false);
  const [newItemName, setNewItemName] = useState(nama_barang === 'Kosong' ? '' : nama_barang);

  // Fungsi untuk insert item baru
  const handleAdd = async () => {
    try {
      const res = await fetch(`http://localhost:8000/insert-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomor_laci: kode_laci, nama_barang: newItemName }),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Barang berhasil ditambahkan!');
        setShowModal(false);
        window.location.reload();
      } else {
        alert(result.msg || 'Gagal menambahkan barang.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menambahkan barang.');
    }
  };

  // Fungsi untuk update item yang sudah ada
  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:8000/update-item/${kode_laci}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_barang: newItemName }),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Barang berhasil diubah!');
        setShowModal(false);
        window.location.reload();
      } else {
        alert(result.msg || 'Gagal mengupdate barang.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat update.');
    }
  };

  // Fungsi yang dipanggil tombol Simpan di modal, pilih insert atau update berdasarkan kondisi
  const handleSave = () => {
    if (nama_barang === null || nama_barang === 'Kosong') {
      if (!newItemName.trim()) {
        alert('Nama barang tidak boleh kosong saat menambahkan.');
        return;
      }
      handleAdd();
    } else {
      if (!newItemName.trim()) {
        alert('Nama barang tidak boleh kosong saat mengubah.');
        return;
      }
      handleUpdate();
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Apakah kamu yakin ingin menghapus barang dari laci ${kode_laci}?`);

    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8000/update-item/${kode_laci}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama_barang: null }),
      });

      const result = await res.json();
      if (res.ok) {
        window.location.reload();
      } else {
        alert(result.msg || 'Gagal menghapus barang.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghapus.');
    }
  };

  return (
    <div className="w-[13em] h-[13em] bg-amber-800 p-2 flex flex-col items-center justify-between">
      <h1 className="text-white text-sm font-semibold">{kode_laci}</h1>

      <div className="w-[10em] h-[8em] bg-white flex items-center justify-center">
        <span className={`text-sm ${nama_barang === 'Kosong' ? 'bg-red-500 text-white font-bold p-3' : 'text-black text-xl'}`}>{nama_barang}</span>
      </div>

      {/* button */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setShowModal(true)}
          className={`text-xs text-white px-2 py-1 rounded hover:brightness-90 ${nama_barang === null || nama_barang === 'Kosong' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {nama_barang === null || nama_barang === 'Kosong' ? '➕ Tambah' : '✏️ Ubah'}
        </button>
        <button onClick={handleDelete} className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
          🗑️ Hapus
        </button>
      </div>

      {/* Modal Update / Tambah */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-[300px]">
            <h2 className="text-lg font-semibold mb-4">{nama_barang === null || nama_barang === 'Kosong' ? 'Tambah Nama Barang' : 'Update Nama Barang'}</h2>
            <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="w-full p-2 border rounded mb-4" placeholder="Masukkan nama barang" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1 bg-gray-300 rounded">
                Batal
              </button>
              <button onClick={handleSave} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drawer;
