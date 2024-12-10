const mongoose = require("mongoose");

const MenuItemSchema = mongoose.Schema(
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
    price: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },

    catagory: {
      type: String,
      required: true,
    },

    desc: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

//creating models
const restMenuItems = mongoose.model("MenuItem", MenuItemSchema);

//exporting
module.exports = restMenuItems;
