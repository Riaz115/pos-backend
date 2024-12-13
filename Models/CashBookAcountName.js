const mongoose = require("mongoose");

const CashBookAcountNameSchema = mongoose.Schema(
  {
    restaurent: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
      },
    },
    AccountName: {
      type: String,
      required: true,
    },
    AccountNameHead: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//creating models
const AccountNameModel = mongoose.model(
  "RestCashbookacountname",
  CashBookAcountNameSchema
);

//exporting
module.exports = AccountNameModel;
