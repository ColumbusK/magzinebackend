const express = require('express');
const router = express.Router();

const { getMagzines, addMagzine, updateMagzine, deleteMagzine } = require('../controllers/magzineController');
const { protect } = require('../middlewares/authmiddleware');


router.get('/', protect, getMagzines);
router.post('/', protect, addMagzine);
router.put('/:title', updateMagzine);
router.delete('/:title', deleteMagzine);


module.exports = router;
