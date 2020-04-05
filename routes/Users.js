const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/Users");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedMiddleware");

const User = require("../models/User");

router.use(protect);
router.use(authorize("admin")); // anything below here will user protect and authorize as middleware


router.route("/").get(advancedResults(User), getUsers).post(createUser);

router.route("/:Id").get(getUser).delete(deleteUser).put(updateUser);
module.exports = router;
