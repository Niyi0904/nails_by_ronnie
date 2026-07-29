const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

function authenticateUser(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Please log in to continue.' });
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    logger.error(err, req);
    return res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
}

module.exports = authenticateUser;
