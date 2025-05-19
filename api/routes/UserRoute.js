const express = require('express');
const { createUser, loginUser } = require('../controllers/UserController.js');

const router = express.Router();

// create user
router.post('/users', createUser);
// login user
router.post('/auth', loginUser);

module.exports = router;