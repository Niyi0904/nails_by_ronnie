const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User, CartItem } = require('../models');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


const signup = async (req, res) => {
  const { full_name, email, password, phone_number, address } = req.body;

  // Basic validation
  if (!full_name || !email || !password, !phone_number || !address ) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email, phone_number } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    const verification_token = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = await User.create({
      full_name,
      email,
      password_hash,
      phone_number,
      address,
      verification_token,
      shipping_address: 'no jfddcsdjx'
    });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'owoyeminiyi2@gmail.com',
        pass: 'aogv orqv gmkd hujf' // not your Gmail password
      }
    });
    
    const mailOptions = {
      from: 'noreply@nailsbyronnie.com',
      to: email,
      subject: 'Verify Your Email',
      html: `
        <h3>Email Verification</h3>
        <p>Click the link below to verify your email:</p>
        <a href="https://nails-by-ronnie.vercel.app/verify-email?token=${verification_token}">Verify Email</a>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.Userid,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        shipping_address: user.shipping_address,
        address: user.address,
        picture: user.picture
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const user = await User.findOne({
       attributes: { exclude: ['verification_token', 'updatedAt'] },
       where: { email },
       include: [{
        model: CartItem,
        as: 'cart_items'
      }]
      });

    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordMatched) {
      return res.status(404).json({ message: 'Invalid email or password' });
    }

    const tokenData = {
      full_name: user.full_name,
      email: user.email,
      id: "user.userid",
      phone_number: user.phone_number,
      address: user.address,
      picture: user.picture,
      role: user.role,
    }

    console.log('TOKENDATA:', tokenData);
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1m' });
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(201).json({
      message: 'Login Successful', user});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};



const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).json({ error: "Token is required" });

  const user = await User.findOne({ where: { verification_token: token } });

  if (!user) return res.status(400).json({ error: "Invalid token" });

  user.email_verified = true;
  user.verification_token = null;
  await user.save();

  res.status(200).json({ message: "Email verified successfully" });
};


module.exports = { signup, login, verifyEmail, logout };
