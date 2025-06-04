const express = require('express');
const router = express.Router();
const {addToCart, myCart, deleteCart, increaseCart, decreaseCart} = require('../controllers/cartController')

router.post('/addItemToCart', addToCart);
router.get('/myCart/:user_id', myCart);
router.delete('/deleteCart/:id', deleteCart);
router.patch('/increase/:id', increaseCart)
router.patch('/decrease/:id', decreaseCart)

module.exports = router;