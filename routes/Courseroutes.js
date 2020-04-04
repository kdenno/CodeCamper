const express = require("express");
const routes = express.Router({ mergeParams: true });
const courseControllers = require("../controllers/coursecontrollers");
const Course = require("../models/Courses");
const AdvancedResults = require("../middleware/advancedMiddleware");
const {protect} = require('../middleware/auth');

routes.get(
  "/",
  AdvancedResults(Course, {
    path: "bootcamp",
    select: "name description"
  }),
  courseControllers.getCourses
); // handles forwarded route with get /:bootcampId/courses
routes.get("/:Id", courseControllers.getCourse);
routes.post("/", protect, courseControllers.addCourse); // handles forwarded route with post /:bootcampId/courses
routes.put("/:Id", protect, courseControllers.updateCourse);
routes.delete("/:Id", protect, courseControllers.deleteCourse);
module.exports = routes;
