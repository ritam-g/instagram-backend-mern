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
  try {
    const { username, email, password } = req.body;

    // ✅ Validate fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const userExists = await userModel.findOne({
      $or: [{ email }, { username }]
    });

    if (userExists) {
      return res.status(409).json({
        message:
          "User already exists: " +
          (userExists.email === email
            ? "Please change the email"
            : "Please change the username")
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hashPassword
    });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change to true in production
      sameSite: "lax"
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
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
