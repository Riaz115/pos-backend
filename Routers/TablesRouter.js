//requiring
const express = require("express");
const trouter = express.Router();
const controllers = require("../Controllers/TablesControllers");

//all gets route
trouter.route("/getall/tables").get(controllers.forGetAllTables);

//all posts route
trouter.route("/add/:id/table").post(controllers.forAddTable);

//all petch routes
trouter.route("/edit/:id/table").patch(controllers.forEditTable);

//all delete routes
trouter.route("/delete/:id/table").delete(controllers.forDeleteTable);

//exporting
module.exports = trouter;
