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
  return res.status(200).json({ success: true, data: review });
});

// @desc Add review to bootcamp
// @route POST /api/v1/bootcamp/:Id/reviews
// @access Private

exports.addReview = asyncHandler(async (req, res, next) => {
  // add userId and bootcampId to req.body
  req.body.bootcamp = req.params.Id;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.Id);
  if (!bootcamp) {
    return next(
      new ErrorMessage(`Bootcamp with id ${req.params.Id} was not found`, 404)
    );
  }
  const addReview = await Review.create(req.body);
  return res.status(201).json({ success: true, data: addReview });
});

// @desc Update review
// @route PUT /api/v1/reviews/:Id
// @access Private

exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.Id);
  if (!review) {
    return next(
      new ErrorMessage(`Review with id ${req.params.Id} was not found`, 404)
    );
  }
  // check if user owns the review or is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorMessage(`User is not authorized to update review`, 401)
    );
  }
  const updatedReview = await Review.findByIdAndUpdate(
    req.params.Id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  return res.status(200).json({ success: true, data: updatedReview });
});

// @desc DELETE review
// @route DELETE /api/v1/reviews/:Id
// @access Private

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.Id);
  if (!review) {
    return next(
      new ErrorMessage(`Review with id ${req.params.Id} was not found`, 404)
    );
  }
  // check if user owns the review or is admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorMessage(`User is not authorized to delete review`, 401)
    );
  }
  await review.remove({ _id: req.params.Id });
  return res.status(200).json({ success: true, data: {} });
});
