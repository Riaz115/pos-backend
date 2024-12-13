const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    restaurent: {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
    },

    counter: {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
    },

    counterArea: {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
    },

    table: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Table",
        required: true,
      },
      name: {
        type: String,
      },
    },

    id: {
      type: String,
    },
    invoiceNo: {
      type: Number,
    },
    persons: {
      type: Number,
    },
    kots: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "KOT",
      },
    ],
    status: {
      type: String,
      enum: ["running", "completed", "empty", "invoiced"],
    },
    orderTaker: {
      type: String,
    },
    discountType: {
      type: String,
    },
    foodAmount: {
      type: Number,
    },
    credit: {
      type: Number,
    },
    guest: {
      name: {
        type: String,
      },
      phone: {
        type: Number,
      },
      email: {
        type: String,
      },
      address: {
        type: String,
      },
      gender: {
        type: String,
      },
      age: {
        type: Number,
      },
      credit: {
        type: Number,
      },
    },

    discount: {
      type: Number,
    },

    dayId: { type: mongoose.Schema.Types.ObjectId, ref: "DayOfRestaurent" },

    serviceCharges: {
      type: Number,
    },
    deliveryCharges: {
      type: Number,
    },
    gstTex: {
      type: Number,
    },

    parcel: {
      type: Number,
    },

    subTotal: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    isServiceCharges: {
      type: String,
    },
    isGstTex: {
      type: String,
    },

    paymentMethod: {
      type: String,
    },
    isNoCharge: {
      type: String,
    },
    noChargeReason: {
      type: String,
    },
    orderType: {
      type: String,
    },
    deliveryCharges: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

// Modeling
const OrderModel = mongoose.model("Order", OrderSchema);

// Exporting
module.exports = OrderModel;
