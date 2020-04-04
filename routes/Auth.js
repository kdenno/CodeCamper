const express = require('express');
const routes = express.Router();
const {register} = require("../controllers/authcontrollers");

routes.post('/register', register);

module.exports = routes;