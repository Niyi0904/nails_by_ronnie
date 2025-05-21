const { User } = require('../models');

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
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
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
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
}

module.exports = { getUserById, getAllUsers };
