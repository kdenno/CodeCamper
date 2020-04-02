const express = require("express");
const routes = express.Router({mergeParams: true});
const courseControllers = require("../controllers/coursecontrollers");

routes.get("/", courseControllers.getCourses); // handles forwarded route with get /:bootcampId/courses
routes.get("/:Id", courseControllers.getCourse);
routes.post('/', courseControllers.addCourse); // handles forwarded route with post /:bootcampId/courses
routes.put('/:Id', courseControllers.updateCourse);
module.exports = routes;
