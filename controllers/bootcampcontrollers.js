const Bootcamp = require("../models/Bootcamp");
const ErrorMessage = require("../util/ErrorMessage");
const asyncHandler = require("../middleware/asyncHandler");

exports.bootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
exports.createbootcamp = asyncHandler(async (req, res, next) => {
  const newBootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: newBootcamp });
});

exports.getbootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.Id);
  if (!bootcamp) {
    return next(new Error());
  }
  res.status(200).json({ success: true, data: bootcamp });
});
exports.Updatebootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.Id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    return next(new Error());
  }
  res.status(200).json({ success: true, data: bootcamp });
});

exports.deletebootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.Id);
  if (!bootcamp) {
    return next(new Error());
  }
  res.status(200).json({ success: true, data: {} });
});
