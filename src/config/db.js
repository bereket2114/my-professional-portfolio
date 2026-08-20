const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '') {
    console.log('⚡ [Database] MONGODB_URI not provided. Operating seamlessly in Local JSON Storage mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    isConnected = true;
    console.log(`✅ [Database] MongoDB connected successfully to: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ [Database] MongoDB connection failed: ${error.message}. Falling back automatically to Local JSON Storage.`);
    isConnected = false;
    return false;
  }
}

function getIsConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

module.exports = {
  connectDB,
  getIsConnected
};
