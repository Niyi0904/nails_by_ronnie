// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateUser(req, res, next) {
  console.log('reached');
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authenticateUser;
