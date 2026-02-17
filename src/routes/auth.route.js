const express = require("express");
const { registerController, loginController } = require('../controllers/auth.controller');

const authRoute = express.Router()

//! register route  
authRoute.post('/register', registerController)

//! login route 
authRoute.post('/login', loginController)

module.exports = authRoute

