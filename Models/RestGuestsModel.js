const mongoose = require("mongoose");
const RestGuestSchema = mongoose.Schema(
  {
    restaurent: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true,
      },
    },

    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: Number,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },

    totalCredit: {
      type: Number,
      default: 0,
    },

    guestCreditPaidAmounts: [
      {
        givenAmount: {
          type: Number,
        },

        amountUseData: [
          {
            orderid: {
              type: String,
            },
            orderNo: {
              type: String,
            },

            paidCreditAmount: {
              type: Number,
            },

            remainCreditAmount: {
              type: Number,
            },
          },
        ],
        paymentType: {
          type: String,
        },
        amountGivenDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    creditOrdersDetail: [
      {
        orderid: {
          type: String,
        },
        orderNo: {
          type: String,
        },

        totalAmount: {
          type: Number,
        },
        paidAmount: {
          type: Number,
        },
        creditAmount: {
          type: Number,
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
        orderDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

//this is for modeling
const Guests = mongoose.model("Guest", RestGuestSchema);

//exporting
module.exports = Guests;
