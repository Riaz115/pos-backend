const mongoose = require("mongoose");

const TablesModel = mongoose.Schema(
  {
    CounterArea: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CounterArea",
        required: true,
      },
      name: { type: String, required: true },
    },
    tableNo: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    orders: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        name: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

//creating models
const TableModel = mongoose.model("Table", TablesModel);
//exporting
module.exports = TableModel;
