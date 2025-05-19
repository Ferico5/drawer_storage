/* eslint-disable react/prop-types */
const Drawer = ({ kode_laci, nama_barang }) => {
  return (
    <div className="w-[13em] h-[13em] bg-amber-800 p-2 flex flex-col items-center justify-between">
      <h1 className="text-white text-sm font-semibold">{kode_laci}</h1>

      <div className="w-[10em] h-[8em] bg-white flex items-center justify-center">
        <span className={`text-sm ${nama_barang === 'Kosong' ? 'bg-red-500 text-white font-bold p-3' : 'text-black'}`}>
          {nama_barang}
        </span>
      </div>

      <div className="w-[6em] h-[0.8em] bg-gray-700 rounded-full mt-1"></div>
    </div>
  );
};

export default Drawer;
