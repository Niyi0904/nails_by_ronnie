// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

function authenticateUser(req, res, next) {
  console.log('reached');
  console.log('cookies', req.cookies);
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', user); // << should include `id`
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authenticateUser;
