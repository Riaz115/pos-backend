const mongoose = require("mongoose");
const CounterUserSchema = mongoose.Schema(
  {
    counter: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Counter",
        required: true,
      },
    },
    counterUserName: {
      type: String,
      required: true,
    },
    counterUserEmail: {
      type: String,
      unique: true,
      required: true,
    },
    counterUserPassword: {
      type: String,
      required: true,
    },

    counterUserImage: {
      type: String,
    },
    counterUserPhone: {
      type: String,
      required: true,
    },
    counterUserCountry: {
      type: String,
      required: true,
    },
    counterUserState: {
      type: String,
      required: true,
    },
    counterUserCity: {
      type: String,
      required: true,
    },
    counterUseraddress: {
      type: String,
      required: true,
    },
    counterUserGender: {
      type: String,
      required: true,
    },
    counterUserRole: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    orders: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "UserOrder" },
      },
    ],
  },
  { timestamps: true }
);

//this is for modeling
const CounterUser = mongoose.model("CounterUser", CounterUserSchema);

//exporting
module.exports = CounterUser;
