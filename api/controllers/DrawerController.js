const DrawerModel = require('../models/DrawerModel.js');
const drawerList = require('../helpers/DrawerList.js');

const insertItem = async (req, res) => {
  try {
    const { nomor_laci, nama_barang } = req.body;

    if (!drawerList.includes(nomor_laci)) {
      return res.status(400).json({ msg: 'Nomor laci tidak valid!' });
    }

    const existing = await DrawerModel.findOne({ nomor_laci });

    if (existing && existing.nama_barang && existing.nama_barang !== 'Kosong') {
      return res.status(400).json({ msg: 'Nomor laci ini sudah terisi!' });
    }

    if (!existing) {
      const newItem = new DrawerModel({ nomor_laci, nama_barang });
      await newItem.save();
    } else {
      existing.nama_barang = nama_barang;
      await existing.save();
    }

    res.status(200).json({ msg: 'Barang berhasil dimasukkan!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Terjadi kesalahan, mohon dicoba lagi beberapa saat kemudian!' });
  }
};

const getItem = async (req, res) => {
  try {
    const items = await DrawerModel.find();
    const itemMap = {};
    items.forEach((item) => {
      itemMap[item.nomor_laci] = item.nama_barang;
    });

    const fullList = drawerList.map((laci) => ({
      nomor_laci: laci,
      nama_barang: itemMap[laci] || null,
    }));

    return res.status(200).json(fullList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const searchItem = async (req, res) => {
  const keyword = req.query.q;

  try {
    const results = await DrawerModel.find({
      nama_barang: { $regex: keyword, $options: 'i' },
    });

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

const updateItem = async (req, res) => {
  try {
    const { nama_barang } = req.body;
    const { id } = req.params;

    const updateItem = await DrawerModel.findOneAndUpdate({ nomor_laci: id }, { nama_barang: nama_barang ?? 'Kosong' }, { new: true });

    if (!updateItem) {
      return res.status(404).json({ msg: 'Laci tidak ditemukan' });
    }

    res.status(200).json({ msg: 'Item berhasil diubah!', item: updateItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { insertItem, getItem, searchItem, updateItem };
