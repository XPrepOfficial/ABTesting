const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://preprod_rw_user:StrongPreprodPassword%40123@10.16.17.40:27017/speak-app?authSource=speak-app';

  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.info('[DB] MongoDB reconnected');
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.info('[DB] MongoDB connected:', mongoose.connection.host);
}

module.exports = { connectDB };
