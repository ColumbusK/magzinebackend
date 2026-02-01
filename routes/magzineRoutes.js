const express = require("express");
const router = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const {
  getMagzines,
  getMagzine,
  addMagzine,
  uploadMagzine, // 新增接口
  updateMagzine,
  deleteMagzine,
  downloadMagzine,
  chargeForDownload,
} = require("../controllers/magzineController");
const { protect } = require("../middlewares/authmiddleware");

// 1. 配置 Multer (如果还没配置)
// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/magazines/";
    // 自动创建目录（如果不存在）
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // 1. 生成随机 Hash 或基于时间戳的 Hash (因为此时还未完全读取文件流，无法做内容摘要)
    // 如果要根据“文件内容”生成摘要，通常在文件存入后再重命名。
    // 这里先使用 随机哈希 + 原始后缀，解决非法文件名问题
    const customHash = crypto.randomBytes(16).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${customHash}${ext}`);
  },
});
const upload = multer({ storage });

router.get("/", getMagzines);
router.get("/:id", getMagzine);

router.post("/", protect, addMagzine);
// 新增接口：专门用于前端 UploadPage 的 PDF 上传
router.post("/upload", protect, upload.single("file"), uploadMagzine);

router.put("/:title", updateMagzine);
router.delete("/:title", deleteMagzine);

router.get("/download/:id", downloadMagzine);

router.post("/charge/:id", protect, chargeForDownload);

module.exports = router;
