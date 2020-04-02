const express = require("express");
const Course = require("../models/Courses");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorMessage = require("../util/ErrorMessage");
const Bootcamp = require("../models/Bootcamp");

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description"
    });
  }
  const courses = await query;
  res.status(200).json({ success: true, count: courses.length, data: courses });
});

exports.getCourse = asyncHandler(async (req, res, next)=> {
    if(!req.params.Id) {
       next(new ErrorMessage('No Id found', 400));
    }
    const course =  await Course.findById(req.params.Id).populate({ path: 'bootcamp', select: 'name description'});
    if(!course){
        next(new ErrorMessage(`Course with ID ${req.params.Id} was not found`, 404));
       
    }
    res.status(200).json({ success: true, data: course });


});

// @desc Add Course
// @route POST /api/v1/bootcamps/:bootcampId/course--course is associated with a bootcamp
// @access Private

exports.addCourse = asyncHandler(async (req, res, next)=> {
   // add bootcamp parameter to body the parameter should be the same as the foreign key in the Course model
   req.body.bootcamp = req.params.bootcampId;
    const bootcamp =  await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp){
        next(new ErrorMessage(`Bootcamp with ID ${req.params.bootcampId} was not found`, 404));
       
    }
    const course = await Course.create(req.body);
    res.status(200).json({ success: true, data: course });


});

// @desc Add Course
// @route POST /api/v1/bootcamps/:bootcampId/course--course is associated with a bootcamp
// @access Private

exports.updateCourse = asyncHandler(async (req, res, next)=> {
   
     let course =  await Course.findById(req.params.Id);
     if(!course){
         next(new ErrorMessage(`Course with ID ${req.params.Id} was not found`, 404));  
     }
     course = await Course.findByIdAndUpdate(req.params.Id, req.body, { new: true, runValidators: true});
     res.status(201).json({ success: true, data: course });
 
 
 });