//importing
const path = require("path");
const fs = require("fs");
const CounterUsers = require("../Models/CounterUsers");
const Counter = require("../Models/CounterModel");
const counterAreas = require("../Models/CounterArea");

//this is for image url
const imageUrl = "http://localhost:8000/user-images/";

//this is for add user into the counter
const forAddUserInCounter = async (req, res) => {
  const id = req.params.counterid.trim();

  //this is for finding counter data
  const myCounter = await Counter.findById(id);

  //this is for checkin

  //this is for destructuring
  const {
    counterUserName,
    counterUserEmail,
    counterUserPassword,
    counterUserRole,
    counterUserPhone,
    counterUserCountry,
    counterUserState,
    counterUserCity,
    counterUseraddress,
    counterUserGender,
  } = req.body;

  //this is for counter data
  let counterData = {
    id: myCounter._id,
  };

  //this is for image
  const userImage = req.file ? req.file.filename : "";

  try {
    const newCounterUser = new CounterUsers({
      counter: counterData,
      counterUserName,
      counterUserEmail,
      counterUserPassword,
      counterUserRole,
      counterUserPhone,
      counterUserCountry,
      counterUserState,
      counterUserCity,
      counterUseraddress,
      counterUserGender,
      counterUserImage: userImage,
    });
    const savedCounterUser = await newCounterUser.save();

    myCounter.users.push({
      id: savedCounterUser._id,
      name: savedCounterUser.counterUserName,
      email: savedCounterUser.counterUserEmail,
    });
    await myCounter.save();

    res.status(201).json({
      msg: "Counter User added successfully",
      savedCounterUser,
    });
  } catch (err) {
    console.log("there is error in the add counter user function", err);
    res.status(500).json({ msg: "Server error", error: err });
  }
};

//this is for get all users
const forGetCounterAllUser = async (req, res) => {
  const id = req.params.counterid;

  try {
    const allUsers = await CounterUsers.find({ "counter.id": id }).sort({
      createdAt: -1,
    });
    const updatedCounterUser = allUsers.map((user) => {
      if (user.counterUserImage) {
        user.counterUserImage = imageUrl + user.counterUserImage;
      }
      return user;
    });
    res.status(200).json(updatedCounterUser);
  } catch (err) {
    console.log("there is error in the get all users of counter function", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for get single user data for update
const getUserDataforEdit = async (req, res) => {
  const id = req.params.userid;

  try {
    const counterUser = await CounterUsers.findById(id).select({
      counterUserPassword: 0,
    });
    let userImage = counterUser.counterUserImage;
    if (userImage) {
      userImage = imageUrl + userImage;
    } else {
      userImage = "";
    }

    counterUser.counterUserImage = userImage;

    res.status(200).json({ counterUser });
  } catch (err) {
    console.log("there is error in the get counter user data for edit", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for edit counte user
const forEditCounterUser = async (req, res) => {
  const id = req.params.forupdateid;
  let counterUser = await CounterUsers.findById(id);
  let PrevPassword = counterUser.counterUserPassword;

  let {
    counterUserName,
    counterUserEmail,
    counterUserPassword,
    counterUserRole,
    counterUserPhone,
    counterUserCountry,
    counterUserState,
    counterUserCity,
    counterUseraddress,
    counterUserGender,
  } = req.body;

  if (counterUserPassword) {
    PrevPassword = counterUserPassword;
  } else {
    counterUserPassword = PrevPassword;
  }

  let updatedUser = {
    counterUserName,
    counterUserEmail,
    counterUserPassword: PrevPassword,
    counterUserRole,
    counterUserPhone,
    counterUserCountry,
    counterUserState,
    counterUserCity,
    counterUseraddress,
    counterUserGender,
  };

  if (req.file) {
    updatedUser.counterUserImage = req.file.filename;
    let existingItem = await CounterUsers.findById(id);

    let existImage = path.join(
      __dirname,
      "..",
      "CounterUserImages",
      existingItem.counterUserImage
    );

    fs.unlink(existImage, (err) => {
      if (existImage !== "") {
        console.log("image deleted Successfully");
      } else {
        console.log("image not found ", err);
      }
    });
  }

  try {
    const newUser = await CounterUsers.findByIdAndUpdate(id, updatedUser);
    res.status(200).json({ msg: "user Updated Successfully", newUser });
  } catch (err) {
    console.log("there is error in edit counter user function", err);
    res.status(500).json({ msg: "server error", err });
  }
};

//this is for counter area
const forAddCounterArea = async (req, res) => {
  const { areaName } = req.body;
  const { id } = req.params;

  const forCounter = await Counter.findById(id);
  const counterData = {
    id: forCounter._id,
  };

  try {
    const newCounterArea = new counterAreas({
      counter: counterData,
      areaName,
    });

    const savedCounterArea = await newCounterArea.save();

    forCounter.counterArea.push({
      id: savedCounterArea._id,
      name: savedCounterArea.areaName,
    });

    forCounter.save();

    res
      .status(200)
      .json({ msg: "Counter Area Added Succesfully", savedCounterArea });
  } catch (err) {
    res.status(500).json({ msg: "server Errro", err });
    console.log("there is error in the add counter area function", err);
  }
};

//this is for get all counter areas of counter
const forGetAllCounterArea = async (req, res) => {
  const { id } = req.params;
  try {
    const counterAllArea = await counterAreas.find({ "counter.id": id });
    res.status(200).json({ counterAllArea });
  } catch (err) {
    console.log("there is error inthe get data of all counter areas", err);
    res.status(500).json({ msg: "server error", err });
  }
};

//this is for get data for edit counterArea
const forEditGetDataCounterArea = async (req, res) => {
  const id = req.params.id;

  try {
    const CounterSingleArea = await counterAreas.findById(id);
    res.status(200).json({ CounterSingleArea });
  } catch (err) {
    console.log("there is error in get data of counter area for edit", err);
    res.status(500).json({ msg: "server Error", err });
  }
};

//this is for edit counteArea
const forEditCounterArea = async (req, res) => {
  const { id } = req.params;
  const prevData = await counterAreas.findById(id);
  const { areaName } = req.body;
  const newData = {
    areaName: areaName,
  };

  try {
    const updatedArea = await counterAreas.findByIdAndUpdate(id, newData, {
      new: true,
    });
    res.status(200).json({ msg: "user updated sucessfully", updatedArea });
  } catch (err) {
    console.log("there is error inthe edit counte area function", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for delete the area of the counter
const forDelteAreaOfTheCounter = async (req, res) => {
  const { id } = req.params;

  try {
    const DeletedArea = await counterAreas.findByIdAndDelete(id);
    res
      .status(200)
      .json({ msg: "counter area delete successfully", DeletedArea });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting all counter areas
const forGettingAllCounterAreas = async (req, res) => {
  try {
    const allAreas = await counterAreas.find();
    res.status(200).json({ allAreas });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting data of counter
const forGettingDataOfCounter = async (req, res) => {
  const { id } = req.params;
  try {
    const counterData = await Counter.findById(id);
    res.status(200).json({ counterData });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};
module.exports = {
  forAddUserInCounter,
  forGetCounterAllUser,
  getUserDataforEdit,
  forEditCounterUser,
  forAddCounterArea,
  forGetAllCounterArea,
  forEditGetDataCounterArea,
  forEditCounterArea,
  forDelteAreaOfTheCounter,
  forGettingAllCounterAreas,
  forGettingDataOfCounter,
};
