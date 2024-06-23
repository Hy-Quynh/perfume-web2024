const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../utils/schemaCleaner');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
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
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);
schemaCleaner(userSchema);

module.exports = mongoose.model('users', userSchema);
