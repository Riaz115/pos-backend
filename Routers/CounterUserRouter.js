//requiring
const express = require("express");
const CounterUserRouter = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const controllers = require("../Controllers/CounterUserController");

//for image
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "CounterUserImages/");
  },
  filename: function (req, file, callback) {
    crypto.randomBytes(12, function (err, bytes) {
      let fn = bytes.toString("hex") + path.extname(file.originalname);
      callback(null, fn);
    });
  },
});

const upload = multer({ storage: storage });

//routing

//all get routes
CounterUserRouter.route("/getcounterallusers/:counterid").get(
  controllers.forGetCounterAllUser
);

CounterUserRouter.route("/getuserforedit/:userid").get(
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
CounterUserRouter.route("/addcounteruser/:counterid").post(
  upload.single("counterUserImage"),
  controllers.forAddUserInCounter
);

CounterUserRouter.route("/counter/:id/counterareas").post(
  controllers.forAddCounterArea
);

//all update routes
CounterUserRouter.route("/foreditcounteruser/:forupdateid").patch(
  upload.single("counterUserImage"),
  controllers.forEditCounterUser
);

CounterUserRouter.route("/foreditcounterarea/:id").patch(
  controllers.forEditCounterArea
);
//all delete routes

CounterUserRouter.route("/delete/:id/counterarea").delete(
  controllers.forDelteAreaOfTheCounter
);

//Exporting
module.exports = CounterUserRouter;
