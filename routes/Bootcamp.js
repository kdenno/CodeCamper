const express = require("express");

// include other resource routers
const courseRouter = require("./Courseroutes");
const Bootcamp = require("../models/Bootcamp");
const advancedMiddleware = require("../middleware/advancedMiddleware");

const routes = express.Router();

// Re route into other route resources
routes.use("/:bootcampId/courses", courseRouter); // re route anything that has such a url to courseRouter

const apicontroller = require("../controllers/bootcampcontrollers");

routes.get("/", advancedMiddleware(Bootcamp, 'courses'), apicontroller.bootcamps);
routes.post("/", apicontroller.createbootcamp);
routes.get("/:Id", apicontroller.getbootcamp);
routes.get(
  "/radius/:zipcode/:distance",
  apicontroller.findBootcampsWithinRadius
);
routes.put("/:Id", apicontroller.Updatebootcamp);
routes.delete("/:Id", apicontroller.deletebootcamp);
routes.put("/:Id/photo", apicontroller.bootcampPhotoUpload);

module.exports = routes;
