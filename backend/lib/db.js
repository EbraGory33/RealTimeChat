const mongoose = require('mongoose');

/**
 * Connects to MongoDB using Mongoose with retry logic.
 *
 * @param {string} uri - The MongoDB connection string (default from environment variable).
 * @param {Object} options - Optional Mongoose connection options.
 * @param {number} retries - Number of retry attempts if connection fails.
 *
 * @returns {Promise<void>} Resolves when connection is successful or process exits on failure.
 */
const connectDB = async (uri = process.env.MONGO_URI, options = {}, retries = 5) => {
  while (retries) {
    try {
      const conn = await mongoose.connect(uri, options)
      console.log(`MongoDB connected: ${process.env.NODE_ENV} mode — ${conn.connection.host}`);
      break;

    } catch (error) {
      retries -= 1;
      console.error(`MongoDB connection error: ${error} - Retries left: ${retries}`);
      if (!retries) process.exit(1);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

module.exports = { connectDB };
