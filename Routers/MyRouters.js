//requiring
const express = require("express");
const router = express.Router();
const controllers = require("../Controllers/MyControllers");
const userAuth = require("../MiddleWares/UserAuth");
const { upload, uploadToCloudinary } = require("../MiddleWares/upload");

//this is for login
router.route("/login").post(controllers.forLoginUser);

//all get routes
router.route("/").get(controllers.Home);
router.route("/getUserData").post(userAuth, controllers.getUserData);
router.route("/allOwnerUser").get(userAuth, controllers.forGetAllOwnerUsers);
router
  .route("/getOwnerUserDataForUpdate/:id")
  .get(userAuth, controllers.getForOwnerUserData);

//all post routes
router
  .route("/addUser")
  .post(
    userAuth,
    upload("image"),
    uploadToCloudinary,
    controllers.AddOwnerUser
  );

//all update routes
router
  .route("/editOwnerUser/:id")
  .patch(
    userAuth,
    upload("image"),
    uploadToCloudinary,
    controllers.forEditOwnerUser
  );

//all delete routes
router.route("/deleteOwnerUser/:id").delete(controllers.forDeleteOwnerUser);

//Exporting
module.exports = router;
