const path = require("path");
const fs = require("fs");
const Restaurant = require("../Models/RestaurentModel");
const Counter = require("../Models/CounterModel");

//this is for images url
const imageUrl = "http://localhost:8000/restImages/";

// this is for add restaurent
const forAddRestaurent = async (req, res) => {
  const {
    restName,
    restEmail,
    restPhone,
    myCountry,
    restState,
    restCity,
    restAddress,
    restWebsite,
    dateFormate,
    selectedTimezone,
    restCurrencySymbol,
    currencyPosition,
    precision,
    decimalSprator,
    thousandSapreater,
    orderType,
    deliveryPartner,
    defalutWaiter,
    defaultCustomer,
    defaultPaymentMethod,
    posTooltip,
    menuTooltip,
    payemtPreOrPost,
    serviceChargesType,
    deliveryChargesType,
  } = req.body;

  //this is for image
  const restImage = req.file ? req.file.filename : "";

  const { _id, name, email } = req.user;
  const OwnerData = {
    id: _id,
    name: name,
    email: email,
  };

  try {
    const newRestaurant = new Restaurant({
      owner: OwnerData,
      restName,
      restEmail,
      restLogo: restImage,
      restPhone,
      myCountry,
      restState,
      restCity,
      restAddress,
      restWebsite,
      dateFormate,
      selectedTimezone,
      restCurrencySymbol,
      currencyPosition,
      precision,
      decimalSprator,
      thousandSapreater,
      orderType,
      deliveryPartner,
      defalutWaiter,
      defaultCustomer,
      defaultPaymentMethod,
      posTooltip,
      menuTooltip,
      payemtPreOrPost,
      serviceChargesType,
      deliveryChargesType,
    });
    const savedRestaurant = await newRestaurant.save();

    req.user.restaurants.push({
      id: savedRestaurant._id,
      name: savedRestaurant.restName,
      email: savedRestaurant.restEmail,
    });
    await req.user.save();

    res.status(201).json({
      msg: "Restaurant added successfully",
      restaurant: savedRestaurant,
    });
  } catch (err) {
    console.log("there is error in the restaurent function", err);
    res.status(500).json({ msg: "Server error", error: err });
  }
};

//this is for get user all restaurents
const forGetUserAllRestaurents = async (req, res) => {
  const { id } = req.user;
  const restaurants = await Restaurant.find({
    "owner.id": id,
  });

  if (!restaurants || restaurants.length === 0) {
    return res
      .status(404)
      .json({ message: "No restaurants found for this owner." });
  }

  // Update the image URL for each restaurant
  const updatedRestaurants = restaurants.map((restaurant) => {
    if (restaurant.restLogo) {
      restaurant.restLogo = imageUrl + restaurant.restLogo;
    }
    return restaurant;
  });
  res.status(200).json(updatedRestaurants);
};

