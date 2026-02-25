// Post and interaction routes
const express = require("express");
const { postController, postGetController, postDetailsController, likePostController, unLikePostController, feedController, deletePostController } = require("../controllers/post.controller");
const multer = require('multer');
const identifyUser = require("../middlewares/auth.middleware");

const upload = multer({ storage: multer.memoryStorage() })
const postRoute = express.Router()

// POST /api/posts/ - Create a new post with image
postRoute.post('/', identifyUser, upload.single("image"), postController)

// GET /api/posts/ - Get all posts for logged-in user
postRoute.get('/', identifyUser, postGetController)

// GET /api/posts/feed - Get feed posts
postRoute.get('/get/feed', identifyUser, feedController)

// GET /api/posts/:postid - Get single post details
postRoute.get('/:postid', identifyUser, postDetailsController)

// POST /api/posts/like/:postid - Like a post
postRoute.post('/like/:postid', identifyUser, likePostController)

// POST /api/posts/unlike/:postid - Unlike a post
postRoute.post('/unlike/:postid', identifyUser, unLikePostController)

// DELETE /api/posts/:postid - Delete the post
postRoute.delete('/:postid', identifyUser, deletePostController)

module.exports = postRoute
