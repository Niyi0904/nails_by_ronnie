const express = require('express');
const router = express.Router();
const {getUserById, getAllUsers} = require('../controllers/usersController');

router.get("/getUserById/:userId", getUserById);
router.get("/getAllUser", getAllUsers);

module.exports = router;