//this is for getting data of single resturent for edit
const forGetDataforEditRest = async (req, res) => {
  const id = req.params.id;

  try {
    const myRest = await Restaurant.findById(id);
    let restLogo = myRest.restLogo;
    if (restLogo !== "") {
      restLogo = `${imageUrl}/${myRest.restLogo}`;
    } else {
      restLogo = "";
    }

    res.status(200).json({ myRest, restLogo: restLogo });
  } catch (err) {
    console.log("there is error in get restaurent data function ", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

//this is for eidt resturent
const forEditResturent = async (req, res) => {
  const { id } = req.params;

  const {
    restName,
    restEmail,
    restPhone,
    myCountry,
    restState,
    restCity,
    restAddress,
    restWebsite,
    dateFormate,
    selectedTimezone,
    restCurrencySymbol,
    currencyPosition,
    precision,
    decimalSprator,
    thousandSapreater,
    orderType,
    deliveryPartner,
    defalutWaiter,
    defaultCustomer,
    defaultPaymentMethod,
    posTooltip,
    menuTooltip,
    payemtPreOrPost,
    serviceChargesType,
    deliveryChargesType,
  } = req.body;

  const updatedRest = {
    restName,
    restEmail,
    restPhone,
    myCountry,
    restState,
    restCity,
    restAddress,
    restWebsite,
    dateFormate,
    selectedTimezone,
    restCurrencySymbol,
    currencyPosition,
    precision,
    decimalSprator,
    thousandSapreater,
    orderType,
    deliveryPartner,
    defalutWaiter,
    defaultCustomer,
    defaultPaymentMethod,
    posTooltip,
    menuTooltip,
    payemtPreOrPost,
    serviceChargesType,
    deliveryChargesType,
  };

  if (req.file) {
    updatedRest.restLogo = req.file.filename;
    console.log(updatedRest.restLogo, "check");
    const existingItem = await Restaurant.findById(id);

    const existImage = path.join(
      __dirname,
      "..",
      "RestaurentImages",
      existingItem.restLogo
    );

    fs.unlink(existImage, (err) => {
      if (err) {
        console.log("there is error in  delete image", err);
      } else {
        console.log("image deleted successfully");
      }
    });
  }

  try {
    const newRest = await Restaurant.findByIdAndUpdate(id, updatedRest);

    res.status(200).json({ msg: "user Updated Successfully", newRest });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
    console.log("there is error in update owner user function", err);
  }
};
//this is for adding counter
const forAddCounter = async (req, res) => {
  const id = req.params.id;
  const { counterName } = req.body;
  const myRestaurent = await Restaurant.findById(id);

  let restaurent = {
    name: myRestaurent.restName,
    email: myRestaurent.restEmail,
    id: myRestaurent._id,
  };

  try {
    const newCounter = new Counter({
      restaurent: restaurent,
      counterName,
    });

    const savedCounter = await newCounter.save();

    myRestaurent.Counters.push({
      id: savedCounter._id,
      counterName: savedCounter.counterName,
    });

    await myRestaurent.save();

    res
      .status(201)
      .json({ msg: "Counter Added Successfully", counter: savedCounter });
  } catch (err) {
    console.log("there is error in add counter function", err);
    res.status(500).json({ msg: "server error ", err });
  }
};

//get data of counter for edit
const forEditGetCounterData = async (req, res) => {
  const id = req.params.id.trim();
  const counterPrevData = await Counter.findById(id);
  try {
    res.status(200).json({ counterPrevData });
  } catch (err) {
    console.log(
      "there is error in the get counter data for  update  function",
      err
    );
    res.status(500).json({ msg: "server error ", err });
  }
};

//this is for update counter
const forUpdateCounter = async (req, res) => {
  const id = req.params.id;
  const { counterName } = req.body;
  const counterData = {
    counterName: counterName,
  };

  try {
    const newCounter = await Counter.findByIdAndUpdate(id, counterData);
    res.status(200).json({ msg: "counter updated succesfully", newCounter });
  } catch (err) {
    console.log("there is error in the update user function", err);
    res.status(500).json({ msg: "server 0error ", err });
  }
};

//this is for get all counters of the restaurent
const forGetAllCountersOfRestaurent = async (req, res) => {
  const id = req.params.id.trim();
  const counters = await Counter.find({
    "restaurent.id": id,
  });

  res.status(200).json({ counters });
};

//this is for get data for edit counter
const getDataForEditCounter = async (req, res) => {
  const { id } = req.params;

  try {
    const counter = await Counter.findById(id);
    res.status(200).json({ counter });
  } catch (err) {
    console.log("there is error in the geting data of counter for edit ", err);
    res.status(500).json({ msg: "server error ", err });
  }
};

//exporting
module.exports = {
  forAddRestaurent,
  forEditResturent,
  forGetUserAllRestaurents,
  forAddCounter,
  forGetDataforEditRest,
  forGetAllCountersOfRestaurent,
  getDataForEditCounter,
  forUpdateCounter,
  forEditGetCounterData,
};
