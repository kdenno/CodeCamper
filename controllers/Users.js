const ErrorResponse = require("../util/ErrorMessage");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

// @desc Get all users
// @route GET /api/v1/auth/users
// @access Private/Adamin

exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.AdvancedResults);
});

// @desc Get single user
// @route GET /api/v1/auth/users/:Id
// @access Private/Adamin

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.Id);
  res.status(200).json({ success: true, data: user });
});

// @desc Create User
// @route POST /api/v1/auth/users
// @access Private/Adamin

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// @desc Update single user
// @route PUT /api/v1/auth/users/:Id
// @access Private/Adamin

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.Id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});

// @desc Delete user
// @route DELETE /api/v1/auth/users/:Id
// @access Private/Adamin

exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.Id);
  res.status(200).json({ success: true, data: {} });
});
