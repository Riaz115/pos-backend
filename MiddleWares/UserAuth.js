require("dotenv").config();
const jwt = require("jsonwebtoken");
const myAllOwnerUsersData = require("../Models/UserModel");

const forUserAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const verifyToken = jwt.verify(token, process.env.JWT_SECRETE_KEY);

    if (!verifyToken) {
      res.status(401).msg({ msg: "please Register or Login" });
    } else {
      const myUserData = await myAllOwnerUsersData
        .findOne({
          email: verifyToken.email,
        })
        .select({
          password: 0,
        });

      req.user = myUserData;
      req.token = token;
      req.userId = myUserData._id;

      next();
    }
  } catch (err) {
    console.log("there is error in user auth middleWare");
  }
};

module.exports = forUserAuth;
