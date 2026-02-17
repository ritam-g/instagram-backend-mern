const jwt = require("jsonwebtoken")
const userModel = require("../model/user.model")
const bcrypt = require("bcryptjs")
async function registerController(req, res) {
    const {
        username,
        email,
        password,
        bio,
        profileImage } = req.body
    //! checks user exists already or not 
    //! check one by one way 
    //NOTE -   we can do less server load code also 
    // const userExists1=userModel.findOne({email})
    // const userExists2=userModel.findOne({email})

    //NOTE - //!BETTER WAY OF doing THIS 
    const userExists = await userModel.findOne({
        //! or take multiple condition 
        //REVIEW - we want to do email||username so we can do this way  
        $or: [
            { email },
            { username }
        ]
    })
    //! if user in db then return  
    if (userExists) return res.status(409).json({
        message: 'user already exists :->' + (userExists.email === email ? 'please change the email ' : 'please change the username ')
    })

    //NOTE - //! not duplicate that means create user  

    //STUB - //! hash password 
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username, email, password: hashPassword, bio, profileImage
    })
    //! create token 
    const token = jwt.sign({ id: user._id, username: username }, process.env.JWT_SECRET, { expiresIn: "1d" })
    //NOTE - set cookie

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
//NOTE - //!login controller
async function loginController(req, res) {
    const { username, email, password } = req.body
    //NOTE - //! we need optimal and low server user code 
    //! has to check username and email in our db 
    //! check one 
    const userExists = await userModel.findOne({
        //! or take multiple condition 
        //REVIEW - we want to do email||username so we can do this way  
        $or: [
            { email },
            { username }
        ]
    })
    if (!userExists) {
        return res.status(404).json({
            message: "user not exists"
        })
    }
    //! password check 


    const resultPass = await bcrypt.compare(password, userExists.password)
    if (!resultPass) return res.status(401).json({ message: 'password is invalid ' })
    //NOTE - validity token 
    const token = jwt.sign(
        { id: userExists._id, username: username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)
    //NOTE - valid user
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