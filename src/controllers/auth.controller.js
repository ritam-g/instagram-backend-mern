const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ================= REGISTER CONTROLLER =================
async function registerController(req, res) {

    const {
        username,
        email,
        password,
        bio,
        profileImage
    } = req.body

    //! checks user exite alredy or not
    //! cehck one by one way

    //NOTE - we can do less server lode code also
    // const userExiest1 = userModel.findOne({ email })
    // const userExiest2 = userModel.findOne({ username })

    //NOTE - //! BETTER WAY OF doing THIS
    //! $or works like (email || username)
    //! only one DB query → less server load
    const userExiest = await userModel.findOne({

        //! or take multiple condition
        //REVIEW - we wna tto do email || usernmae so we can do this way
        $or: [
            { email },
            { username }
        ]
    })

    //! if user in db then return
    //! status 409 → conflict (duplicate email or username)
    if (userExiest) return res.status(409).json({
        message:
            'user already exiest :-> ' +
            (userExiest.email === email
                ? 'please chage the eamil'
                : 'plese chage the usename')
    })

    //NOTE - //! not ducplicate that means create user

    //STUB - //! hash password
    //! password is hashed before saving for security
    const hashPassword = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex')

    //! create user in database
    const user = await userModel.create({
        username,
        email,
        password: hashPassword,
        bio,
        profileImage
    })

    //! create token
    //! JWT contains user id and expires in 1 day
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    //NOTE - set cokkie
    //! token is stored in cookie for authentication
    res.cookie('token', token)

    //! send success response
    res.status(201).json({
        message: 'user is created',
        user: {
            username: user.username,
            email: user.email,
            password: user.password, // hashed password
            bio: user.bio,
            profileImage: user.profileImage,
        }
    })
}

// ================= LOGIN CONTROLLER =================
async function loginController(req, res) {

    const { username, email, password } = req.body

    //NOTE - //! we need otpal and low server user code
    //! has to check username and email in our db
    //! check one

    const userExiest = await userModel.findOne({

        //! or take multiple condition
        //REVIEW - we wna tto do email || usernmae so we can do this way
        $or: [
            { email },
            { username }
        ]
    })

    //! if user not found → stop login
    if (!userExiest) {
        return res.status(404).json({
            message: "user not exiest"
        })
    }

    //! passerod check
    //! hash incoming password and compare with DB password
    const hash = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex')

    const resultPass = hash === userExiest.password

    //! if password does not match → unauthorized
    if (!resultPass) return res.status(401).json({
        message: 'paswwrod is invalid'
    })

    //NOTE - validity token
    //! create JWT after successful password verification
    const token = jwt.sign(
        { id: userExiest._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    //! store token in cookie
    res.cookie("token", token)

    //NOTE - valid user
    //! login success response
    res.status(200).json({
        message: "User loggedIn successfully.",
        user: {
            username: userExiest.username,
            email: userExiest.email,
            bio: userExiest.bio,
            profileImage: userExiest.profileImage
        }
    })
}

module.exports = {
    registerController,
    loginController
}
