const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Book = require('../models/bookModel');


const getAllBooks = asyncHandler(async (req, res) => {
  console.log("getBooks");
  const books = await Book.find({}).sort({ createAt: -1 });
  console.log("getBooks", books);
  res.status(200).json(books);
})

const searchBooks = asyncHandler(async (req, res) => {
  const { title } = req.query;
  let pipeline = [
    // 匹配 title 字段
    { $match: { title: { $regex: new RegExp(title, 'i') } } },
    // 执行左外连接，将 books 集合中的 user 字段与 users 集合的 _id 字段关联
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    // 将结果展开，保留 books 集合中的字段和 users 集合中的 username 字段
    {
      $unwind: '$userDetails',
    },
    // 选择需要返回的字段
    {
      $project: {
        _id: 1,
        title: 1,
        topics: 1,
        coverUrl: 1,
        downloadUrl: 1,
        panUrl: 1,
        ISBN: 1,
        createdAt: 1,
        updatedAt: 1,
        username: '$userDetails.username', // 保留 users 集合中的 username 字段
      },
    },
    // 排序
    {
      $sort: { createdAt: -1 },
    },
  ];
  // 执行聚合查询
  const result = await Book.aggregate(pipeline);
  res.status(200).json(result);
})

const creatBook = asyncHandler(async (req, res) => {
  const { title, topics, downloadUrl, panUrl } = req.body;
  if (!title || !topics || !downloadUrl || !panUrl) {
    res.status(400);
    throw new Error('请检查输入信息是否完整');
  }
  const book = await Book.create({ ...req.body, user: req.user.id });
  res.status(200).json(book);
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



module.exports = { getAllBooks, creatBook, searchBooks };
