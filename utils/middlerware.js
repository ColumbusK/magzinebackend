const createError = require('http-errors');

function unknowEndpoint(req, res, next) {
  next(createError(404));
}

function errorHandler(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.statusCode || 500);
  res.render('error');
}


module.exports = {
  errorHandler,
  unknowEndpoint
}
