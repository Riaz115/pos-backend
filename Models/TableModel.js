const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema(
  {
    restaurent: {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
    },

    Counter: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Counter",
      },
      name: {
        type: String,
      },
    },
    counterArea: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CounterArea",
      },
      name: {
        type: String,
      },
    },
    tableNo: {
      type: String,
      required: true,
    },

    tableType: {
      type: String,
      enum: ["dine-in", "take-away", "delivery"],
      required: true,
    },
    currentOrder: {
      id: {
        type: String,
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

      orderNo: {
        type: Number,
      },
      status: {
        type: String,
        enum: ["running", "completed", "empty", "invoiced"],
        default: "empty",
      },
      discountType: {
        type: String,
      },
      guest: {
        id: {
          type: String,
        },
        name: {
          type: String,
        },
        isNoCharge: {
          type: String,
        },
        noChargeReason: {
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
      credit: {
        type: Number,
      },
      discountAmount: {
        type: Number,
      },
      discount: {
        type: Number,
      },
      isServiceCharges: {
        type: String,
      },
      isGstTex: {
        type: String,
      },
      serviceCharges: {
        type: Number,
      },
      deliveryCharges: {
        type: Number,
      },
      gstTex: {
        type: Number,
      },
      foodAmount: {
        type: Number,
      },

      parcel: {
        type: Number,
      },

      subTotal: {
        type: Number,
        default: 0,
      },
      paidAmount: {
        type: Number,
      },
      remainAmount: {
        type: Number,
      },
      totalAmount: {
        type: Number,
        default: 0,
      },

      paymentMethod: [
        {
          payMethod: {
            type: String,
          },
          amount: {
            type: Number,
          },
          payDetail: {
            type: String,
          },
        },
      ],
      orderType: {
        type: String,
      },

      date: {
        type: Date,
        default: Date.now(),
      },
    },

    isNoCharge: {
      type: String,
    },
    noChargeReason: {
      type: String,
    },

    orders: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
      },
    ],
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

// Modeling
const TableModel = mongoose.model("Table", TableSchema);

// Exporting
module.exports = TableModel;
