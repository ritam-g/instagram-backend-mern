// User interaction routes (follow/unfollow)
const express = require("express");
const identifyUser = require("../middlewares/auth.middleware");
const { followUserController, unfollowUserController, acceptFollowRequestController } = require("../controllers/user.controller");

const userRoute = express.Router()

// POST /api/users/follow/:username - Follow a user
userRoute.post('/follow/:username', identifyUser, followUserController)

// POST /api/users/unfollow/:username - Unfollow a user
userRoute.post('/unfollow/:username', identifyUser, unfollowUserController)

// POST /api/users/requests/:requestId - Accept/reject follow request
userRoute.post('/requests/:requestId', identifyUser, acceptFollowRequestController)

module.exports = userRoute
