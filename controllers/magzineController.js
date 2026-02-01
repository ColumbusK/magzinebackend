const asyncHandler = require("express-async-handler");
const Magzine = require("../models/magzineModel");
const User = require("../models/userModel");

const getMagzines = asyncHandler(async (req, res) => {
  console.log("route: /api/magzines");
  // const magzines = await Magzine.find({ user: req.user.id })
  // console.log(req.user.id);
  const magzines = await Magzine.find({ type: "TE" }).sort({ datetime: -1 });
  res.status(200).json(magzines);
});

//
const getMagzine = asyncHandler(async (req, res) => {
  console.log("route: /api/magzines/:id");
  const id = req.params.id;
  console.log("id", id);
  const magzines = await Magzine.find({ _id: id });
  res.status(200).json(magzines);
});

const addMagzine = asyncHandler(async (req, res) => {
  let data = req.body;
  // post 数据验证
  if (!data.coverUrl) {
    res.status(400);
    throw new Error("Please contain magzine cover image!");
  }
  // 打印请求body中的数据
  data = { ...data, user: req.user.id };
  console.log("body", data);

  const magzine = await Magzine.create(data);
  res.status(200).json(magzine);
});

const updateMagzine = asyncHandler(async (req, res) => {
  const magzine = await Magzine.findOne({ title: req.params.title });
  if (!magzine) {
    res.status(400);
    throw new Error("Magzine not found");
  }
  const updatedMagzine = await Magzine.findOneAndUpdate(
    { title: req.params.title },
    req.body,
    { new: true },
  );
  res.status(200).json(updatedMagzine);
});

const deleteMagzine = asyncHandler(async (req, res) => {
  const magzine = await Magzine.findOne({ title: req.params.title });

  if (!magzine) {
    res.status(400);
    throw new Error("Magzine not found");
  }

  const deleted = await Magzine.findOneAndDelete({ title: req.params.title });
  res.status(200).json(deleted);
});

const downloadMagzine = asyncHandler(async (req, res) => {});

// 新增上传接口逻辑
const uploadMagzine = asyncHandler(async (req, res) => {
  const { title, type, tags } = req.body;

  // 1. 验证文件
  if (!req.file) {
    res.status(400);
    throw new Error("没有检测到上传的文件");
  }

  // 2. 构建 URL
  // 注意：生产环境建议将 host 存储在 config 或环境变量中
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const panUrl = `${baseUrl}/magazines/${req.file.filename}`;

  // 暂时给一个默认封面，或者根据 type 匹配默认图
  const coverUrl = `${baseUrl}/magazines/default-cover.jpg`;

  // 3. 写入数据库
  const newMagzine = await Magzine.create({
    title,
    type: type || "TE",
    tags: tags || "",
    panUrl,
    coverUrl,
    user: req.user._id,
    datetime: new Date(), // 或者使用 moment().format()
  });

  if (newMagzine) {
    res.status(201).json({
      success: true,
      data: newMagzine,
      message: "杂志上传并记录成功",
    });
  } else {
    res.status(400);
    throw new Error("数据库保存失败");
  }
});

// @desc    执行下载扣费逻辑
// @route   POST /api/magazines/charge/:id
// @access  Private
const chargeForDownload = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const magzine = await Magzine.findById(id);
  if (!magzine) {
    res.status(404);
    throw new Error("找不到该杂志");
  }
  console.log("magzine.pointsRequired:", magzine.pointsRequired);
  // 【核心修复】：强制确保 pointsRequired 是数字，如果不存在则默认为 0
  const cost = Number(magzine.pointsRequired);

  if (isNaN(cost)) {
    console.error(
      `杂志ID ${id} 的 pointsRequired 值为非法:`,
      magzine.pointsRequired,
    );
    res.status(500);
    throw new Error("服务器配置错误：该杂志未设置有效下载点数");
  }

  console.log(`用户ID: ${req.user._id}, 扣费金额: ${cost}`);

  // 使用原子操作进行扣费
  const updatedUser = await User.findOneAndUpdate(
    {
      _id: req.user._id,
      balance: { $gte: cost },
    },
    { $inc: { balance: -cost } },
    { new: true, runValidators: true },
  );

  if (!updatedUser) {
    const user = await User.findById(req.user._id);
    res.status(403);
    throw new Error(
      `点数不足。需要 ${cost} 点，当前余额 ${user?.balance || 0} 点`,
    );
  }

  res.status(200).json({
    success: true,
    currentBalance: updatedUser.balance,
    downloadUrl: magzine.panUrl,
  });
});

module.exports = {
  getMagzines,
  addMagzine,
  updateMagzine,
  deleteMagzine,
  getMagzine,
  downloadMagzine,
  uploadMagzine,
  chargeForDownload,
};
