const express = require('express');
const router = express.Router();

const { getMagzines, addMagzine, updateMagzine, deleteMagzine } = require('../controllers/magzineController');

router.get('/', getMagzines);
router.post('/', addMagzine);
router.put('/:title', updateMagzine);
router.delete('/:title', deleteMagzine);


module.exports = router;
