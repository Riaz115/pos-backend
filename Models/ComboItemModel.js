// // models/Combo.js
// const mongoose = require("mongoose");

// const comboSchema = new mongoose.Schema(
//   {
//     restaurent: {
//       id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Restaurant",
//         required: true,
//       },
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     items: [
//       {
//         id: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "MenuItem",
//           required: true,
//         },
//         name: {
//           type: String,
//           required: true,
//         },
//         qty: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],
//     price: {
//       type: Number,
//       required: true,
//     },
//     desc: {
//       type: String,
//       required: true,
//     },

//     image: {
//       type: String,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// const comboModel = mongoose.model("Combo", comboSchema);

// module.exports = comboModel;

const mongoose = require("mongoose");

const comboSchema = new mongoose.Schema(
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
    items: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Avoid overwriting the model if it's already defined
const comboModel =
  mongoose.models.Combo || mongoose.model("Combo", comboSchema);

module.exports = comboModel;
