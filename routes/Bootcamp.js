const express = require("express");

// include other resource routers
const courseRouter = require("./Courseroutes");
const Bootcamp = require("../models/Bootcamp");
const advancedMiddleware = require("../middleware/advancedMiddleware");
const {protect} = require('../middleware/auth');

const routes = express.Router();

// Re route into other route resources
routes.use("/:bootcampId/courses", courseRouter); // re route anything that has such a url to courseRouter

const apicontroller = require("../controllers/bootcampcontrollers");

routes.get("/", advancedMiddleware(Bootcamp, 'courses'), apicontroller.bootcamps);
routes.post("/", protect, apicontroller.createbootcamp);
routes.get("/:Id", apicontroller.getbootcamp);
routes.get(
  "/radius/:zipcode/:distance",
  apicontroller.findBootcampsWithinRadius
);
routes.put("/:Id", protect, apicontroller.Updatebootcamp);
routes.delete("/:Id", protect, apicontroller.deletebootcamp);
routes.put("/:Id/photo", protect, apicontroller.bootcampPhotoUpload);

module.exports = routes;
