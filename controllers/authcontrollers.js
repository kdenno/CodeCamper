const ErrorResponse = require("../util/ErrorMessage");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// @desc Register user
// @route POST /api/v1/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role
  });
  // get the token off the user object
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});

// @desc Login
// @route POST /api/v1/auth/login
// @access Public

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password"); // since we want the password for validation so we overide the select that we set in the model
  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  // verify password
  if (!(await user.matchPassword(password))) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  // get the token off the user object
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});
