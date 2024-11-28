// models/Combo.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const comboSchema = new mongoose.Schema(
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
    items: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },

    image: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Combo", comboSchema);
