const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../utils/schemaCleaner');

const checkoutSchema = new mongoose.Schema(
  {
    totalQuantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      trim: true,
    },
    paymentId: {
      type: String,
      required: false,
      default: ''
    },
    productInfo: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      productName: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
      },
      salePrice: {
        type: Number,
        required: true,
      },
      orderPrice: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      }
    }],
    userInfo: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      userName: {
        type: String,
        required: true,
        trim: true,
      },
      userEmail: {
        type: String,
        required: true,
        trim: true,
      },
      userAddress: {
        type: String,
        required: true,
        trim: true,
      },
    },
    deliveryStatus: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      required: false,
      default: true,
    },
    isDelete: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

checkoutSchema.plugin(uniqueValidator);
schemaCleaner(checkoutSchema);

module.exports = mongoose.model('checkouts', checkoutSchema);
