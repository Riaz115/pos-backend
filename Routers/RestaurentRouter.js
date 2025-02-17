//requiring
const express = require("express");
const RestRouter = express.Router();
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const userAuth = require("../MiddleWares/UserAuth");
const controllers = require("../Controllers/RestaurentControllers");
const newController = require("../Controllers/ItemsAndCatagoriesControllers");
const logMiddleware = require("../MiddleWares/LogData");
const checkPermission = require("../MiddleWares/CheckPermisisonsMiddleware");

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
RestRouter.route("/getUserAllRestaurents/:id").get(
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
RestRouter.route("/getforallorders/:id/credit").get(
  controllers.forGettingGuestAllCreditOrders
);

RestRouter.route("/getsingle/:orderid/creditorder/data/:guestid").get(
  userAuth,
  controllers.forGettingGuestCreditSingleOrderData
);

RestRouter.route("/restaurent/:id/get/all/roles").get(
  controllers.forGettingAllRoles
);

RestRouter.route("/restaurent/:restid/get/role/:id/data").get(
  controllers.forGEttingRoleData
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
RestRouter.route(
  "/forpay/singlecreditorder/:orderid/guest/:guestid/:dayid/day"
).post(userAuth, controllers.forPayGuestSingleCreditOrder);

RestRouter.route("/forpay/multiorder/credit/:guestid/guest/:dayid/day").post(
  userAuth,
  controllers.forPayGuestAllCreditOrders
);
RestRouter.route("/restauret/:id/add/new/role").post(
  userAuth,
  controllers.forAddRoleToRest
);

//all update routes
RestRouter.route("/editRestaurent/:id").patch(
  upload.single("restLogo"),
  controllers.forEditResturent
);

RestRouter.route("/update/:id/counter").patch(controllers.forUpdateCounter);
RestRouter.route("/update/:id/catagory").patch(
  userAuth,
  logMiddleware,
  newController.forUpdateCatagory
);

RestRouter.route("/editmenuitem/:id").patch(
  menuItemUpload.single("image"),
  newController.forUpdateMenuItem
);

RestRouter.route("/editcomboitem/:id").patch(
  comboItemUpload.single("image"),
  newController.forEditComboItem
);
RestRouter.route("/editguest/:id").patch(controllers.forEditGuest);
RestRouter.route("/restaurent/:restid/edit/:id/role").patch(
  controllers.forEditTheRole
);

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
RestRouter.route("/delete/:id/counter").delete(controllers.forDeleteCounter);
RestRouter.route("/delete/:id/restaurent").delete(
  controllers.forDeleteRestaurent
);
RestRouter.route("/restaurent/delete/:id/role").delete(
  controllers.forDeleteTheRole
);

//Exporting
module.exports = RestRouter;
