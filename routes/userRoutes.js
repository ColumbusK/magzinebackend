const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  userRecharge,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authmiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/current", protect, getCurrentUser);
// 充值
router.post("/recharge", protect, userRecharge);

module.exports = router;
