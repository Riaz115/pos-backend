require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
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
    restaurants: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
        name: { type: String },
        email: { type: String },
      },
    ],
  },
  { timestamps: true }
);

//this is for generate token
UserSchema.methods.forGenToken = function () {
  return jwt.sign(
    {
      email: this.email,
      userId: this._id,
    },
    process.env.JWT_SECRETE_KEY
  );
};

//creating models
const MyUsers = mongoose.model("User", UserSchema);

//exporting
module.exports = MyUsers;
