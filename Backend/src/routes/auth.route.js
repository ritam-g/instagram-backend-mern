// Auth routes for user registration and login
const express = require("express");
const { registerController, loginController, getmeUserController } = require('../controllers/auth.controller');
const identifyUser = require("../middlewares/auth.middleware");

const authRoute = express.Router()

// POST /api/auth/register - Create a new user account
authRoute.post('/register', registerController)

// POST /api/auth/login - Authenticate user and return JWT token
authRoute.post('/login', loginController)

/**
 * @route get  /api/auth/get-me
 * @description get the user information 
 */

authRoute.get('/get-me',identifyUser,getmeUserController)
module.exports = authRoute


