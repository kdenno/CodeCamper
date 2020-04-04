const ErrorResponse = require("../util/ErrorMessage");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// @desc Register user
// @route POST /api/v1/auth/register
// @access Private

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
