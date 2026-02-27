// User interaction routes (follow/unfollow)
const express = require("express");
const identifyUser = require("../middlewares/auth.middleware");
const {
  followUserController,
  unfollowUserController,
  acceptFollowRequestController,
  getMyProfileController,
  getMyPostsController,
  getUserProfileController,
  getUserPostsController,
} = require("../controllers/user.controller");

const userRoute = express.Router()

// POST /api/users/follow/:username - Follow a user
userRoute.post('/follow/:username', identifyUser, followUserController)

// POST /api/users/unfollow/:username - Unfollow a user
userRoute.post('/unfollow/:username', identifyUser, unfollowUserController)

// POST /api/users/requests/:requestId - Accept/reject follow request
userRoute.post('/requests/:requestId', identifyUser, acceptFollowRequestController)

// GET /api/users/profile/me - Get current user profile + counters
userRoute.get('/profile/me', identifyUser, getMyProfileController)

// GET /api/users/profile/:username - Get public profile + follow counters
userRoute.get('/profile/:username', identifyUser, getUserProfileController)

// GET /api/users/posts/me - Get current user posts
userRoute.get('/posts/me', identifyUser, getMyPostsController)

// GET /api/users/posts/:username - Get all posts by username
userRoute.get('/posts/:username', identifyUser, getUserPostsController)

module.exports = userRoute
