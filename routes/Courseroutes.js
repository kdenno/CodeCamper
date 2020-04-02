const express = require("express");
const routes = express.Router({mergeParams: true});
const courseControllers = require("../controllers/coursecontrollers");

routes.get("/", courseControllers.getCourses);
module.exports = routes;
