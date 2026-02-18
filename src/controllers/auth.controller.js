/**
 * ============================================================
 *  AUTH.CONTROLLER.JS — Authentication Controllers
 * ============================================================
 *
 *  Contains the business logic for user authentication:
 *    1. registerController → Create a new user account
 *    2. loginController    → Authenticate an existing user
 *
 *  AUTHENTICATION STRATEGY:
 *    • JWT (JSON Web Token) stored in an HTTP cookie
 *    • Passwords hashed with bcrypt (10 salt rounds)
 *    • Token expires in 1 day ("1d")
 *
 *  DEPENDENCIES:
 *    jsonwebtoken → Sign & verify JWT tokens
 *    bcryptjs     → Hash & compare passwords
 *    user.model   → Mongoose model for User collection
 * ============================================================
 */

// ──────────────────────────────────────────────
//  DEPENDENCY IMPORTS
// ──────────────────────────────────────────────
const jwt = require("jsonwebtoken")         // For creating & verifying JWT tokens
const userModel = require("../model/user.model")  // Mongoose User model
const bcrypt = require("bcryptjs")          // For hashing & comparing passwords

/**
 * ============================================================
 *  REGISTER CONTROLLER
 * ============================================================
 *
 *  Handles new user registration.
 *
 *  ENDPOINT: POST /api/auth/register
 *
 *  REQUEST BODY:
 *    {
 *      "username":     "john_doe",
 *      "email":        "john@example.com",
 *      "password":     "mySecurePassword",
 *      "bio":          "Full-stack developer",       // optional
 *      "profileImage": "https://example.com/img.jpg" // optional
 *    }
 *
 *  FLOW:
 *    1. Extract fields from request body
 *    2. Check if a user with the same email OR username already exists
 *    3. If duplicate → return 409 Conflict with helpful message
 *    4. Hash the password using bcrypt (10 salt rounds)
 *    5. Create the user document in MongoDB
 *    6. Generate a JWT token (valid for 1 day)
 *    7. Store the token in a cookie
 *    8. Return 201 Created with user details (password excluded)
 *
 *  RESPONSE (Success - 201):
 *    {
 *      "message": "user is created",
 *      "user": { username, email, bio, profileImage }
 *    }
 *
 *  RESPONSE (Duplicate - 409):
 *    { "message": "user already exists :-> please change the email/username" }
 */
async function registerController(req, res) {

    // ── Step 1: Destructure input fields from request body ──
    const {
        username,
        email,
        password,
        bio,
        profileImage } = req.body

    // ── Step 2: Check for existing user (email OR username) ──
    //  Using MongoDB's `$or` operator to check BOTH email and username
    //  in a SINGLE database query. This is more efficient than making
    //  two separate queries (findOne by email + findOne by username).
    const userExists = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    // ── Step 3: If duplicate found → return conflict error ──
    //  Provides a specific message telling the user WHETHER to change
    //  their email or username based on which one matched.
    if (userExists) return res.status(409).json({
        message: 'user already exists :->' + (userExists.email === email ? 'please change the email ' : 'please change the username ')
    })

    // ── Step 4: Hash the password ──
    //  NEVER store passwords in plain text!
    //  bcrypt.hash(password, 10) → 10 is the salt rounds
    //  Higher salt rounds = more secure but slower hashing.
    //  10 is the recommended balance for most applications.
    const hashPassword = await bcrypt.hash(password, 10);

    // ── Step 5: Create the user document in MongoDB ──
    //  Stores the hashed password, NOT the original plain text.
    const user = await userModel.create({
        username, email, password: hashPassword, bio, profileImage
    })

    // ── Step 6: Generate JWT token ──
    //  Payload: { id, username } → available later via req.user in middleware
    //  Secret:  process.env.JWT_SECRET → used to sign/verify the token
    //  Options: { expiresIn: "1d" } → token automatically expires after 1 day
    const token = jwt.sign({ id: user._id, username: username }, process.env.JWT_SECRET, { expiresIn: "1d" })

    // ── Step 7: Set token as HTTP cookie ──
    //  The browser will automatically send this cookie with every
    //  subsequent request. The auth middleware reads it to identify the user.
    res.cookie('token', token)

    // ── Step 8: Return success response ──
    //  NOTE: Password is intentionally EXCLUDED from the response
    //  for security. Only safe user info is sent back.
    res.status(201).json({
        message: 'user is created ',
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage,
        }
    })

}

/**
 * ============================================================
 *  LOGIN CONTROLLER
 * ============================================================
 *
 *  Handles user login / authentication.
 *
 *  ENDPOINT: POST /api/auth/login
 *
 *  REQUEST BODY:
 *    {
 *      "username": "john_doe",       // can login with username
 *      "email":    "john@example.com", // OR email (either works)
 *      "password": "mySecurePassword"
 *    }
 *
 *  FLOW:
 *    1. Extract credentials from request body
 *    2. Find user by email OR username in database
 *    3. If not found → return 404 "user not exists"
 *    4. Compare provided password with stored hash using bcrypt
 *    5. If mismatch → return 401 "password is invalid"
 *    6. Generate a fresh JWT token (valid for 1 day)
 *    7. Store token in cookie
 *    8. Return 200 OK with user details
 *
 *  RESPONSE (Success - 200):
 *    {
 *      "message": "User logged in successfully.",
 *      "user": { username, email, bio, profileImage }
 *    }
 *
 *  RESPONSE (Not Found - 404):
 *    { "message": "user not exists" }
 *
 *  RESPONSE (Unauthorized - 401):
 *    { "message": "password is invalid" }
 */
async function loginController(req, res) {

    // ── Step 1: Extract login credentials ──
    const { username, email, password } = req.body

    // ── Step 2: Find user by email OR username ──
    //  Uses the same `$or` operator as register to allow
    //  login with EITHER email or username — flexible UX.
    const userExists = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    // ── Step 3: User not found → 404 ──
    if (!userExists) {
        return res.status(404).json({
            message: "user not exists"
        })
    }

    // ── Step 4: Verify password ──
    //  bcrypt.compare() takes the plain-text password and the stored hash,
    //  then returns `true` if they match, `false` otherwise.
    //  This is secure because the original password is never stored.
    const resultPass = await bcrypt.compare(password, userExists.password)

    // ── Step 5: Password mismatch → 401 Unauthorized ──
    if (!resultPass) return res.status(401).json({ message: 'password is invalid ' })

    // ── Step 6: Generate JWT token ──
    //  Same structure as register — payload contains user id & username.
    //  A new token is issued on every login (replaces old ones).
    const token = jwt.sign(
        { id: userExists._id, username: username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    // ── Step 7: Set token cookie ──
    res.cookie("token", token)

    // ── Step 8: Return success with user profile ──
    //  Password is excluded from the response for security.
    res.status(200)
        .json({
            message: "User logged in successfully.",
            user: {
                username: userExists.username,
                email: userExists.email,
                bio: userExists.bio,
                profileImage: userExists.profileImage
            }
        })

}

// ──────────────────────────────────────────────
//  EXPORT CONTROLLERS
// ──────────────────────────────────────────────
//  Exported as named functions so routes can import them individually:
//    const { registerController, loginController } = require('./auth.controller');
module.exports = { registerController, loginController }