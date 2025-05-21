const express = require('express');
const router = express.Router();
const {addToCart} = require('../controllers/cartController')

router.post('/addItemToCart', addToCart);

module.exports = router;