const errorHandler = (err, req, res, next) => {
  if (err) {
    let error = { ...err };
    if (err.name === "CastError") {
      //Mongoose Object badId
      const message = `Resource not found`;
      err.message = message;
    }
    if (error.code === 11000) {
      const message = "Duplicate field value entered";
      err.message = message;
      err.statusCode = 400;
    }
    if (error.name === "ValidationError") {
      const message = Object.values(err.errors).map(val => val.message);
      err.message = message.join(", ");
      err.statusCode = 400;
    }

    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message
    });
  }
  next();
};
module.exports = errorHandler;
