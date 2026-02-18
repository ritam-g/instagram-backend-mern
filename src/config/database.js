/**
 * ============================================================
 *  DATABASE.JS — MongoDB Connection Configuration
 * ============================================================
 *
 *  Responsible for establishing the connection between
 *  the application and the MongoDB database using Mongoose.
 *
 *  HOW IT WORKS:
 *    - Reads the MongoDB connection string from `process.env.MONGO_URI`
 *      (set in your `.env` file, e.g., mongodb+srv://user:pass@cluster/dbname)
 *    - Mongoose manages the connection pool internally
 *    - On success, logs the website URL & port for quick reference
 *
 *  USAGE:
 *    const connectDB = require('./config/database');
 *    await connectDB();    // call once during server startup
 * ============================================================
 */

const mongoose = require("mongoose");

/**
 * connectDB
 * ---------
 * Async function that connects Mongoose to the MongoDB instance.
 *
 * @returns {Promise<void>} - Resolves when the connection is established.
 *
 * NOTE: If the connection fails, Mongoose will throw an unhandled
 *       promise rejection. Consider wrapping this in a try-catch
 *       block in production for graceful error handling.
 */
async function connectDB() {
    // Connect to MongoDB using the URI stored in environment variables
    await mongoose.connect(process.env.MONGO_URI)

    // Log a confirmation message with the website URL & port number
    console.log('connected to db \n', `OUR WEBSITE IS RUNNING :->>>` + process.env.WEBSITE_URL + `PORT NO`, process.env.PORT);
}

module.exports = connectDB