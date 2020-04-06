const express = require("express");

// include other resource routers
const courseRouter = require("./Courseroutes");
const reviewsRouter = require("./Review");
const Bootcamp = require("../models/Bootcamp");
const advancedMiddleware = require("../middleware/advancedMiddleware");
const { protect, authorize } = require("../middleware/auth");

const routes = express.Router();

// Re route into other route resources
routes.use("/:bootcampId/courses", courseRouter); // re route anything that has such a url to courseRouter
routes.use("/:bootcampId/reviews", reviewsRouter);

const apicontroller = require("../controllers/bootcampcontrollers");

routes.get(
  "/",
  advancedMiddleware(Bootcamp, "courses"),
  apicontroller.bootcamps
);
routes.post("/",protect,authorize("admin", "publisher"),apicontroller.createbootcamp);
routes.get("/:Id", apicontroller.getbootcamp);
routes.get(
  "/radius/:zipcode/:distance",
  apicontroller.findBootcampsWithinRadius
);
routes.put(
  "/:Id",
  protect,
  authorize("admin", "publisher"),
  apicontroller.Updatebootcamp
);
routes.delete(
  "/:Id",
  protect,
  authorize("admin", "publisher"),
  apicontroller.deletebootcamp
);
routes.put(
  "/:Id/photo",
  protect,
  authorize("admin", "publisher"),
  apicontroller.bootcampPhotoUpload
);

module.exports = routes;
