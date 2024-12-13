const mongoose = require("mongoose");

const CashBookAcountHeadSchema = mongoose.Schema(
  {
    restaurent: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
      },
    },
    AccountHead: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//creating models
const AcountHeadModel = mongoose.model(
  "RestCashbookacounthead",
  CashBookAcountHeadSchema
);

//exporting
module.exports = AcountHeadModel;
