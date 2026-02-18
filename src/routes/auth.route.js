/**
 * ============================================================
 *  AUTH.ROUTE.JS — Authentication Routes
 * ============================================================
 *
 *  Defines the API endpoints for user authentication:
 *    POST /api/auth/register → Create a new user account
 *    POST /api/auth/login    → Log in to an existing account
 *
 *  NOTE: These routes are PUBLIC (no auth middleware required).
 *  Users must be able to register/login WITHOUT a token.
 *
 *  BASE PATH: /api/auth (mounted in app.js)
 * ============================================================
 */

// ──────────────────────────────────────────────
//  DEPENDENCY IMPORTS
// ──────────────────────────────────────────────
const express = require("express");  // Express framework

// Import controller functions that contain the actual business logic
const { registerController, loginController } = require('../controllers/auth.controller');

// ──────────────────────────────────────────────
//  CREATE ROUTER INSTANCE
// ──────────────────────────────────────────────
//  express.Router() creates a modular, mountable route handler.
//  It behaves like a mini-app that handles only auth-related routes.
const authRoute = express.Router()

// ──────────────────────────────────────────────
//  ROUTE DEFINITIONS
// ──────────────────────────────────────────────

// ── Register Route ───────────────────────────
//  POST /api/auth/register
//  Creates a new user account.
//  Body: { username, email, password, bio?, profileImage? }
//  Response: { message, user } + sets JWT cookie
authRoute.post('/register', registerController)

// ── Login Route ──────────────────────────────
//  POST /api/auth/login
//  Authenticates a user and returns a JWT token.
//  Body: { username/email, password }
//  Response: { message, user } + sets JWT cookie
authRoute.post('/login', loginController)

// ──────────────────────────────────────────────
//  EXPORT ROUTER
// ──────────────────────────────────────────────
//  Mounted in app.js as: app.use('/api/auth', authRoute)
module.exports = authRoute


