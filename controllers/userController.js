const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All register fields are mandatory");
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res.status(400);
    throw new Error("此邮箱已注册");
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
  const user = await User.create({
    ...req.body,
    password: hashedPassword,
    bid,
  });
  console.log("create user", user);
  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateJWTtoken(user._id),
      bid: user.bid,
    });
  } else {
    res.status(400);
    throw new Error("Register: Invalid user data");
  }
});

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
      bid: user.bid,
    });
  } else {
    res.status(400);
    throw new Error("登录失败，请检查信息");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id, username, email, bid } = req.user;
  res.status(200).json({ id: _id, username, email, bid });
});

// @desc    仅允许特定管理员根据邮箱充值
// @route   POST /api/users/recharge
// @access  Private
const userRecharge = asyncHandler(async (req, res) => {
  const { email, amount } = req.body;

  // --- 1. 权限校验：硬编码指定管理员 ID ---
  const ADMIN_ID = "65b8993ad39ac4cc0ffc1e14";

  // 注意：req.user._id 可能是 ObjectId 类型，需要转字符串比较
  if (req.user._id.toString() !== ADMIN_ID) {
    res.status(403);
    throw new Error("无权进行此操作：您不是指定的超级管理员");
  }

  // --- 2. 参数校验 ---
  if (!email || amount === undefined) {
    res.status(400);
    throw new Error("请提供用户邮箱和充值金额");
  }

  const rechargeAmount = Number(amount);
  if (isNaN(rechargeAmount) || rechargeAmount <= 0) {
    res.status(400);
    throw new Error("充值金额必须是大于 0 的数字");
  }

  // --- 3. 执行充值 (原子更新) ---
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { $inc: { balance: rechargeAmount } },
    { new: true },
  );

  if (!user) {
    res.status(404);
    throw new Error("充值失败：未找到该邮箱对应的用户");
  }

  res.status(200).json({
    success: true,
    message: `管理员操作成功`,
    data: {
      targetUser: user.email,
      recharged: rechargeAmount,
      currentBalance: user.balance,
    },
  });
});

const generateJWTtoken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "5d" });

module.exports = { registerUser, loginUser, getCurrentUser, userRecharge };
