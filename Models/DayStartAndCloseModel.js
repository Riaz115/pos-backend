const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
  restaurant: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurent",
    },
    name: {
      type: String,
    },
  },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date },
  openingAmount: { type: Number, required: true },
  totalSales: { type: Number, default: 0 },
  cashPayments: { type: Number, default: 0 },
  cardPayments: { type: Number, default: 0 },
  creditPayments: { type: Number, default: 0 },
  noChargeAmount: { type: Number, default: 0 },
  discounts: { type: Number, default: 0 },
  parcelCharges: { type: Number, default: 0 },
  expenses: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AllExpensesOfRestaurent",
      },
      votureNo: { type: Number },
      createdBy: {
        id: {
          type: String,
        },
        name: {
          type: String,
        },
      },
      amount: { type: Number },
      exprensType: { type: String, enum: ["paid", "received"] },
      accountName: { type: String },
      headAcount: { type: String },
      description: { type: String },
      paymentType: { type: String },
      dateAndTime: { type: Date, default: Date.now },
    },
  ],
  creditGiven: { type: Number, default: 0 },
  recoveredCredit: [
    { amount: { type: Number }, paymentMeth: { type: String } },
  ],
  creditRecovered: { type: Number, default: 0 },
  isClosed: { type: Boolean, default: false },
});

module.exports = mongoose.model("DayOfRestaurent", daySchema);
