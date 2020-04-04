const express = require("express");
const routes = express.Router({ mergeParams: true });
const courseControllers = require("../controllers/coursecontrollers");
const Course = require("../models/Courses");
const AdvancedResults = require("../middleware/advancedMiddleware");
const { protect, authorize } = require("../middleware/auth");

routes.get(
  "/",
  AdvancedResults(Course, {
    path: "bootcamp",
    select: "name description"
  }),
  courseControllers.getCourses
); // handles forwarded route with get /:bootcampId/courses
routes.get("/:Id", courseControllers.getCourse);
routes.post(
  "/",
  protect,
  authorize("admin", "publisher"),
  courseControllers.addCourse
); // handles forwarded route with post /:bootcampId/courses
routes.put(
  "/:Id",
  protect,
  authorize("admin", "publisher"),
  courseControllers.updateCourse
);
routes.delete(
  "/:Id",
  protect,
  authorize("admin", "publisher"),
  courseControllers.deleteCourse
);
module.exports = routes;
