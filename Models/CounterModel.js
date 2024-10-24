const mongoose = require("mongoose");

const CounterSchema = mongoose.Schema(
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
    counterName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },

    users: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "CounterUser" },
        name: { type: String },
        email: { type: String },
      },
    ],
    counterArea: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "CounterArea" },
        name: { type: String },
      },
    ],
  },
  { timestamps: true }
);

//creating models
const restCounters = mongoose.model("Counter", CounterSchema);

//exporting
module.exports = restCounters;
