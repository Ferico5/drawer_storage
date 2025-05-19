const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  nomor_telepon: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
