/**
 * ============================================================
 *  POST.CONTROLLER.JS — Post Management Controllers
 * ============================================================
 *
 *  Contains the business logic for all post-related operations:
 *    1. postController          → Create a new post (with image upload)
 *    2. postGetController       → Get all posts for the logged-in user
 *    3. postDetailsController   → Get a single post by ID (owner only)
 *    4. likePostController      → Like a post (one like per user)
 *    5. unLikePostController    → Remove a like from a post
 *
 *  IMAGE UPLOAD:
 *    Uses ImageKit SDK to upload images to a CDN.
 *    Images are received as multipart form-data (via Multer middleware),
 *    converted to base64, and uploaded to ImageKit's cloud storage.
 *
 *  DEPENDENCIES:
 *    postModel   → Mongoose model for posts
 *    userModel   → Mongoose model for users
 *    followModel → Mongoose model for follow relationships
 *    likeModel   → Mongoose model for post likes
 *    ImageKit    → SDK for image upload & management
 * ============================================================
 */

// ──────────────────────────────────────────────
//  DEPENDENCY IMPORTS
// ──────────────────────────────────────────────
const postModel = require("../model/post.model");     // Post schema model
const ImageKit = require('@imagekit/nodejs');           // ImageKit Node.js SDK for image uploads

const userModel = require("../model/user.model");      // User schema model (for user verification)
const followModel = require("../model/follow.model");  // Follow schema model
const likeModel = require("../model/like.model");      // Like schema model

// ──────────────────────────────────────────────
//  IMAGEKIT CONFIGURATION
// ──────────────────────────────────────────────
//  Initialize the ImageKit client with your credentials.
//  • publicKey   → Used for client-side identification
//  • privateKey  → Used for server-side authentication (kept in env vars for security)
//  • urlEndpoint → Your ImageKit CDN base URL where images are served from
const imagekit = new ImageKit({
    publicKey: "xxx",
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: "https://ik.imagekit.io/xxx"
});

/**
 * ============================================================
 *  1. POST CONTROLLER — Create a New Post
 * ============================================================
 *
 *  ENDPOINT: POST /api/posts/
 *  AUTH:     Required (identifyUser middleware)
 *  UPLOAD:   Multer middleware handles file upload (form-data key: "image")
 *
 *  FLOW:
 *    1. Extract caption from request body
 *    2. Verify the user exists in the database
 *    3. Upload image to ImageKit CDN
 *    4. Create a post document in MongoDB with caption, image URL, and user ID
 *    5. Return the created post
 *
 *  REQUEST:
 *    Content-Type: multipart/form-data
 *    Fields: caption (text), image (file)
 */
async function postController(req, res) {

    // ── Step 1: Extract caption from the request body ──
    const { caption } = req.body



    // ── Step 2: Verify user exists in the database ──
    //  `req.user.id` comes from the JWT payload (set by auth middleware).
    //  Double-checking ensures the token's user still exists in the DB.
    let user = await userModel.findOne({ _id: req.user.id })

    // If user not found (e.g., account was deleted after token was issued)
    if (!user) return res.status(401).json({ message: "user is unauthorized" })

    // ── Step 3: Upload image to ImageKit CDN ──
    //  `req.file` is populated by Multer's `upload.single("image")` middleware.
    //  • `.buffer` → Raw binary data of the uploaded file (stored in memory)
    //  • `.toString("base64")` → Converts binary to base64 string (required by ImageKit)
    //  • `folder` → Organizes images in folders on ImageKit dashboard
    let file = null
    try {
        file = await imagekit.files.upload({
            file: req.file.buffer.toString("base64"),
            fileName: "Test",
            folder: "/Instagram/posts"
        });
    } catch (err) {
        res.status(404).json({
            message: 'something went wrong '
        })
    }

    // ── Step 4: Create post document in MongoDB ──
    //  Stores:
    //    • caption  → User's text caption
    //    • imgUrl   → CDN URL returned by ImageKit (e.g., https://ik.imagekit.io/...)
    //    • user     → ObjectId reference to the user who created this post
    const post = await postModel.create({
        caption, imgUrl: file.url, user: user._id
    })

    // ── Step 5: Return success response ──
    return res.status(201).json({
        message: 'post is created ',
        post
    })
}

/**
 * ============================================================
 *  2. POST GET CONTROLLER — Get All Posts for Logged-in User
 * ============================================================
 *
 *  ENDPOINT: GET /api/posts/
 *  AUTH:     Required
 *
 *  FLOW:
 *    1. Get the user's ID from the JWT token (req.user)
 *    2. Query all posts where `user` field matches the logged-in user's ID
 *    3. Return the array of posts
 *
 *  RESPONSE (Success - 200):
 *    { "message": "all post fetch", "userAllPost": [ ... ] }
 */
async function postGetController(req, res) {

    // ── Extract user ID from JWT payload ──
    const { id } = req.user

    // ── Find all posts belonging to this user ──
    //  `{ user: id }` filters posts by the user's ObjectId.
    const userAllPost = await postModel.find({ user: id })

    // If no posts found for this user
    if (!userAllPost) return res.status(401).json({ message: 'no post is found' })

    // ── Return all posts ──
    return res.status(200).json({
        message: 'all post fetch', userAllPost
    })
}

