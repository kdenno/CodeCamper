const express = require("express");
const Course = require("../models/Courses");
const asyncHandler = require("../middleware/asyncHandler");

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }
  const courses = await query;
  res
    .status(200)
    .json({ success: true, count: courses.length, data: courses });
});
