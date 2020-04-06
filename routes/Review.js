const express = require("express");
const router = express.Router({ mergeParams: true });
const advancedResults = require("../middleware/advancedMiddleware");
const { protect, authorize } = require("../middleware/auth");
const Review = require("../models/Reviews");

const { getReviews, getReview } = require("../controllers/Reviews");

router.route("/").get(
  advancedResults(Review, {
    path: "bootcamp",
    select: "name description",
  }),
  getReviews
);

router.route("/:Id").get(getReview);

module.exports = router;
