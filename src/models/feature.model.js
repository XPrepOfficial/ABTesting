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
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Running', 'Success', 'Failure'],
      default: 'Running',
    },
    variant: {
      type: String,
      default: null,
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
