const allCatagories = require("../Models/CatagoryModel");

const forLogData = async (req, res, next) => {
  const data = req.body;
  const id = req.params;

  console.log(id);

  try {
    console.log("ok data", data);
    console.log(req.user);
    next();
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

module.exports = forLogData;
