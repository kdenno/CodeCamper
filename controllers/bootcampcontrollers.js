const Bootcamp = require("../models/Bootcamp");
const ErrorMessage = require("../util/ErrorMessage");

exports.bootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
exports.createbootcamp = async (req, res, next) => {
  try {
    const newBootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: newBootcamp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getbootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.Id);
    if (!bootcamp) {
      return  next(new ErrorMessage(`Bootcamp with ID ${req.params.Id} doesnot exist`, 400));
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    // res.status(400).json({ success: false, message: error.message });
    // push error to the middleware
    next(new ErrorMessage(`Bootcamp with ID ${req.params.Id} doesnot exist`, 400));
  }
};
exports.Updatebootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.Id, req.body, {
      new: true,
      runValidators: true
    });
    if (!bootcamp) {
      return res
        .status(400)
        .json({ success: false, message: "No bootcamp found" });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletebootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.Id);
    if (!bootcamp) {
      return res
        .status(400)
        .json({ success: false, message: "No bootcamp found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
