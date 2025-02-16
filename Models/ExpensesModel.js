const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  restaurant: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurent",
    },
  },
  counterid: { type: String },
  dayId: { type: mongoose.Schema.Types.ObjectId, ref: "DayOfRestaurent" },
  amount: { type: Number, required: true },
  exprensType: { type: String, enum: ["paid", "received"], required: true },
  accountName: { type: String, required: true },
  headAcount: { type: String, required: true },
  description: { type: String },
  paymentType: { type: String, required: true },
  createdBy: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  votureNo: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AllExpensesOfRestaurent", expenseSchema);
