const express = require('express');
const { insertItem, searchItem } = require('../controllers/DrawerController.js');

const router = express.Router();

// insert item
router.post('/insert-item', insertItem);
// search item
router.get('/search-item', searchItem);

module.exports = router;
