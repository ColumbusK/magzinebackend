const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel');


const getTasks = asyncHandler(async (req, res) => {
  console.log("getTasks");
  const tasks = await Task.find({ user: req.user.id });
  console.log("getTasks", tasks);
  res.status(200).json(tasks);
})


const creatTask = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error('Please enter a task');
  }
  const task = await Task.create({ text: text, user: req.user.id });
  res.status(200).json(task);
})


const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const task = await Task.findById(taskId);

  if (!task) {
    res.status(400);
    throw new Error('Task not found');
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(401);
    throw new Error('No such user found');
  }

  if (task.user.toString() !== userId) {
    res.status(401);
    throw new Error('User is not authorized to update');
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
  res.status(200).json(updatedTask);
})

const deleteTask = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  console.log("deleteTask taskId", taskId);

  const task = await Task.findById(taskId);

  if (!task) {
    res.status(400)
    throw new Error('Task not found');
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(401);
    throw new Error('No such user found');
  }

  if (task.user.toString() !== userId) {
    res.status(401);
    throw new Error('User is not authorized to delete');
  }

  await Task.findByIdAndDelete(taskId);
  res.status(200).json({ id: taskId });
})



module.exports = { getTasks, creatTask, updateTask, deleteTask };
