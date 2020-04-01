const Bootcamp = require("../models/Bootcamp");
const ErrorMessage = require("../util/ErrorMessage");
const asyncHandler = require("../middleware/asyncHandler");
const geoCoder = require("../util/geocoder");

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

// @desc get bootcamps within a distance
// @params zipcode, distance
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance


exports.findBootcampsWithinRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  // get lat and lng from geo coder
  const loc = await geoCoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  console.log(lat, lng);
  // calculate raidus in radians
  // raidus of earth 3,963m / 6,378km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: {$geoWithin: { $centerSphere: [ [ lat, lng ], radius ] }}
  }); 

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
