const MyAllUsers = require("../Models/UserModel");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const Restaurant = require("../Models/RestaurentModel");
const restAllUsers = require("../Models/CounterUsers");
const { deleteFromCloudinary } = require("../MiddleWares/upload");

//this is for imageUrl
const imageUrl = "http://localhost:8000/images";

//this is for the home section
const Home = (req, res) => {
  res.send("i am home section");
};

//this is for get all owner users
const forGetAllOwnerUsers = async (req, res) => {
  try {
    const ownerUsers = await MyAllUsers.find()
      .sort({ createdAt: -1 })
      .select("-password");

    res.status(200).json({ ownerUsers });
  } catch (err) {
    console.log("there is error in get all owner user function", err);
    res.status(500).json({ msg: "server error" });
  }
};

//this is for adding user
const AddOwnerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      gender,
      myCountry,
      state,
      city,
      address,
      role,
    } = req.body;

    //this is for image
    const image = req?.file ? req?.file?.url : "";

    const userExist = await MyAllUsers.findOne({ email: email });
    const userNewExist = await restAllUsers.findOne({
      email: email,
    });

    if (userExist || userNewExist) {
      if (req?.file?.publicId) {
        await deleteFromCloudinary(req?.file?.url);
      }
      return res.status(401).json({ msg: "Email Already Exist" });
    } else {
      const salt = 10;
      const hashPassword = await bcrypt.hash(password, salt);
      const createdUser = await MyAllUsers.create({
        name,
        email,
        password: hashPassword,
        phone,
        gender,
        myCountry,
        state,
        city,
        address,
        role,
        image: image,
      });

      res.status(201).json({
        msg: "User Created Successfully",
        createdUser,
        token: createdUser.forGenToken(),
      });
    }
  } catch (err) {
    if (req?.file?.publicId) {
      await deleteFromCloudinary(req?.file?.url);
    }
    console.log("there is error in add user function", err);
    res.status(500).json({ msg: "server error" });
  }
};

//this is for the LOgin
const forLoginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await MyAllUsers.findOne({ email });
    const userInRest = await restAllUsers.findOne({ email });

    if (!userData && !userInRest) {
      return res.status(401).json({ msg: "Email Not Exist" });
    }

    const user = userData || userInRest;
    const hashedPassword = user?.password;

    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ msg: "Something Went Wrong" });
    }

    res.status(200).json({
      msg: "Login Successfully",
      token: user.forGenToken(),
    });
  } catch (err) {
    console.log("There is an error in the login function", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for get owner user data
const getForOwnerUserData = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await MyAllUsers.findById(id);
    res.status(200).json({ userData });
  } catch (err) {
    console.log("there is error in get user data function ", err);
    res.state(500).json({ msg: "Server Error" });
  }
};

//this is for eidt owner user
const forEditOwnerUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userPrevData = await MyAllUsers.findById(id);
    const PrevPassword = userPrevData.password;
    let newPassword = PrevPassword;

    const {
      name,
      email,
      password,
      phone,
      gender,
      myCountry,
      state,
      city,
      address,
      oldImageUrl,
      role,
    } = req.body;

    //this is for image
    const image = req?.file ? req?.file?.url : oldImageUrl;

    const userExist = await MyAllUsers.findOne({
      email: email,
      _id: { $ne: id },
    });
    const userNewExist = await restAllUsers.findOne({
      email: email,
      _id: { $ne: id },
    });

    if (userExist || userNewExist) {
      if (req?.file?.publicId) {
        await deleteFromCloudinary(req?.file?.url);
      }
      return res.status(401).json({ msg: "Email Already Exists" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      newPassword = hashedPassword;
    } else {
      newPassword = PrevPassword;
    }

    const updatedUser = {
      name: name,
      email: email,
      password: newPassword,
      phone: phone,
      gender: gender,
      myCountry: myCountry,
      state: state,
      city: city,
      address: address,
      image: image,
      role: role,
    };
    const newUser = await MyAllUsers.findByIdAndUpdate(id, updatedUser);

    res.status(200).json({ msg: "user Updated Successfully", newUser });
  } catch (err) {
    if (req?.file?.publicId) {
      await deleteFromCloudinary(req?.file?.url);
    }
    res.status(500).json({ msg: "Server Error" });
    console.log("there is error in update owner user function", err);
  }
};

//this is for delete owner user
const forDeleteOwnerUser = async (req, res) => {
  try {
    const { id } = req.params;
    const myUser = await MyAllUsers.findById(id);
    if (!myUser) {
      res.status(400).json({ msg: "User Not Found" });
    } else {
      if (myUser?.image) {
        await deleteFromCloudinary(myUser?.image);
      }
      const deleteItem = await MyAllUsers.findByIdAndDelete(id);
      res.status(200).json({ msg: "deleted successfully", deleteItem });
    }
  } catch (err) {
    console.log("there is error in the delete item function ", err);
  }
};

//this is for get user data
const getUserData = async (req, res) => {
  const userData = req.user;

  let image = userData.image;

  if (image) {
    userData.image = `${imageUrl}/${userData?.image}`;
  } else {
    userData.image = "";
  }

  try {
    res.status(200).json({ userData: userData, image: image });
  } catch (err) {
    console.log(
      "there is error in the get user data function in controller file",
      err
    );
  }
};

//exporting
module.exports = {
  Home,
  AddOwnerUser,
  forGetAllOwnerUsers,
  forEditOwnerUser,
  forDeleteOwnerUser,
  getForOwnerUserData,
  getUserData,
  forLoginUser,
};
