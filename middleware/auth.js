const asyncHandler = require("./asyncHandler");
const ErrorResponseMessage = require("../util/ErrorMessage");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ErrorResponseMessage("Not Authorized to access this route", 401)
    );
  }
  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // find user and attache them on request
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(error);
  }
});
