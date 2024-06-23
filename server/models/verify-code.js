const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const schemaCleaner = require('../utils/schemaCleaner');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
      trim: true,
    },
    code: {
      type: String,
      required: false,
      trim: true,
    },
    isExpired: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);
schemaCleaner(userSchema);

module.exports = mongoose.model('verify-code', userSchema);
