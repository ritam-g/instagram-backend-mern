/**
 * ============================================================
 *  AUTH.MIDDLEWARE.JS — JWT Authentication Middleware
 * ============================================================
 *
 *  This middleware protects routes that require a logged-in user.
 *  It intercepts every request to a protected route, extracts
 *  the JWT token from the cookie, verifies it, and attaches
 *  the decoded user data to `req.user` for downstream handlers.
 *
 *  FLOW:
 *    1. Read the `token` cookie from the incoming request
 *    2. Verify the token using the secret key (JWT_SECRET)
 *    3. If VALID   → attach decoded payload to `req.user` → call next()
 *    4. If INVALID → return 404 error with "token is invalid" message
 *
 *  DECODED TOKEN PAYLOAD (set during login/register):
 *    {
 *      id: "64a1b2c3d4e5f...",   // MongoDB user _id
 *      username: "john_doe",      // Username string
 *      iat: 1234567890,           // Issued-at timestamp
 *      exp: 1234654290            // Expiration timestamp
 *    }
 *
 *  USAGE IN ROUTES:
 *    const identifyUser = require('../middlewares/auth.middleware');
 *    router.get('/profile', identifyUser, profileController);
 *    // Now `req.user.id` and `req.user.username` are available in profileController
 * ============================================================
 */

const jwt = require("jsonwebtoken");

/**
 * identifyUser (Middleware)
 * -------------------------
 * Verifies the JWT token stored in cookies and identifies the logged-in user.
 *
 * @param {Object}   req  - Express request object (must have `req.cookies.token`)
 * @param {Object}   res  - Express response object
 * @param {Function} next - Callback to pass control to the next middleware/controller
 *
 * @returns {void} - Calls next() on success, or sends JSON error response on failure
 */
async function identifyUser(req, res, next) {

    // ── Step 1: Extract token from cookies ────────
    //  The token was stored as an HTTP cookie during login/register.
    //  `cookieParser` middleware (set up in app.js) makes it available here.
    const token = req.cookies.token

    // ── Step 2: Initialize decoded variable ────────
    //  Will hold the decoded JWT payload if verification succeeds.
    let decode = null

    try {
        // ── Step 3: Verify & decode the token ──────
        //  `jwt.verify()` checks:
        //    • Token signature matches JWT_SECRET (not tampered)
        //    • Token has not expired (based on `exp` claim)
        //  If either check fails, it throws an error → caught below.
        decode = jwt.verify(token, process.env.JWT_SECRET)

    } catch (err) {
        // ── Step 4: Handle invalid / expired token ──
        //  Common error types:
        //    • JsonWebTokenError  → Token is malformed or signature mismatch
        //    • TokenExpiredError  → Token has passed its expiration time
        //    • NotBeforeError     → Token is not yet active
        console.log(err);

        return res.status(404).json({
            message: err.message,
            message2: 'token is invalid'
        })
    }

    // ── Step 5: Attach decoded user data to request ──
    //  After this line, any downstream controller can access:
    //    • req.user.id       → User's MongoDB _id
    //    • req.user.username → User's username
    //  This is how controllers know WHO is making the request.
    req.user = decode

    // ── Step 6: Pass control to the next handler ──
    //  `next()` tells Express to move to the next middleware
    //  or the actual route controller function.
    next()
}

module.exports = identifyUser