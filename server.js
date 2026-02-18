/**
 * ============================================================
 *  SERVER.JS — Application Entry Point
 * ============================================================
 *
 *  This is the MAIN file that boots up the entire backend.
 *  It performs three critical tasks in order:
 *    1. Loads environment variables from the `.env` file.
 *    2. Establishes a connection to the MongoDB database.
 *    3. Starts the Express HTTP server on the configured port.
 *
 *  Run this file to start the application:
 *    $ node server.js
 *    OR
 *    $ npm start
 * ============================================================
 */

// ──────────────────────────────────────────────
//  1. LOAD ENVIRONMENT VARIABLES
// ──────────────────────────────────────────────
//  `dotenv` reads the `.env` file at the project root and
//  injects all key-value pairs into `process.env`.
//  Must be called BEFORE any other module that uses env vars.
require('dotenv').config()

// ──────────────────────────────────────────────
//  2. IMPORT APPLICATION & DATABASE CONFIG
// ──────────────────────────────────────────────
//  `app`       → The configured Express application (routes, middleware, etc.)
//  `connectDB` → Async function that connects Mongoose to MongoDB
const app = require("./src/app");
const connectDB = require("./src/config/database");


// ──────────────────────────────────────────────
//  3. INITIALIZE DATABASE CONNECTION
// ──────────────────────────────────────────────
//  Call connectDB() first so the database is ready
//  before the server starts accepting HTTP requests.
connectDB()

// ──────────────────────────────────────────────
//  4. START THE HTTP SERVER
// ──────────────────────────────────────────────
//  `process.env.PORT` → Port number defined in your `.env`
//  Once the server binds to the port, the callback logs
//  a confirmation message to the console.
app.listen(process.env.PORT, () => {
    console.log('server is running ');

})