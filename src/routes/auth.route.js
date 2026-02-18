// Auth routes for user registration and login
const express = require("express");
const { registerController, loginController } = require('../controllers/auth.controller');

const authRoute = express.Router()

// POST /api/auth/register - Create a new user account
authRoute.post('/register', registerController)

// POST /api/auth/login - Authenticate user and return JWT token
authRoute.post('/login', loginController)

module.exports = authRoute


