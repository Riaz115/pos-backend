const mongoose = require("mongoose");

const DayLogSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  dayStart: {
    type: Date,
    required: true,
  },
  dayClose: {
    type: Date,
    default: null,
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
});

const DayLogModel = mongoose.model("DayLog", DayLogSchema);

module.exports = DayLogModel;
