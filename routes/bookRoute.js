const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middlewares/authmiddleware');
const { getAllBooks, creatBook, searchBooks } = require('../controllers/bookController');

// upload file path
const FILE_PATH = 'public/uploads';

// configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, FILE_PATH);
  },
  filename: function (req, file, cb) {
    // 使用原始文件名作为上传文件的名称
    cb(null, file.originalname);
  }
});


// configure multer
const upload = multer({ storage: storage });


router.get('/', getAllBooks);
router.post('/', protect, creatBook);
router.get('/search', searchBooks);

router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    const avatar = req.file;

    // make sure file is available
    if (!avatar) {
      res.status(400).send({
        status: false,
        data: 'No file is selected.'
      });
    } else {
      // send response
      res.send({
        status: true,
        message: 'File is uploaded.',
        data: {
          name: avatar.originalname,
          mimetype: avatar.mimetype,
          size: avatar.size
        }
      });
    }

  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
