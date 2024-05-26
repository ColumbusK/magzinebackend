var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
//
const { errorHandler } = require('./middlewares/errorMiddleware');
const middleware = require('./utils/middlerware')
const indexRouter = require('./routes/index');
//
const connectDB = require('./connection/database');


// 连接数据库
connectDB();
const app = express();


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
app.use('/api/magzines', require('./routes/magzineRoutes'))
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskRoute'));
app.use('/api/books', require('./routes/bookRoute'));


// catch 404 and forward to error handler
app.use(middleware.unknowEndpoint);
// error handler
app.use(errorHandler);

module.exports = app;
