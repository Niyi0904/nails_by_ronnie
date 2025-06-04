const express = require('express');
const router = express.Router();
const {addToCart, myCart} = require('../controllers/cartController')

router.post('/addItemToCart', addToCart);
router.get('/myCart/:user_id', myCart)

module.exports = router;