const express = require("express");
const Course = require("../models/Courses");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorMessage = require("../util/ErrorMessage");
const Bootcamp = require("../models/Bootcamp");

exports.getCourses = asyncHandler(async (req, res, next) => {
  
  if (req.params.bootcampId) {
  const courses = await Course.find({ bootcamp: req.params.bootcampId });
  return res.status(200).json({success: true, count: courses.length, data: courses});
  } else {
    res.status(200).json(res.advancedResults);
  }
 
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
   req.body.user = req.user.id;
    const bootcamp =  await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp){
        next(new ErrorMessage(`Bootcamp with ID ${req.params.bootcampId} was not found`, 404));
       
    }
    // check if bootcamp owner is the one logged in
    if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorMessage(`User ${req.user.id} is not Authorized to add course to bootcamp${bootcamp._id}`,401));
      }
    const course = await Course.create(req.body);
    res.status(200).json({ success: true, data: course });


});

// @desc Update Course
// @route PUT /api/v1/courses/:Id/
// @access Private

exports.updateCourse = asyncHandler(async (req, res, next)=> {
   
     let course =  await Course.findById(req.params.Id);
     if(!course){
         next(new ErrorMessage(`Course with ID ${req.params.Id} was not found`, 404));  
     }
         // check if course is for this user
    if(couse.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorMessage(`User ${req.user.id} is not Authorized to update course ${course._id}`,401));
      }
     
     course = await Course.findByIdAndUpdate(req.params.Id, req.body, { new: true, runValidators: true});
     res.status(201).json({ success: true, data: course });
 
 
 });

 // @desc Delete Course
// @route Delete /api/v1/courses/:Id/
// @access Private

exports.deleteCourse = asyncHandler(async (req, res, next)=> {
   
    const course =  await Course.findById(req.params.Id);
    if(!course){
        next(new ErrorMessage(`Course with ID ${req.params.Id} was not found`, 404));  
    }
           // check if course is for this user
    if(couse.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorMessage(`User ${req.user.id} is not Authorized to delete course ${course._id}`,401));
      }
    await Course.remove({_id: req.params.Id});
    res.status(201).json({ success: true, data: {} });


});