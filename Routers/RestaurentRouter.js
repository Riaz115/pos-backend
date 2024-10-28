//requiring
const express = require("express");
const RestRouter = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const userAuth = require("../MiddleWares/UserAuth");
const controllers = require("../Controllers/RestaurentControllers");
const newController = require("../Controllers/ItemsAndCatagoriesControllers");

//for restaurent logo
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "RestaurentImages/");
  },
  filename: function (req, file, callback) {
    crypto.randomBytes(12, function (err, bytes) {
      let fn = bytes.toString("hex") + path.extname(file.originalname);
      callback(null, fn);
    });
  },
});
const upload = multer({ storage: storage });

//this is for menu item image
const menuItemStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "menuItemImages/"); // New folder for menu items
  },
  filename: function (req, file, callback) {
    crypto.randomBytes(12, function (err, bytes) {
      let fn = bytes.toString("hex") + path.extname(file.originalname);
      callback(null, fn);
    });
  },
});
const menuItemUpload = multer({ storage: menuItemStorage });

//this is for the image of combo item
const comboItemIamge = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "comboItemImages/"); // New folder for menu items
  },
  filename: function (req, file, callback) {
    crypto.randomBytes(12, function (err, bytes) {
      let fn = bytes.toString("hex") + path.extname(file.originalname);
      callback(null, fn);
    });
  },
});
const comboItemUpload = multer({ storage: comboItemIamge });

//routing

//all get routes
RestRouter.route("/getUserAllRestaurents").get(
  userAuth,
  controllers.forGetUserAllRestaurents
);

RestRouter.route("/getRestDataforEdit/:id").get(
  controllers.forGetDataforEditRest
);

RestRouter.route("/getAllCountersofRestaurent/:id").get(
  controllers.forGetAllCountersOfRestaurent
);

RestRouter.route("/getdataforeditcounter/:id").get(
  controllers.getDataForEditCounter
);

RestRouter.route("/getdataforedit/:id/counter").get(
  controllers.getDataForEditCounter
);

RestRouter.route("/get-all-catagories/:id").get(
  newController.forGetallCatagories
);

RestRouter.route("/get-all-menuitems/:id").get(
  newController.forGetAllMenuItems
);

RestRouter.route("/getdataforedit/:id/catagory").get(
  newController.forGetCatagoryDataForUpdate
);

RestRouter.route("/getdataforedit/:id/menuitem").get(
  newController.getDataForUpdateItem
);

RestRouter.route("/forgetalldata/:id/comboitem").get(
  newController.forGetAllComboItems
);

RestRouter.route("/getdataforedit/:id/comboitem").get(
  newController.getDataForEditComboItem
);

RestRouter.route("/forgetall/:id/guests").get(controllers.forGetAllGuest);
RestRouter.route("/getforedit/:id/guest").get(
  controllers.forGetDataGuestForEdit
);

//all post routes
RestRouter.route("/addRestaurent").post(
  userAuth,
  upload.single("restLogo"),
  controllers.forAddRestaurent
);

RestRouter.route("/forAddCounter/:id/addCounter").post(
  controllers.forAddCounter
);

RestRouter.route("/foraddcatagory/:id/addcatagory").post(
  newController.forAddCatagory
);

RestRouter.route("/foraddmenuitem/:id/addmenuitem").post(
  menuItemUpload.single("image"),
  newController.forAddMenuItem
);

RestRouter.route("/foradd/:id/combo").post(
  comboItemUpload.single("image"),
  newController.forCreateComboItem
);

RestRouter.route("/foradd/:id/guest").post(controllers.addRestGuest);

//all update routes
RestRouter.route("/editRestaurent/:id").patch(
  upload.single("restLogo"),
  controllers.forEditResturent
);

RestRouter.route("/update/:id/counter").patch(controllers.forUpdateCounter);
RestRouter.route("/update/:id/catagory").patch(newController.forUpdateCatagory);

RestRouter.route("/editmenuitem/:id").patch(
  menuItemUpload.single("image"),
  newController.forUpdateMenuItem
);

RestRouter.route("/editcomboitem/:id").patch(
  comboItemUpload.single("image"),
  newController.forEditComboItem
);
RestRouter.route("/editguest/:id").patch(controllers.forEditGuest);

//all delete routes
RestRouter.route("/delete/:id/catagory").delete(
  newController.forDeleteCatagory
);

RestRouter.route("/delete/:id/menuitem").delete(
  newController.forDeleteMenuItem
);

RestRouter.route("/delete/:id/comboitem").delete(
  newController.forDeleteComboItem
);
RestRouter.route("/delete/:id/guest").delete(controllers.forDeleteGuest);

//Exporting
module.exports = RestRouter;
