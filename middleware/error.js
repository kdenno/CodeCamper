const errorHandler = (err, req, res, next) => {
  if (err) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message
    });
  }
  next();
};
module.exports = errorHandler;
