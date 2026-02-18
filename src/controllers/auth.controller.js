const jwt = require("jsonwebtoken")
const userModel = require("../model/user.model")
const bcrypt = require("bcryptjs")

/**
 * @param {Object}   req  - Express request object (must have `req.cookies.token`)
 * @param {Object}   res  - Express response object
 * @param {Function} next - Callback to pass control to the next middleware/controller
 *
 * @returns {void} - Calls next() on success, or sends JSON error response on failure
 */
async function registerController(req, res, next) {
    const { username, email, password, bio, profileImage } = req.body

    const userExists = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (userExists) return res.status(409).json({
        message: 'user already exists :->' + (userExists.email === email ? 'please change the email ' : 'please change the username ')
    })

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username, email, password: hashPassword, bio, profileImage
    })

    const token = jwt.sign({ id: user._id, username: username }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.cookie('token', token)

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
 * @param {Object}   req  - Express request object (must have `req.cookies.token`)
 * @param {Object}   res  - Express response object
 * @param {Function} next - Callback to pass control to the next middleware/controller
 *
 * @returns {void} - Calls next() on success, or sends JSON error response on failure
 */
async function loginController(req, res, next) {
    const { username, email, password } = req.body

    const userExists = await userModel.findOne({
        $or: [
            { email },
            { username }
        ]
    })

    if (!userExists) {
        return res.status(404).json({ message: "user not exists" })
    }

    const resultPass = await bcrypt.compare(password, userExists.password)

    if (!resultPass) return res.status(401).json({ message: 'password is invalid ' })

    const token = jwt.sign(
        { id: userExists._id, username: username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)

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

module.exports = { registerController, loginController }
