const express = require('express');
const router = express.Router();
const {addToCart, myCart, deleteCart} = require('../controllers/cartController')

router.post('/addItemToCart', addToCart);
router.get('/myCart/:user_id', myCart);
router.delete('/deleteCart/:id', deleteCart);

module.exports = router;