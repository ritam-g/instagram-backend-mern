const express = require("express");
const identifyUser = require("../middlewares/auth.middleware");
const { followUserController, unfollowUserController } = require("../controllers/user.controller");
const userRoute=express.Router()



userRoute.post('/follow/:username', identifyUser, followUserController)
userRoute.post('/unfollow/:username', identifyUser, unfollowUserController)

module.exports=userRoute