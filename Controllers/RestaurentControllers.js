const path = require("path");
const fs = require("fs");
const Restaurant = require("../Models/RestaurentModel");
const Counter = require("../Models/CounterModel");
const Guests = require("../Models/RestGuestsModel");
const Orders = require("../Models/OrderSchema");
const dayCloseAndOpenModal = require("../Models/DayStartAndCloseModel");

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
    typeOfServiceCharges,
    serviceChargesAmount,
    typeOfDeliveryCharges,
    deliveryChargesAmount,
    gstTexType,
    gstTexAmount,
  } = req.body;

  //this is for image
  const restImage = req.file ? req.file.filename : "";

  const { _id, name, email } = req.user;
  const OwnerData = {
    id: _id,
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
      typeOfServiceCharges,
      serviceChargesAmount,
      typeOfDeliveryCharges,
      deliveryChargesAmount,
      gstTexType,
      gstTexAmount,
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
  const { id } = req.params;

  try {
    const myRest = await Restaurant.findById(id);
    let restLogo = myRest.restLogo;
    if (restLogo !== "") {
      myRest.restLogo = `${imageUrl}/${myRest.restLogo}`;
      restLogo = `${imageUrl}/${myRest.restLogo}`;
    } else {
      restLogo = "";
      myRest.restLogo = "";
    }

    res.status(200).json({ myRest, restLogo: restLogo });
  } catch (err) {
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
    typeOfServiceCharges,
    serviceChargesAmount,
    typeOfDeliveryCharges,
    deliveryChargesAmount,
    gstTexType,
    gstTexAmount,
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
    typeOfServiceCharges,
    serviceChargesAmount,
    typeOfDeliveryCharges,
    deliveryChargesAmount,
    gstTexType,
    gstTexAmount,
  };

  if (req.file) {
    updatedRest.restLogo = req.file.filename;
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

//this is for add restaurent guests
const addRestGuest = async (req, res) => {
  try {
    const id = req.params.id;

    const { name, email, phone, dateOfBirth, gender, address } = req.body;
    const myRestaurent = await Restaurant.findById(id);

    //this is for checking if email already exists
    const isEmailExists = await Guests.findOne({ email });
    if (isEmailExists) {
      res.status(400).json({ msg: "Email Already exists" });
    } else {
      let restaurent = {
        id: myRestaurent._id,
      };

      const newGuest = new Guests({
        restaurent: restaurent,
        name,
        email,
        phone,
        dateOfBirth,
        address,
        gender,
      });

      const savedGuest = await newGuest.save();

      myRestaurent.guests.push({
        id: savedGuest._id,
        name: savedGuest.name,
      });

      await myRestaurent.save();
      res
        .status(201)
        .json({ msg: "Guest Added Successfully", counter: savedGuest });
    }
  } catch (err) {
    console.log("there is error in add counter function", err);
    res.status(500).json({ msg: "server error ", err });
  }
};

//this is for getting all guest of the restaurent
const forGetAllGuest = async (req, res) => {
  const id = req.params.id.trim();

  try {
    const guests = await Guests.find({
      "restaurent.id": id,
    });

    res.status(200).json({ guests });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for get data of guest for edit
const forGetDataGuestForEdit = async (req, res) => {
  const id = req.params.id.trim();

  try {
    const guestPrevData = await Guests.findById(id);
    res.status(200).json({ guestPrevData });
  } catch (err) {
    res.status(500).json({ msg: "server error ", err });
  }
};

//this is for edit the guest of restaurent
const forEditGuest = async (req, res) => {
  const id = req.params.id;
  const { name, email, dateOfBirth, phone, address, gender } = req.body;

  try {
    const guestData = {
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
    };
    const newGuest = await Guests.findByIdAndUpdate(id, guestData);
    res.status(200).json({ msg: "counter updated succesfully", newGuest });
  } catch (err) {
    console.log("there is error in the update user function", err);
    res.status(500).json({ msg: "server 0error ", err });
  }
};

//this is for getting guest all credit order
const forGettingGuestAllCreditOrders = async (req, res) => {
  const { id } = req.params;

  try {
    const gusetOrderData = await Guests.findById(id);
    const allCreditOrders = gusetOrderData.creditOrdersDetail
      .filter((order) => order.creditAmount > 0)
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    res.status(200).json({ allCreditOrders, gusetOrderData });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for getting guest credit data with the invoice
const forGettingGuestCreditSingleOrderData = async (req, res) => {
  const { orderid, guestid } = req.params;
  try {
    const guestData = await Guests.findById(guestid);
    const orderData = guestData.creditOrdersDetail?.find(
      (item) => item.orderid.toString() === orderid.toString()
    );

    res.status(200).json({ guestData, orderData });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for pay total credit of the single invoice of guest
const forPayGuestSingleCreditOrder = async (req, res) => {
  const { orderid, guestid, dayid } = req.params;
  const { amount, paymentMethod, detail } = req.body;
  const guestData = await Guests.findById(guestid);
  const orderData = await Orders.findById(orderid);
  const runningDay = await dayCloseAndOpenModal.findById(dayid);

  try {
    const invoiceData = guestData.creditOrdersDetail.find(
      (item) => item.orderid === orderid
    );

    // Add record to guestCreditPaidAmounts
    const creditPaidRecord = {
      givenAmount:
        invoiceData.creditAmount > parseFloat(amount)
          ? parseFloat(amount)
          : invoiceData.creditAmount,
      amountUseData: [],
      paymentType: paymentMethod,
    };

    // Add details of the current payment to amountUseData
    creditPaidRecord.amountUseData.push({
      orderid: invoiceData.orderid,
      orderNo: invoiceData.orderNo,
      paidCreditAmount:
        invoiceData.creditAmount > parseFloat(amount)
          ? parseFloat(amount)
          : invoiceData.creditAmount,
      remainCreditAmount:
        invoiceData.creditAmount > parseFloat(amount)
          ? 0
          : invoiceData.creditAmount,
    });

    //this is for add payment method
    invoiceData?.paymentMethod.push({
      payMethod: paymentMethod,
      amount:
        invoiceData?.creditAmount > parseFloat(amount)
          ? parseFloat(amount)
          : invoiceData?.creditAmount,
      payDetail: detail,
    });

    //this is for add to running day recoveredCredit
    runningDay.recoveredCredit.push({
      amount:
        invoiceData?.creditAmount > parseFloat(amount)
          ? parseFloat(amount)
          : invoiceData?.creditAmount,
      paymentMeth: paymentMethod,
    });

    //this is for add credit recover to running day
    runningDay.creditRecovered =
      invoiceData.creditAmount > parseFloat(amount)
        ? runningDay.creditRecovered + parseFloat(amount)
        : runningDay.creditRecovered + invoiceData.creditAmount;

    //this is for minus from guest total amount
    if (invoiceData?.creditAmount > 0) {
      if (invoiceData?.creditAmount > amount) {
        guestData.totalCredit =
          (guestData?.totalCredit || 0) - parseFloat(amount);
        invoiceData.paidAmount =
          (invoiceData?.paidAmount || 0) + parseFloat(amount);

        if (orderData && orderData.guest) {
          orderData.guest.credit =
            (orderData?.guest?.credit || 0) - parseFloat(amount);
          orderData.credit = (orderData?.credit || 0) - parseFloat(amount);
        }
      } else {
        guestData.totalCredit =
          (guestData?.totalCredit || 0) - invoiceData?.creditAmount;
        invoiceData.paidAmount =
          (invoiceData?.paidAmount || 0) + invoiceData?.creditAmount;

        if (orderData && orderData.guest) {
          orderData.guest.credit =
            (orderData?.guest?.credit || 0) - invoiceData?.creditAmount;
        }

        if (orderData) {
          orderData.credit =
            (orderData?.credit || 0) - invoiceData?.creditAmount;
        }
      }
    }

    //this is for minus from order credit amount
    invoiceData.creditAmount =
      (invoiceData?.creditAmount || 0) - parseFloat(amount);

    //this is for making zero of credit
    if (invoiceData?.creditAmount < 0) {
      invoiceData.creditAmount = 0;

      if (orderData && orderData.guest) {
        orderData.guest.credit = 0;
      }
      if (orderData) {
        orderData.credit = 0;
      }
      invoiceData.orderDate = Date.now();
    }

    // Push the record to guestCreditPaidAmounts
    guestData.guestCreditPaidAmounts.push(creditPaidRecord);

    await guestData.save();
    await runningDay.save();

    console.log("day", runningDay.creditRecovered);

    if (orderData) {
      await orderData.save();
    }

    res.status(200).json({ invoiceData, guestData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error", err });
  }
};

//this is for delete the guest
const forDeleteGuest = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteItem = await Guests.findByIdAndDelete(id);

    res.status(200).json({ msg: "deleted successfully", deleteItem });
  } catch (err) {
    console.log("there is error in the delete item function ", err);
  }
};

//this is for delete restaurent
const forDeleteRestaurent = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteItem = await Restaurant.findByIdAndDelete(id);
    res
      .status(200)
      .json({ msg: " restaurent deleted successfully", deleteItem });
  } catch (err) {
    console.log("err", err);
    console.log("there is error in the delete rest function ", err);
  }
};

//this is for delete counter
const forDeleteCounter = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteItem = await Counter.findByIdAndDelete(id);
    res.status(200).json({ msg: " counter deleted successfully", deleteItem });
  } catch (err) {
    console.log("err", err);
    console.log("there is error in the delete rest function ", err);
  }
};

//this is for pay multiple invoices order data
const forPayGuestAllCreditOrders = async (req, res) => {
  const { guestid, dayid } = req.params;
  const { amount, paymentMethod, detail } = req.body;
  const runningDay = await dayCloseAndOpenModal.findById(dayid);
  const guestData = await Guests.findById(guestid);

  try {
    let remainingAmount = parseFloat(amount);

    const creditPaidRecord = {
      givenAmount:
        guestData.totalCredit > parseFloat(amount)
          ? parseFloat(amount)
          : guestData.totalCredit,
      amountUseData: [],
      paymentType: paymentMethod,
    };

    //this is for add credit recover to running day
    runningDay.creditRecovered =
      guestData.totalCredit > parseFloat(amount)
        ? runningDay.creditRecovered + parseFloat(amount)
        : runningDay.creditRecovered + guestData.totalCredit;

    //this is for add to the recover credit array
    runningDay.recoveredCredit.push({
      amount:
        guestData.totalCredit > parseFloat(amount)
          ? parseFloat(amount)
          : guestData.totalCredit,
      paymentMeth: paymentMethod,
    });

    // Sort credit orders by orderDate (oldest first)
    const sortedOrders = guestData.creditOrdersDetail.sort(
      (a, b) => new Date(a.orderDate) - new Date(b.orderDate)
    );

    for (const order of sortedOrders) {
      if (remainingAmount <= 0) break;
      const creditAmount = order.creditAmount || 0;

      if (creditAmount > 0) {
        //this is function jo chooti amount returna krta hai
        const payAmount = Math.min(creditAmount, remainingAmount);

        // Add payment method details to this order
        order.paymentMethod.push({
          payMethod: paymentMethod,
          amount: payAmount,
          payDetail: detail,
        });

        order.orderDate = Date.now();

        order.creditAmount -= payAmount;
        order.paidAmount += payAmount;
        guestData.totalCredit -= payAmount;
        remainingAmount -= payAmount;

        // Add record to amountUseData
        creditPaidRecord.amountUseData.push({
          orderid: order.orderid,
          orderNo: order.orderNo,
          paidCreditAmount: payAmount,
          remainCreditAmount: order.creditAmount,
        });

        // If credit amount is fully settled, set it to 0
        if (order.creditAmount < 0) {
          order.creditAmount = 0;
        }
      }
    }

    if (guestData?.totalCredit < 0) {
      guestData.totalCredit = 0;
    }
    guestData.guestCreditPaidAmounts.push(creditPaidRecord);
    await guestData.save();
    await runningDay.save();

    console.log("day", runningDay.creditRecovered);

    res.status(200).json({
      msg: "Payment paid successfully",
      guestData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error", err });
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
  addRestGuest,
  forGetAllGuest,
  forGetDataGuestForEdit,
  forEditGuest,
  forDeleteGuest,
  forDeleteRestaurent,
  forDeleteCounter,
  forGettingGuestAllCreditOrders,
  forPayGuestSingleCreditOrder,
  forGettingGuestCreditSingleOrderData,
  forPayGuestAllCreditOrders,
};
