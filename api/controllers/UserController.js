const UserModel = require('../models/UserModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

const createUser = async (req, res) => {
  try {
    const { nama, nomor_telepon, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email sudah dipakai, coba pakai email lain!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ nama, nomor_telepon, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: 'User berhasil dibuat!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Terjadi kesalahan, mohon dicoba lagi beberapa saat kemudian!' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Tidak ada user dengan email tersebut!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Email atau password salah!' });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({ msg: 'Login berhasil', token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Terjadi kesalahan, mohon dicoba lagi beberapa saat kemudian!' });
  }
};

module.exports = { createUser, loginUser };
