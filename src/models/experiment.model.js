const mongoose = require('mongoose');

const VALID_HEX = new Set('0123456789abcdef'.split(''));

const experimentSchema = new mongoose.Schema(
  {
    experimentKey: {
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
    bucketMap: {
      type: Map,
      of: String,
      required: true,
      validate: {
        validator(map) {
          for (const key of map.keys()) {
            if (!VALID_HEX.has(key)) return false;
          }
          return true;
        },
        message: 'bucketMap keys must be valid hex characters (0–f)',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experiment', experimentSchema);
