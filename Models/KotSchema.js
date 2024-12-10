const mongoose = require("mongoose");

const KOTSchema = new mongoose.Schema(
  {
    restaurent: {
      id: {
        type: String,
      },
      name: {
        type: String,
      },
    },

    totalItem: {
      type: Number,
    },
    grandTotal: {
      type: Number,
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

    tableData: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tables",
      },
      name: {
        type: Number,
      },
    },

    orderType: {
      type: String,
    },

    order: {
      id: {
        type: String,
      },
    },
    number: {
      type: Number,
      required: true,
    },

    table: {
      type: Number,
    },

    kotOrderNo: {
      type: Number,
    },
    kotNo: {
      type: Number,
    },

    orderTaker: {
      type: String,
    },
    orderItems: [
      {
        id: {
          type: String,
          required: true,
        },
        items: [
          {
            name: {
              type: String,
            },
            qty: {
              type: Number,
            },
          },
        ],
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
        modifier: {
          type: [String],
          default: null,
        },
        status: {
          type: String,
          enum: ["Preparing", "Ready", "Delivered"],
          default: "Preparing",
        },
      },
    ],

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

    isDelivered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Modeling
const KOTModel = mongoose.model("KOT", KOTSchema);

// Exporting
module.exports = KOTModel;
