require('dotenv').config();

const mongoose = require('mongoose');
const Experiment = require('../src/models/experiment.model');

// 50/50 split: 0–7 → "A", 8–f → "Control"
const E1 = {
  experimentKey: 'E1',
  enabled: true,
  bucketMap: {
    '0': 'A',
    '1': 'A',
    '2': 'A',
    '3': 'A',
    '4': 'A',
    '5': 'A',
    '6': 'A',
    '7': 'A',
    '8': 'Control',
    '9': 'Control',
    'a': 'Control',
    'b': 'Control',
    'c': 'Control',
    'd': 'Control',
    'e': 'Control',
    'f': 'Control',
  },
};

// 25% B, 75% Control
const E2 = {
  experimentKey: 'E2',
  enabled: true,
  bucketMap: {
    '0': 'B',
    '1': 'B',
    '2': 'B',
    '3': 'B',
    '4': 'Control',
    '5': 'Control',
    '6': 'Control',
    '7': 'Control',
    '8': 'Control',
    '9': 'Control',
    'a': 'Control',
    'b': 'Control',
    'c': 'Control',
    'd': 'Control',
    'e': 'Control',
    'f': 'Control',
  },
};

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ab_testing';
  await mongoose.connect(uri);

  for (const data of [E1, E2]) {
    await Experiment.findOneAndUpdate(
      { experimentKey: data.experimentKey },
      data,
      { upsert: true, new: true, runValidators: true }
    );
    console.info(`Seeded experiment: ${data.experimentKey}`);
  }

  await mongoose.disconnect();
  console.info('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
