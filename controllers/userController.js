const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');


const registerUser = asyncHandler(async (req, res) => {
  const { uid, username, email, password } = req.body;

  if (!uid || !username || !email || !password) {
    res.status(400);
    throw new Error('All register fields are mandatory');
  }
  const userExists = await User.findOne({ uid });
  if (userExists) {
    res.status(400);
    throw new Error('User Exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({ ...req.body, password: hashedPassword });
  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateJWTtoken(user._id)
    })
  } else {
    res.status(400);
    throw new Error('Register: Invalid user data')
  }
  res.json({ message: 'Register User successful' });
})

const loginUser = asyncHandler(async (req, res) => {
  const { uid, email, password } = req.body;
  const user = await User.findOne({ uid });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateJWTtoken(user._id)
    })
  } else {
    res.status(400);
    throw new Error('Invalid data');
  }
})

const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id, uid, username, email } = req.user;
  res.status(200).json({ id: _id, uid, username, email })
})


const generateJWTtoken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5d' });


module.exports = { registerUser, loginUser, getCurrentUser };
