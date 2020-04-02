const Bootcamp = require("../models/Bootcamp");
const ErrorMessage = require("../util/ErrorMessage");
const asyncHandler = require("../middleware/asyncHandler");
const geoCoder = require("../util/geocoder");

exports.bootcamps = asyncHandler(async (req, res, next) => {
  let query;
  let reqQuery = { ...req.query };

  // fields to exclude
  const removeFields = ["select", "sort", 'page', 'limit'];

  // remove fields from query
  removeFields.forEach(param => delete reqQuery[param]);

  // create mongo operators from  req.query averageCost[lte]=10000 to {"averageCost":{"$lte":"10000"},"location.city":"Boston"}
  const queryString = JSON.stringify(reqQuery).replace(/\b gt|lt|lte|gte|in\b/g,match => `$${match}` );
  
  query = Bootcamp.find(JSON.parse(queryString)).populate('courses');

  // query with select in it
  if (req.query.select) {
    // req.query.select = select=name,description
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  // query with sort in it
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1)*limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;

  // Pagination result
  const pagination = {};
  if(endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }

  }
  if(startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit
    }

  }
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
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
  const bootcamp = await Bootcamp.findById(req.params.Id);
  if (!bootcamp) {
    return next(new Error());
  }
  bootcamp.remove(); // this remove method will trigger the pre remove middleware
  
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
    location: { $geoWithin: { $centerSphere: [[lat, lng], radius] } }
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
