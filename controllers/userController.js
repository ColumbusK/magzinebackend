const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');


const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error('All register fields are mandatory');
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res.status(400);
    throw new Error('此邮箱已注册');
  }

  // Generate a random bid between 6 and 9 (inclusive)
  let bid;
  let bidExists = true;
  do {
    bid = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // Generates a random number between 6 and 9
    bidExists = await User.findOne({ bid });
  } while (bidExists);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("create user");
  const user = await User.create({ ...req.body, password: hashedPassword, bid });
  console.log("create user", user);
  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateJWTtoken(user._id),
      bid: user.bid
    })
  } else {
    res.status(400);
    throw new Error('Register: Invalid user data')
  }
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log("loginUser", user);
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateJWTtoken(user._id),
      bid: user.bid
    })
  } else {
    res.status(400);
    throw new Error('登录失败，请检查信息');
  }
})

const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id, username, email, bid } = req.user;
  res.status(200).json({ id: _id, username, email, bid })
})


const generateJWTtoken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5d' });


module.exports = { registerUser, loginUser, getCurrentUser };
