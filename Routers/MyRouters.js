//requiring
const express = require("express");
const router = express.Router();
const controllers = require("../Controllers/MyControllers");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const userAuth = require("../MiddleWares/UserAuth");

//for image
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "UserImages/");
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

//this is for login
router.route("/login").post(controllers.forLoginUser);

//all get routes
router.route("/").get(controllers.Home);
router.route("/allOwnerUser").get(controllers.forGetAllOwnerUsers);
router
  .route("/getOwnerUserDataForUpdate/:id")
  .get(controllers.getForOwnerUserData);

//all post routes
router.route("/addUser").post(upload.single("image"), controllers.AddOwnerUser);
router.route("/getUserData").post(userAuth, controllers.getUserData);

//all update routes
router
  .route("/editOwnerUser/:id")
  .patch(upload.single("image"), controllers.forEditOwnerUser);

//all delete routes
router.route("/deleteOwnerUser/:id").delete(controllers.forDeleteOwnerUser);

//Exporting
module.exports = router;
