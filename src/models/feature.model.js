const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema(
  {
    featureKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    experimentKey: {
      type: String,
      default: null,
    },
    appName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feature', featureSchema);