/**
 * ============================================================
 *  3. POST DETAILS CONTROLLER — Get a Single Post by ID
 * ============================================================
 *
 *  ENDPOINT: GET /api/posts/:postid
 *  AUTH:     Required
 *
 *  FLOW:
 *    1. Extract post ID from URL params (req.params.postid)
 *    2. Find the post in the database by its _id
 *    3. If not found → 404
 *    4. Verify the logged-in user is the OWNER of the post
 *    5. If not owner → 403 Forbidden
 *    6. Return the post details
 *
 *  AUTHORIZATION:
 *    Only the user who created the post can view its details.
 *    This is an ownership check, not just authentication.
 */
async function postDetailsController(req, res) {
    try {
        // ── Step 1: Get Post ID from route params ──
        const postId = req.params.postid;



        // ── Step 2: Find the post by its MongoDB _id ──
        const post = await postModel.findById(postId);

        // ── Step 3: Post not found → 404 ──
        if (!post) {
            return res.status(404).json({
                message: "Post not found."
            });
        }

        // ── Step 4: Ownership check ──
        //  Compare post's user ObjectId with the logged-in user's ID.
        //  `.toString()` is needed because ObjectId comparison requires
        //  string conversion (ObjectId !== string by default).
        const isOwner = post.user.toString() === req.user.id;

        // ── Step 5: Not the owner → 403 Forbidden ──
        if (!isOwner) {
            return res.status(403).json({
                message: "Forbidden. You are not authorized to view this post."
            });
        }

        // ── Step 6: Return post details ──
        return res.status(200).json({
            message: "Post fetched successfully.",
            post
        });

    } catch (error) {
        // ── Handle unexpected server errors ──
        //  Catches invalid ObjectId format, database errors, etc.
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message
        });
    }
}


/**
 * ============================================================
 *  4. LIKE POST CONTROLLER — Like a Post
 * ============================================================
 *
 *  ENDPOINT: POST /api/posts/like/:postid
 *  AUTH:     Required
 *
 *  FLOW:
 *    1. Extract post ID from URL params and username from JWT
 *    2. Find the post in the database
 *    3. Check if the user has already liked this post (prevent duplicates)
 *    4. If already liked → return message (no duplicate likes allowed)
 *    5. If post not found → 404
 *    6. Create a new like document in the database
 *    7. Return success response
 *
 *  CONSTRAINT:
 *    Each user can like a specific post only ONCE.
 *    Enforced both in code (Step 3) and by the compound unique index
 *    on the Like model { post, username }.
 */
async function likePostController(req, res) {
    try {
        // ── Extract post ID from URL params ──
        const postId = req.params.postid

        // ── Extract username from JWT payload ──
        const username = req.user.username

        // ── Find the post by ID ──
        const post = await postModel.findById(postId)

        // ── Check for duplicate like (user already liked this post) ──
        //  Query the likes collection for an existing record with
        //  the same post ID and username combination.
        const doubleTime = await likeModel.findOne({ post: postId, username })
        if (doubleTime) return res.status(200).json({ message: 'you can like only 1 time' })

        // ── Post not found → 404 ──
        if (!post) {

            return res.status(404).json({
                message: "Post not found."
            })
        }

        // ── Create the like record in the database ──
        //  Links the post ID with the username who liked it.
        const like = await likeModel.create({
            post: postId,
            username
        })

        // ── Return success ──
        res.status(200).json({
            message: "Post liked successfully.",
            like
        })
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: 'post is not found'
        })

    }
}

/**
 * ============================================================
 *  5. UNLIKE POST CONTROLLER — Remove a Like from a Post
 * ============================================================
 *
 *  ENDPOINT: POST /api/posts/unlike/:postid
 *  AUTH:     Required
 *
 *  FLOW:
 *    1. Extract post ID and username
 *    2. Verify the post exists
 *    3. Check if the user has actually liked this post
 *    4. If no like found → return "please like first"
 *    5. Delete the like document from the database
 *    6. Return success response
 *
 *  NOTE:
 *    Uses `findByIdAndDelete()` to remove the like record entirely,
 *    rather than toggling a boolean — keeps the collection clean.
 */
async function unLikePostController(req, res) {
    try {
        // ── Extract post ID and username ──
        const postId = req.params.postid
        const username = req.user.username

        // ── Verify post exists ──
        const post = await postModel.findById(postId)

        if (!post) return res.status(401).json({ message: "no post found" })

        // ── Check if the user has liked this post ──
        //  If no like record exists, the user hasn't liked it yet.
        const isLike = await likeModel.findOne({ post: post._id })

        if (!isLike) return res.status(401).json({ message: "please like first" })

        // ── Delete the like record from the database ──
        //  Completely removes the like document (not just updating a flag).
        const deltedLike = await likeModel.findByIdAndDelete(isLike._id)

        // ── Return success ──
        return res.status(201).json({
            message: 'you sucessfully unlike',
            isLike
        })

    } catch (err) {
        console.log(err.message, err);
        res.status(404).json({ message: 'something went wrong ' })

    }
}



// ──────────────────────────────────────────────
//  EXPORT ALL CONTROLLERS
// ──────────────────────────────────────────────
//  Exported as named functions for use in post.route.js
module.exports = { postController, postGetController, postDetailsController, likePostController, unLikePostController };
