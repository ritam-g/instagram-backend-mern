/**
 * ============================================================
 *  USER.ROUTE.JS — User Interaction Routes
 * ============================================================
 *
 *  Defines the API endpoints for user-to-user interactions:
 *    POST /api/users/follow/:username   → Follow another user
 *    POST /api/users/unfollow/:username → Unfollow a user
 *
 *  NOTE: ALL routes here are PROTECTED (require authentication).
 *  The `identifyUser` middleware verifies the JWT token before
 *  the controller executes.
 *
 *  BASE PATH: /api/users (mounted in app.js)
 * ============================================================
 */

// ──────────────────────────────────────────────
//  DEPENDENCY IMPORTS
// ──────────────────────────────────────────────
const express = require("express");  // Express framework

// Auth middleware → Verifies JWT token and sets req.user
const identifyUser = require("../middlewares/auth.middleware");

// Import user controller functions for follow/unfollow logic
const { followUserController, unfollowUserController } = require("../controllers/user.controller");

// ──────────────────────────────────────────────
//  CREATE ROUTER INSTANCE
// ──────────────────────────────────────────────
const userRoute = express.Router()



// ──────────────────────────────────────────────
//  ROUTE DEFINITIONS
// ──────────────────────────────────────────────

// ── Follow a User ────────────────────────────
//  POST /api/users/follow/:username
//  Sends a follow request to the specified user.
//  :username → The username of the person to follow
//  Creates a follow record with status = 'pending'
//  The target user must accept/reject via the accept endpoint.
userRoute.post('/follow/:username', identifyUser, followUserController)

// ── Unfollow a User ──────────────────────────
//  POST /api/users/unfollow/:username
//  Removes the follow relationship between the logged-in user
//  and the specified user. Deletes the follow record entirely.
//  :username → The username of the person to unfollow
userRoute.post('/unfollow/:username', identifyUser, unfollowUserController)

// ──────────────────────────────────────────────
//  EXPORT ROUTER
// ──────────────────────────────────────────────
//  Mounted in app.js as: app.use('/api/users', userRoute)
module.exports = userRoute