const MyAllUsers = require("../Models/UserModel");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const Restaurant = require("../Models/RestaurentModel");

//this is for imageUrl
const imageUrl = "http://localhost:8000/images";

//this is for the home section
const Home = (req, res) => {
  res.send("i am home section");
};

//this is for get all owner users
const forGetAllOwnerUsers = async (req, res) => {
  try {
    const allUser = await MyAllUsers.find().sort({ createdAt: -1 });

    const ownerUsers = allUser.map((user) => {
      let myImage = user.image;
      if (myImage !== "") {
        myImage = `${imageUrl}/${user.image}`;
      } else {
        myImage = "";
      }

      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        image: myImage,
      };
    });

    res.status(200).json({ ownerUsers });
  } catch (err) {
    console.log("there is error in get all owner user function");
    res.status(500).json({ msg: "server error" });
  }
};

//this is for adding user
const AddOwnerUser = async (req, res) => {
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
  } = req.body;
  const image = req.file ? req.file.filename : "";

  try {
    const userExist = await MyAllUsers.findOne({ email });
    if (userExist) {
      res.status(401).json({ msg: "Email Already Exist" });
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
        image: image,
      });

      res.status(201).json({
        msg: "User Created Successfully",
        createdUser,
        token: createdUser.forGenToken(),
      });
    }
  } catch (err) {
    console.log("there is error in add user function", err);
    res.status(500).json({ msg: "server error" });
  }
};

//this is for the LOgin
const forLoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userData = await MyAllUsers.findOne({
      email,
    });

    if (!userData) {
      res.status(401).json({ msg: "Email Not Exist" });
    } else {
      const isMatch = await bcrypt.compare(password, userData.password);
      if (!isMatch) {
        res.status(401).json({ msg: "incorrect password" });
      } else {
        res.status(200).json({
          msg: "Login Successfully",
          token: userData.forGenToken(),
        });
      }
    }
  } catch (err) {
    console.log("there is error in the login function", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for get owner user data
const getForOwnerUserData = async (req, res) => {
  const id = req.params.id;

  try {
    const myUser = await MyAllUsers.findById(id);
    let userImage = myUser.image;
    if (userImage !== "") {
      userImage = `${imageUrl}/${myUser.image}`;
    } else {
      userImage = "";
    }

    const userData = {
      id: myUser._id,
      name: myUser.name,
      email: myUser.email,
      phone: myUser.phone,
      gender: myUser.gender,
      myCountry: myUser.myCountry,
      state: myUser.state,
      city: myUser.city,
      address: myUser.address,
      image: userImage,
    };

    res.status(200).json({ userData });
  } catch (err) {
    console.log("there is error in get user data function ", err);
    res.state(500).json({ msg: "Server Error" });
  }
};

//this is for eidt owner user
const forEditOwnerUser = async (req, res) => {
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
  } = req.body;

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
  };

  if (req.file) {
    updatedUser.image = req.file.filename;
    console.log(updatedUser.image, "check");
    const existingItem = await MyAllUsers.findById(id);

    const existImage = path.join(
      __dirname,
      "..",
      "UserImages",
      existingItem.image
    );

    fs.unlink(existImage, (err) => {
      if (err) {
        console.log("there is error in  delete image", err);
      } else {
        if (existImage !== "") {
          console.log("image deleted successfully");
        }
      }
    });
  }

  try {
    const newUser = await MyAllUsers.findByIdAndUpdate(id, updatedUser);

    res.status(200).json({ msg: "user Updated Successfully", newUser });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
    console.log("there is error in update owner user function", err);
  }
};

//this is for delete owner user
const forDeleteOwnerUser = async (req, res) => {
  const id = req.params.id;
  try {
    const myUser = await MyAllUsers.findById(id);
    const imagePath = path.join(__dirname, "..", "UserImages", myUser.image);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.log("image not deleted", err);
      } else {
        console.log("image deleted sucessfully");
      }
    });

    const deleteItem = await MyAllUsers.findByIdAndDelete(id);

    res.status(200).json({ msg: "deleted successfully", deleteItem });
  } catch (err) {
    console.log("there is error in the delete item function ", err);
  }
};

//this is for get user data
const getUserData = async (req, res) => {
  const userData = req.user;
  let image = userData.image;

  if (image) {
    image = `${imageUrl}/${userData.image}`;
  } else {
    image = "";
  }

  try {
    res.status(201).json({ userData: userData, image: image });
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
