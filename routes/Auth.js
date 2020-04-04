const express = require("express");
const routes = express.Router();
const {
  register,
  login,
  getLoggedInUser
} = require("../controllers/authcontrollers");
const { protect } = require("../middleware/auth");

routes.post("/register", register);
routes.post("/login", login);
routes.get("/me", protect, getLoggedInUser);

module.exports = routes;
