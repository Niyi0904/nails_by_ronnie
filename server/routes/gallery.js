const express = require('express');
const router = express.Router();
const {addNewGallery} = require('../controllers/galleryContoller');

router.post('/addNewGallery', addNewGallery);

module.exports= router;