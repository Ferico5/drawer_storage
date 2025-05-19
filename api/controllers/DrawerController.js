const DrawerModel = require('../models/DrawerModel.js');

const insertItem = async (req, res) => {
  try {
    const { nomor_laci, nama_barang } = req.body;

    const newItem = new DrawerModel({ nomor_laci, nama_barang });
    await newItem.save();

    res.status(200).json({ msg: 'Barang berhasil dimasukkan!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Terjadi kesalahan, mohon dicoba lagi beberapa saat kemudian!' });
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

module.exports = { insertItem, searchItem };
