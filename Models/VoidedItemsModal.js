const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voidedItemSchema = new Schema(
  {
    restId: {
      type: String,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
    counterId: {
      type: String,
      required: true,
    },
    kotNumber: {
      type: String,
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    reason: {
      type: "String",
      required: true,
    },
  },
  { timestamps: true }
);

const VoidedItem = mongoose.model("VoidedItem", voidedItemSchema);

module.exports = VoidedItem;
