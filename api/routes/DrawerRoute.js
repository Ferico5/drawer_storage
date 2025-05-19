const express = require('express');
const { insertItem, getItem, searchItem, updateItem } = require('../controllers/DrawerController.js');

const router = express.Router();

// insert item
router.post('/insert-item', insertItem);
// get item
router.get('/get-item', getItem);
// search item
router.get('/search-item', searchItem);
// update item
router.put('/update-item/:id', updateItem);

module.exports = router;
