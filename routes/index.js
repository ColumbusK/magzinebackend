var express = require('express');
var router = express.Router();
const Magzine = require('../models/magzineModel')
const classifyByDate = require('../utils/func')



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/*  RESTful API */
router.get('/api/getMagzines', (request, response) => {
  console.log('/api/magzines')
  console.log(magzines)
  response.json(magzines)
})

router.get('/api/getMagzinesFromCloudDB', (request, response) => {
  console.log('/api/getMagzinesFromCloudDB')
  const query = request.query
  console.log("request.query", request.query)
  Magzine.find(query, (err, res) => {
    if (err) return response.status(400).json({
      error: "CloudDB Finding Error"
    })
    const magzines = res.sort((a, b) => b.datetime - a.datetime)
    // console.log(magzines)
    response.json(magzines)
  })
})

router.get('/api/getMagzinesByType', (request, response) => {
  console.log('/api/getMagzinesFromCloudDB')
  const query = request.query
  console.log("request.query", request.query)
  Magzine.find(query, (err, res) => {
    if (err) return response.status(400).json({
      error: "CloudDB Finding Error"
    })
    let magzines = res.sort((a, b) => b.datetime - a.datetime)
    // console.log(magzines)
    magzines = classifyByDate(magzines)
    response.json(magzines)
  })
})


router.post('/api/addMagzine', async (request, response) => {
  // console.log(request)
  const data = request.body
  // post 数据验证
  if (!data.coverUrl) {
    return response.status(400).json({
      error: 'cover image is missing!'
    })
  }
  // 打印请求body中的数据
  console.log("body", data)

  try {
    const newMagzine = new Magzine(data)
    const magzine = await newMagzine.save()
    console.log(magzine)
    return response.status(200).json(magzine)
  } catch (err) {
    console.log(err);
    return response.status(400).json({
      error: 'mongoHandler error'
    })
  }
})

module.exports = router;
