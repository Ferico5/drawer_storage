const mongoose = require('mongoose');
const drawerSchema = new mongoose.Schema({
  nomor_laci: {
    type: String,
    required: true,
    unique: true,
  },
  nama_barang: {
    type: String,
  },
});

module.exports = mongoose.model('Drawer', drawerSchema);
