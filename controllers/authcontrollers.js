const ErrorResponse = require("../util/ErrorMessage");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// @desc Register user
// @route POST /api/v1/auth/register
// @access Private

exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});
