require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const CounterUserSchema = mongoose.Schema(
  {
    restaurent: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
      },
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    myCountry: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    role: {
      type: String,
      required: true,
    },
    permissions: {
      type: [String],
      required:true
    },
    orders: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "UserOrder" },
      },
    ],
  },
  { timestamps: true }
);

//this is for generate token
CounterUserSchema.methods.forGenToken = function () {
  return jwt.sign(
    {
      email: this.email,
      userId: this._id,
    },
    process.env.JWT_SECRETE_KEY
  );
};

//this is for modeling
const CounterUser = mongoose.model("CounterUser", CounterUserSchema);

//exporting
module.exports = CounterUser;
