const express = require("express");
const routes = express.Router();
const {
  register,
  login,
  getLoggedInUser,
  ResetPassword,
  updatePassword,
  updateUserDetails,
  changePassword,
  logout
} = require("../controllers/authcontrollers");
const { protect } = require("../middleware/auth");

routes.post("/register", register);
routes.post("/login", login);
routes.get("/me", protect, getLoggedInUser);
routes.get("/logout", protect, logout);
routes.post("/forgotpassword", ResetPassword);
routes.put("/resetpassword/:resettoken", updatePassword);
routes.put("/updatedetails", protect, updateUserDetails);
routes.put("/changepassword", protect, changePassword);

module.exports = routes;
