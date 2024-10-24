//Requiring
require("dotenv").config();
const mongoose = require("mongoose");

//variables
const URI = process.env.MONGOOSE_URI;

//this is for the connection
const forDbConn = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Db connection successfully");
  } catch (err) {
    console.log("there is error in the db conn file ", err);
  }
};

module.exports = forDbConn;
