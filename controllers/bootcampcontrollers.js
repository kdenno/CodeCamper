const Bootcamp = require("../models/Bootcamp");
const ErrorMessage = require("../util/ErrorMessage");
const asyncHandler = require("../middleware/asyncHandler");
const geoCoder = require("../util/geocoder");
const path = require('path');

exports.bootcamps = asyncHandler(async (req, res, next) => {
  
  res.status(200).json(res.advancedResults);
});
exports.createbootcamp = asyncHandler(async (req, res, next) => {
  // add user to req.body
  req.body.user = req.user.id;
  // make user only creates one bootcamp unless they are admin
  const publishedbootcamp = await Bootcamp.findOne({user: req.user.id});
  if(publishedbootcamp && req.user.role !== 'admin') {
    return next(new ErrorMessage(`User with Id ${req.user.id} has already published a bootcamp`, 400));
  }

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
  let bootcamp = await Bootcamp.findById(req.params.Id)
  if (!bootcamp) {
    return next(new Error());
  }
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorMessage('Not Authorized to update this bootcamp',401));
  }
  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.Id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ success: true, data: bootcamp });
});


exports.deletebootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.Id);
  if (!bootcamp) {
    return next(new Error());
  }
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorMessage('Not Authorized to delete this bootcamp',401));
  }
  bootcamp.remove({_id: req.params.Id}); // this remove method will trigger the pre remove middleware
  
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

//@desc upload photo
//@route PUT /api/v1/bootcamps/:Id/photo
//@access private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.Id);
  if (!bootcamp) {
    return next(new Error());
  }
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorMessage('Not Authorized to update this bootcamp',401));
  }
  if (!req.files) {
    return next(new ErrorMessage('Please upload a file', 400));
  }
  const thefile = req.files.file;
  // make sure its a photo
  if(!thefile.mimetype.startsWith('image')){
    return next(new ErrorMessage('Please upload an image file', 400));
  }

  if(!thefile.size > process.env.MAX_UPLOAD_SIZE){
    return next(new ErrorMessage(`Please upload an image less than ${process.env.MAX_UPLOAD_SIZE}`, 400));
  }
  // create custom filename
  const filename = `photo_${bootcamp._id}${path.parse(thefile.name).ext}`;
  
  // move file
  thefile.mv(`${process.env.FILE_UPLOAD_PATH}/${thefile.name}`, async err => {
    if(err) {
      console.log(err);
      return next(new ErrorMessage('Problem with file upload', 500));

    }
    await Bootcamp.findByIdAndUpdate(req.params.id, {photo: thefile.name});
    res
    .status(200)
    .json({ success: true, data: thefile.name });

  });
});