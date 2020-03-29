const express = require("express");
const routes = express.Router();
const apicontroller = require("../controllers/bootcampcontrollers");

routes.get("/", apicontroller.bootcamps);
routes.post("/", apicontroller.createbootcamp);
routes.get("/:Id", apicontroller.getbootcamp);
routes.put("/:Id", apicontroller.Updatebootcamp);
routes.delete("/:Id", apicontroller.deletebootcamp);

module.exports = routes;
