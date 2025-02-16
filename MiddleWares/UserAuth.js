require("dotenv").config();
const jwt = require("jsonwebtoken");
const MyUsers = require("../Models/UserModel");
const CounterUsers = require("../Models/CounterUsers");

const forUserAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ msg: "Please provide a token" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRETE_KEY);

    if (!verifyToken) {
      return res.status(401).json({ msg: "Invalid token, please login again" });
    }

    let myUserData = await MyUsers.findOne({ email: verifyToken.email }).select(
      "-password"
    );

    if (!myUserData) {
      myUserData = await CounterUsers.findOne({
        email: verifyToken.email,
      }).select("-password");
    }

    if (!myUserData) {
      return res.status(401).json({ msg: "User not found, please register" });
    }

    // User ko request me store karna
    req.user = myUserData;
    req.token = token;
    req.userId = myUserData._id;

    next();
  } catch (err) {
    console.log("Error in user auth middleware", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = forUserAuth;
