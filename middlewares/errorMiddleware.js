

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  console.log(statusCode, { message: err.message });
  res.json({ message: err.message })
}

module.exports = { errorHandler }
