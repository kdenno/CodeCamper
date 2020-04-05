const express = require("express");
const routes = express.Router();
const {
  register,
  login,
  getLoggedInUser,
  ResetPassword,
  updatePassword,
} = require("../controllers/authcontrollers");
const { protect } = require("../middleware/auth");

routes.post("/register", register);
routes.post("/login", login);
routes.get("/me", protect, getLoggedInUser);
routes.post("/forgotpassword", ResetPassword);
routes.put("/resetpassword/:resettoken", updatePassword);

module.exports = routes;
