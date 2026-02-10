const express = require("express");
const authController = require('../controllers/auth.controller');

const authRoute = express.Router()

//! regiester route  
authRoute.post('/register', authController.registerController)

//! login route 
authRoute.post('/login', authController.loginController)

module.exports = authRoute

