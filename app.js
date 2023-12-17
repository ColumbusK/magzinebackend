var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const middleware = require('./utils/middlerware')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mongoose = require("mongoose");
const config = require('./utils/config')
const _logger = require('./utils/logger')
//
const app = express();

// 连接数据库
_logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(
  config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    _logger.info('connected to MongoDB')
  })
  .catch((error) => {
    _logger.error('error connecting to MongoDB:', error.message)
  })



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 使用express框架功能中间件
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static('images'));


// 加载路由中间件
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(middleware.unknowEndpoint);
// error handler
app.use(middleware.errorHandler);

module.exports = app;
