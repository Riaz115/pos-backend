const mongoose = require("mongoose");

const stockItemsSchema = mongoose.Schema(
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
    stock: {
      type: Number,
    },
    alertQty: {
      type: Number,
      required: true,
    },
    qtyType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//modeling
const StockItems = mongoose.model("StockItem", stockItemsSchema);

//exporting
module.exports = StockItems;
