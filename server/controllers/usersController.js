const { User } = require('../models');
const logger = require('../utils/logger');

const getUserById = async (req, res) => {
    const Userid = req.params.userId;
  try {
    const user = await User.findOne({
        attributes: { exclude: ['password_hash', 'verification_token'] },
       where: { Userid } 
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(201).json({
      success: true, message: 'User found', user});

  } catch (err) {
    logger.error(err, req);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
};

const getAllUsers = async (req, res) => {
    try {
    const user = await User.findAll({
        attributes: { exclude: ['password_hash', 'verification_token'] },
        });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.status(201).json({
        success: true, Users: user});

    } catch (err) {
        logger.error(err, req);
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
}

module.exports = { getUserById, getAllUsers };
