/**
 * ============================================================
 *  APP.JS — Express Application Configuration
 * ============================================================
 *
 *  This file is the CORE of the Express application.
 *  It sets up:
 *    1. Global middleware (JSON parser, cookie parser)
 *    2. Route imports (auth, post, user)
 *    3. Root endpoint
 *    4. API route mounting under `/api/...`
 *
 *  ARCHITECTURE NOTE:
 *    The `app` instance is created here but NOT started here.
 *    `server.js` is responsible for calling `app.listen()`.
 *    This separation makes the app testable without starting
 *    an actual HTTP server.
 * ============================================================
 */

// ──────────────────────────────────────────────
//  DEPENDENCY IMPORTS
// ──────────────────────────────────────────────
const express = require("express")          // Express framework for building REST APIs
const cookieParser = require('cookie-parser'); // Parses cookies from incoming requests (req.cookies)

// ──────────────────────────────────────────────
//  CREATE EXPRESS APPLICATION INSTANCE
// ──────────────────────────────────────────────
const app = express()

// ──────────────────────────────────────────────
//  GLOBAL MIDDLEWARE
// ──────────────────────────────────────────────
//  Middleware runs on EVERY request before reaching route handlers.
//
//  express.json()   → Parses incoming JSON payloads (req.body)
//                     Without this, req.body would be `undefined` for POST/PUT requests.
//
//  cookieParser()   → Reads cookies from the `Cookie` header and
//                     populates `req.cookies` as a key-value object.
//                     Essential for JWT token-based auth via cookies.
app.use(express.json())
app.use(cookieParser())


// ──────────────────────────────────────────────
//  ROUTE FILE IMPORTS
// ──────────────────────────────────────────────
//  Each route file is a mini Express Router that handles
//  a specific domain of the API:
//    authRoute → Registration & Login (JWT-based)
//    postRoute → CRUD operations for posts, likes
//    userRoute → Follow / Unfollow logic
const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");
const userRoute = require("./routes/user.route");


// ──────────────────────────────────────────────
//  ROOT ENDPOINT — Health Check / Welcome
// ──────────────────────────────────────────────
//  A simple POST endpoint at `/` to confirm the server is alive.
//  Useful for quick testing via Postman or health-check pings.
app.post('/', (req, res) => {
    res.status(200).json({
        message: 'welcome to your social media website '
    })
})

// ──────────────────────────────────────────────
//  API ROUTE MOUNTING
// ──────────────────────────────────────────────
//  Mount each router under its respective base path:
//
//  BASE PATH           ROUTER        HANDLES
//  ─────────────────── ───────────── ───────────────────────────────
//  /api/auth           authRoute     POST /register, POST /login
//  /api/posts          postRoute     POST /, GET /, GET /:postid, etc.
//  /api/users          userRoute     POST /follow/:username, POST /unfollow/:username
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/users', userRoute)

// ──────────────────────────────────────────────
//  EXPORT THE APP
// ──────────────────────────────────────────────
//  Exported so `server.js` can import it and call `app.listen()`.
module.exports = app