const express = require('express');
const router = express.Router();
const { getTasks, creatTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middlewares/authmiddleware');


router.get('/', protect, getTasks);
router.post('/', protect, creatTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);


module.exports = router;
