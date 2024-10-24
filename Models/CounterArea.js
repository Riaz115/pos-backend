const mongoose = require("mongoose");

const CounterAreaSchema = mongoose.Schema(
  {
    counter: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Counter",
        required: true,
      },
      name: { type: String, required: true },
    },
    areaName: {
      type: String,
      required: true,
    },

    tables: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Table" },
        name: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

//creating models
const CounterArea = mongoose.model("CounterArea", CounterAreaSchema);

//exporting
module.exports = CounterArea;
