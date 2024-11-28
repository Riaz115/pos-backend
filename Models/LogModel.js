const mongoose = require("mongoose");

const forLogModel = mongoose.Schema(
  {
    user: {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: Number,
      },
      role: {
        type: String,
      },
    },

    model: {
      type: String,
    },

    action: {
      type: String,
    },

    logData: {
      type: Object,
    },
  },
  { timestamps: true }
);

//modeling
const logModel = mongoose.model("LogData", forLogModel);

//exporting
module.exports = logModel;
