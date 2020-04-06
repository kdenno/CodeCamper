const ErrorResponse = require("../util/ErrorMessage");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const EmailSender = require("../util/sendEmail");
const crypto = require("crypto");

// @desc Register user
// @route POST /api/v1/auth/register
// @access Public

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  sendCookie(user, 200, res);
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

  sendCookie(user, 200, res);
});

//@desc Logout
//@route GET /api/v1/auth/logout
//@access Puglic
exports.logout = (req, res, next) => {
  // clear cookie
  res.cookie("token", "none", {
    expire: Date(Date.now() + 10 * 1000),
    httpOnly: false,
  });

  res.status(200).json({ success: true, data: {} });
};

// @desc Get logged in user
// @route GET /api/v1/auth/me
// @access Private

exports.getLoggedInUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
});

// @desc Reset password
// @route POST /api/v1/auth/reset
// @access Public

exports.ResetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse("User not found", 400));
  }
  // get token
  const resetToken = user.CreateResetPasswordToken();
  // persist the data to the database
  await user.save({ validateBeforeSave: false });
  // send email logic
  const resetUrl = `${req.protocol}://${req.hostname}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `You are receiving this email because you or someone else requested the reset of a password
  Please make a put request to \n\n ${resetUrl}`;

  try {
    await EmailSender({
      email: user.email,
      subject: "Password Reset Token",
      message,
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Failed to send Email", 500));
  }
});

// @desc Reset user password
// @route PUT /api/v1/auth/resetpassword
// @access Public

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
  const user = User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }
  // set new password
  user.password = req.body.newpassword;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  sendCookie(user, 200, res);
});

// @desc update user details
// @route PUT /api/v1/auth/updatedetails
// @access Private

exports.updateUserDetails = asyncHandler(async (req, res, next) => {
  const updateFields = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});

// @desc change user password
// @route PUT /api/v1/auth/changepassword
// @access Private

exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  // compare passwords
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendCookie(user, 200, res);
});

// create cookie, send cookie
const sendCookie = (userObj, statusCode, res) => {
  // create cookie options
  const options = {
    expire: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  // get the token off the user object
  const token = userObj.getSignedJwtToken();

  res
    .cookie("token", token, options)
    .status(statusCode)
    .json({ success: true, token });
};
