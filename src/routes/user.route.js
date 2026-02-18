// User interaction routes (follow/unfollow)
const express = require("express");
const identifyUser = require("../middlewares/auth.middleware");
const { followUserController, unfollowUserController } = require("../controllers/user.controller");

const userRoute = express.Router()

// POST /api/users/follow/:username - Follow a user (creates pending request)
userRoute.post('/follow/:username', identifyUser, followUserController)

// POST /api/users/unfollow/:username - Unfollow a user
userRoute.post('/unfollow/:username', identifyUser, unfollowUserController)

module.exports = userRoute
