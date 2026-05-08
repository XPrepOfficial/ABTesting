const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  //console.log('uri', uri);
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
