const express = require("express");
const Review = require("../models/Reviews");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorMessage = require("../util/ErrorMessage");
const Bootcamp = require("../models/Bootcamp");

// @desc Get Reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews -- reviews is associated with a bootcamp
// @access Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Get Single Review
// @route GET /api/v1/reviews/:Id
// @access Public

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.Id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    return next(
      new ErrorMessage(`Review with Id ${req.params.Id} was not found`, 404)
    );
  }
  return res
    .status(200)
    .json({ success: true, data: review });
});

// @desc Add review to bootcamp 
// @route POST /api/v1/bootcamp/:bootcampId/reviews
// @access Private

exports.addReview = asyncHandler(async (req, res, next) => {
    // add userId and bootcampId to req.body  
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp) {
        return next(new ErrorMessage(`Bootcamp with id ${req.params.bootcampId} was not found`, 404));
    }
    const addReview = await Review.create(req.body);
    return res
      .status(201)
      .json({ success: true, data: addReview });
  });