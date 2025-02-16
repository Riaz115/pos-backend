//importing
const CounterUsers = require("../Models/CounterUsers");
const Counter = require("../Models/CounterModel");
const counterAreas = require("../Models/CounterArea");
const allRestaurents = require("../Models/RestaurentModel");
const MyAllUsers = require("../Models/UserModel");
const allRoles = require("../Models/RoleModel");
const bcrypt = require("bcryptjs");
const { deleteFromCloudinary } = require("../MiddleWares/upload");

//this is for add user into the counter
const forAddUserInCounter = async (req, res) => {
  try {
    const { id } = req.params;
    const myRestData = await allRestaurents.findById(id);
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
    let restData = {
      id: myRestData?._id,
    };

    //this is for image
    const userImage = req?.file ? req?.file?.url : "";

    const userExist = await MyAllUsers.findOne({ email: counterUserEmail });
    const userNewExist = await CounterUsers.findOne({
      email: counterUserEmail,
    });

    if (userExist || userNewExist) {
      if (req?.file?.publicId) {
        await deleteFromCloudinary(req?.file?.url);
      }
      return res.status(401).json({ msg: "Email Already Exist" });
    } else {
      const salt = 10;
      const hashPassword = await bcrypt.hash(counterUserPassword, salt);

      const userRole = await allRoles.findById(counterUserRole);

      if (!userRole) {
        if (req?.file?.publicId) {
          await deleteFromCloudinary(req?.file?.url);
        }
        return res.status(404).json({ msg: "Role not found" });
      }

      const newCounterUser = new CounterUsers({
        restaurent: restData,
        name: counterUserName,
        email: counterUserEmail,
        password: hashPassword,
        role: counterUserRole,
        phone: counterUserPhone,
        myCountry: counterUserCountry,
        state: counterUserState,
        city: counterUserCity,
        address: counterUseraddress,
        gender: counterUserGender,
        image: userImage,
        permissions: userRole?.permissions || [],
      });
      const savedCounterUser = await newCounterUser.save();

      res.status(201).json({
        msg: "Counter User added successfully",
        savedCounterUser,
      });
    }
  } catch (err) {
    if (req?.file?.publicId) {
      await deleteFromCloudinary(req?.file?.url);
    }
    console.log("error", err);
    res.status(500).json({ msg: "Server error", error: err });
  }
};

//this is for get all users
const forGetCounterAllUser = async (req, res) => {
  const id = req.params.counterid;

  try {
    const updatedCounterUser = await CounterUsers.find({
      "restaurent.id": id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(updatedCounterUser);
  } catch (err) {
    console.log("there is error in the get all users of counter function", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for get single user data for update
const getUserDataforEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const counterUser = await CounterUsers.findById(id).select({
      counterUserPassword: 0,
    });

    res.status(200).json({ counterUser });
  } catch (err) {
    console.log("there is error in the get counter user data for edit", err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for edit counte user
const forEditCounterUser = async (req, res) => {
  try {
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
      oldImageUrl,
    } = req.body;

    if (counterUserPassword) {
      PrevPassword = counterUserPassword;
    } else {
      counterUserPassword = PrevPassword;
    }

    const userRole = await allRoles.findById(counterUserRole);

    if (!userRole) {
      if (req?.file?.publicId) {
        await deleteFromCloudinary(req?.file?.url);
      }
      return res.status(404).json({ msg: "Role not found" });
    }

    //this is for image
    const image = req?.file ? req?.file?.url : oldImageUrl;

    const userExist = await MyAllUsers.findOne({
      email: counterUserEmail,
      _id: { $ne: id },
    });
    const userNewExist = await CounterUsers.findOne({
      email: counterUserEmail,
      _id: { $ne: id },
    });

    if (userExist || userNewExist) {
      if (req?.file?.publicId) {
        await deleteFromCloudinary(req?.file?.url);
      }
      return res.status(401).json({ msg: "Email Already Exists" });
    }

    let updatedUser = {
      name: counterUserName,
      email: counterUserEmail,
      password: PrevPassword,
      role: counterUserRole,
      phone: counterUserPhone,
      myCountry: counterUserCountry,
      state: counterUserState,
      city: counterUserCity,
      address: counterUseraddress,
      gender: counterUserGender,
      image: image,
      permissions: userRole?.permissions || [],
    };

    const newUser = await CounterUsers.findByIdAndUpdate(id, updatedUser);
    res.status(200).json({ msg: "user Updated Successfully", newUser });
  } catch (err) {
    if (req?.file?.publicId) {
      await deleteFromCloudinary(req?.file?.url);
    }
    console.log("there is error in edit counter user function", err);
    res.status(500).json({ msg: "server error", err });
  }
};

//this is for delete the restaurent user
const forDeleteTheRestaurentUser = async (req, res) => {
  try {
    const { id } = req.params;
    const myUser = await CounterUsers.findById(id);
    if (!myUser) {
      return res.status(400).json({ msg: "User Not Found" });
    } else {
      if (myUser?.image) {
        await deleteFromCloudinary(myUser?.image);
      }

      const deleteItem = await CounterUsers.findByIdAndDelete(id);

      res.status(200).json({ msg: "User deleted successfully", deleteItem });
    }
  } catch (err) {
    console.log("err delete error", err);
    res.status(500).json({ msg: "Server error", err });
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
  forDeleteTheRestaurentUser,
};
