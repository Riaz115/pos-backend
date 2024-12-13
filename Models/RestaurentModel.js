const mongoose = require("mongoose");

// Restaurant Schema
const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    restName: { type: String, required: true },
    restEmail: { type: String, required: true },
    restLogo: { type: String },
    restPhone: { type: Number, required: true },
    myCountry: { type: String, required: true },
    restState: { type: String, required: true },
    restCity: { type: String, required: true },
    restAddress: { type: String, required: true },
    restWebsite: { type: String },
    dateFormate: { type: String, required: true },
    selectedTimezone: { type: String, required: true },
    restCurrencySymbol: { type: String, required: true },
    currencyPosition: { type: String, required: true },
    precision: { type: String, required: true },
    decimalSprator: { type: String, required: true },
    thousandSapreater: { type: String, required: true },
    orderType: { type: String, required: true },
    deliveryPartner: { type: String, required: true },
    defalutWaiter: { type: String, required: true },
    defaultCustomer: { type: String, required: true },
    defaultPaymentMethod: { type: String, required: true },
    posTooltip: { type: String, required: true },
    menuTooltip: { type: String, required: true },
    payemtPreOrPost: { type: String, required: true },
    typeOfServiceCharges: { type: String, required: true },
    serviceChargesAmount: { type: Number, required: true },
    typeOfDeliveryCharges: { type: String, required: true },
    deliveryChargesAmount: { type: Number, required: true },
    gstTexType: { type: String, required: true },
    gstTexAmount: { type: Number, required: true },

    date: {
      type: Date,
      default: Date.now(),
    },
    Counters: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Counter" },
      },
    ],
    guests: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Guest" },
      },
    ],
    catagories: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Catagory" },
      },
    ],
    MenuItems: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
      },
    ],

    items: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      },
    ],
    deals: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Combo" },
      },
    ],

    cashBookAcountHead: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RestCashbookacounthead",
        },
      },
    ],
    cashBookAcountName: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "RestCashbookacountname",
        },
      },
    ],
    stockCatagories: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "StockCatagory" },
      },
    ],
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
