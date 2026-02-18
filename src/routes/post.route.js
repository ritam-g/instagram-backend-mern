/**
 * ============================================================
 *  POST.ROUTE.JS — Post & Interaction Routes
 * ============================================================
 *
 *  Defines the API endpoints for post management and interactions:
 *    POST   /api/posts/              → Create a new post (with image upload)
 *    GET    /api/posts/              → Get all posts for the logged-in user
 *    GET    /api/posts/:postid       → Get details of a specific post
 *    POST   /api/posts/like/:postid  → Like a post
 *    POST   /api/posts/unlike/:postid→ Unlike a post
 *    POST   /api/posts/:follweid     → Accept/reject a follow request
 *
 *  NOTE: ALL routes here are PROTECTED (require authentication).
 *  The `identifyUser` middleware runs before every handler to
 *  verify the JWT token from cookies.
 *
 *  IMAGE UPLOAD:
 *    Uses Multer with memory storage for handling multipart/form-data.
 *    The image is kept in memory (as a Buffer) and then uploaded
 *    to ImageKit CDN in the controller.
 *
 *  BASE PATH: /api/posts (mounted in app.js)
 * ============================================================
 */

// ──────────────────────────────────────────────
//  DEPENDENCY IMPORTS
// ──────────────────────────────────────────────
const express = require("express");  // Express framework

// Import post controller functions
const { postController, postGetController, postDetailsController, followUserController, unfollowUserController, likePostController, unLikePostController } = require("../controllers/post.controller");

// Multer → Middleware for handling file uploads (multipart/form-data)
const multer = require('multer');

// Auth middleware → Verifies JWT token and sets req.user
const identifyUser = require("../middlewares/auth.middleware");

// Import follow request controller from user controller
const { acceptFollowRequestController } = require("../controllers/user.controller");


// ──────────────────────────────────────────────
//  MULTER CONFIGURATION
// ──────────────────────────────────────────────
//  `multer.memoryStorage()` stores uploaded files in memory as Buffer objects.
//  This is ideal when you DON'T want to save files to disk locally,
//  but instead upload them directly to a cloud service (ImageKit CDN).
//
//  Alternative: `multer.diskStorage()` saves files to the local filesystem.
const upload = multer({ storage: multer.memoryStorage() })

// ──────────────────────────────────────────────
//  CREATE ROUTER INSTANCE
// ──────────────────────────────────────────────
const postRoute = express.Router()

// ──────────────────────────────────────────────
//  ROUTE DEFINITIONS
// ──────────────────────────────────────────────

// ── Create Post ──────────────────────────────
//  POST /api/posts/
//  Middleware chain: identifyUser → multer(upload single image) → postController
//  • `identifyUser` → Verifies JWT, sets req.user
//  • `upload.single("image")` → Parses the file from form-data field named "image"
//                                and attaches it to req.file
//  • `postController` → Handles the actual post creation logic
//  Content-Type: multipart/form-data (NOT application/json)
postRoute.post('/', identifyUser, upload.single("image"), postController)

// ── Get All Posts (for logged-in user) ───────
//  GET /api/posts/
//  Returns all posts created by the authenticated user.
postRoute.get('/', identifyUser, postGetController)

// ── Get Single Post Details ──────────────────
//  GET /api/posts/:postid
//  Returns details of a specific post (owner access only).
//  :postid → MongoDB ObjectId of the post
postRoute.get('/:postid', identifyUser, postDetailsController)

// ── Like a Post ──────────────────────────────
//  POST /api/posts/like/:postid
//  Adds a like from the authenticated user to the specified post.
//  Prevents duplicate likes (one like per user per post).
postRoute.post('/like/:postid', identifyUser, likePostController)

// ── Unlike a Post ────────────────────────────
//  POST /api/posts/unlike/:postid
//  Removes the authenticated user's like from the specified post.
postRoute.post('/unlike/:postid', identifyUser, unLikePostController)

// ── Accept/Reject Follow Request ─────────────
//  POST /api/posts/:follweid
//  Accepts or rejects a pending follow request.
//  :follweid → MongoDB _id of the follow request document
//  Body: { "response": "accepted" | "rejected" }
postRoute.post('/:follweid', identifyUser, acceptFollowRequestController)

// ──────────────────────────────────────────────
//  EXPORT ROUTER
// ──────────────────────────────────────────────
//  Mounted in app.js as: app.use('/api/posts', postRoute)
module.exports = postRoute