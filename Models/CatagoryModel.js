const mongoose = require("mongoose");

const CatagorySchema = mongoose.Schema(
  {
    restaurent: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
      },
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },

    items: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItems" },
        name: { type: String },
      },
    ],
  },
  { timestamps: true }
);

//creating models
const restCatagories = mongoose.model("Catagory", CatagorySchema);

//exporting
module.exports = restCatagories;
