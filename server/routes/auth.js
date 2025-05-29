const express = require('express');
const router = express.Router();
const {signup, login, verifyEmail, logout} = require('../controllers/authController');
const authenticateUser = require('../middleware/authMiddleware');

router.get('/current-user', authenticateUser, (req, res) => {
  res.json({ user: req.user });
});

router.post('/logout', logout);
router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email", verifyEmail);

module.exports = router;