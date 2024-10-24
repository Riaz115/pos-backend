//requiring
const express = require("express");
const trouter = express.Router();
const controllers = require("../Controllers/TablesControllers");

//all gets route
trouter.route("/testing").get(controllers.forTesting);

//all posts route
trouter.route("/add/:id/table").post(controllers.forAddTable);

//all petch routes

//all delete routes

//exporting
module.exports = trouter;
