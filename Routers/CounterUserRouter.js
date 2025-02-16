//requiring
const express = require("express");
const CounterUserRouter = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const controllers = require("../Controllers/CounterUserController");
const userAuth = require("../MiddleWares/UserAuth");
const { upload, uploadToCloudinary } = require("../MiddleWares/upload");

//all get routes
CounterUserRouter.route("/getcounterallusers/:counterid").get(
  controllers.forGetCounterAllUser
);

CounterUserRouter.route("/getuserforedit/:id").get(
  controllers.getUserDataforEdit
);

CounterUserRouter.route("/getforallcounterareas/:id").get(
  controllers.forGetAllCounterArea
);
CounterUserRouter.route("/forallcounterareas/get/all").get(
  controllers.forGettingAllCounterAreas
);

CounterUserRouter.route("/getdataforeditcounterarea/:id").get(
  controllers.forEditGetDataCounterArea
);
CounterUserRouter.route("/get/data/:id/counter").get(
  controllers.forGettingDataOfCounter
);
//all post routes
CounterUserRouter.route("/addcounteruser/:id").post(
  upload("counterUserImage"),
  uploadToCloudinary,
  controllers.forAddUserInCounter
);

CounterUserRouter.route("/counter/:id/counterareas").post(
  controllers.forAddCounterArea
);

//all update routes
CounterUserRouter.route("/foreditcounteruser/:forupdateid").patch(
  upload("counterUserImage"),
  uploadToCloudinary,
  controllers.forEditCounterUser
);

CounterUserRouter.route("/foreditcounterarea/:id").patch(
  controllers.forEditCounterArea
);
//all delete routes

CounterUserRouter.route("/delete/:id/counterarea").delete(
  controllers.forDelteAreaOfTheCounter
);

CounterUserRouter.route("/delete/:id/restaurent/user").delete(
  userAuth,
  controllers.forDeleteTheRestaurentUser
);

//Exporting
module.exports = CounterUserRouter;
