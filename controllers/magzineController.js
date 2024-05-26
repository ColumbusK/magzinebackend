const asyncHandler = require('express-async-handler');
const Magzine = require('../models/magzineModel');


const getMagzines = asyncHandler(async (req, res) => {
  console.log('route: /api/magzines');
  // const magzines = await Magzine.find({ user: req.user.id })
  // console.log(req.user.id);
  const magzines = await Magzine.find({ type: 'TE' }).sort({ datetime: -1 });
  res.status(200).json(magzines);
})

//
const getMagzine = asyncHandler(async (req, res) => {
  console.log('route: /api/magzines/:id');
  const id = req.params.id
  console.log("id", id)
  const magzines = await Magzine.find({ _id: id });
  res.status(200).json(magzines);
})

const addMagzine = asyncHandler(async (req, res) => {
  let data = req.body;
  // post 数据验证
  if (!data.coverUrl) {
    res.status(400);
    throw new Error('Please contain magzine cover image!');
  }
  // 打印请求body中的数据
  data = { ...data, user: req.user.id }
  console.log("body", data);

  const magzine = await Magzine.create(data);
  res.status(200).json(magzine);
})


const updateMagzine = asyncHandler(async (req, res) => {
  const magzine = await Magzine.findOne({ title: req.params.title });
  if (!magzine) {
    res.status(400);
    throw new Error('Magzine not found');
  }
  const updatedMagzine = await Magzine.findOneAndUpdate(
    { title: req.params.title }, req.body, { new: true }
  );
  res.status(200).json(updatedMagzine);
})


const deleteMagzine = asyncHandler(async (req, res) => {
  const magzine = await Magzine.findOne({ title: req.params.title });

  if (!magzine) {
    res.status(400);
    throw new Error('Magzine not found');
  }

  const deleted = await Magzine.findOneAndDelete({ title: req.params.title });
  res.status(200).json(deleted)
})


module.exports = { getMagzines, addMagzine, updateMagzine, deleteMagzine, getMagzine };
