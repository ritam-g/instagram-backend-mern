const jwt = require("jsonwebtoken");

/**
 * @param {Object}   req  - Express request object (must have `req.cookies.token`)
 * @param {Object}   res  - Express response object
 * @param {Function} next - Callback to pass control to the next middleware/controller
 *
 * @returns {void} - Calls next() on success, or sends JSON error response on failure
 */
async function identifyUser(req, res, next) {
    const token = req.cookies.token
    let decode = null

    try {
        // Verify token using secret key
        decode = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        console.log(err);
        return res.status(404).json({
            message: err.message,
            message2: 'token is invalid'
        })
    }

    // Attach decoded user data to request
    req.user = decode
    next()
}

module.exports = identifyUser
