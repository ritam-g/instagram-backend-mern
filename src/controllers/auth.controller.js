const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

async function registerController(req, res)  {
    const {
        username,
        email,
        password,
        bio,
        profileImage } = req.body
    //! checks user exite alredy or not 
    //! cehck one by one way 
    //NOTE -   we can do less server lode code also 
    // const userExiest1=userModel.findOne({email})
    // const userExiest2=userModel.findOne({email})

    //NOTE - //!BETTER WAY OF doing THIS 
    const userExiest = await userModel.findOne({
        //! or take multiple condition 
        //REVIEW - we wna tto do email||usernmae so we can do this way  
        $or: [
            { email },
            { username }
        ]
    })
    //! if user in db then return  
    if (userExiest) return res.status(409).json({
        message: 'user already exiest :->'+ (userExiest.email===email?'please chage the eamil ':'plese chage the usename ')
    })

    //NOTE - //! not ducplicate that means create user  

    //STUB - //! hash password 
    const hashPassword = crypto.createHash('sha256').update(password).digest('hex')
    const user = await userModel.create({
        username, email, password: hashPassword, bio, profileImage
    })
    //! create token 
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    //NOTE - set cokkie

    res.cookie('token', token)

    res.status(201).json({
        message: 'user is created ',
        user: {
            username: user.username,
            email: user.email,
            password: user.password,
            bio: user.bio,
            profileImage: user.profileImage,
        }
    })

}

 async function loginController (req, res)  {
    const { username, email, password } = req.body
    //NOTE - //! we need otpal and low server user code 
    //! has to check username and email in our db 
    //! check one 
    const userExiest = await userModel.findOne({
        //! or take multiple condition 
        //REVIEW - we wna tto do email||usernmae so we can do this way  
        $or: [
            { email},
            { username }
        ]
    })
    if (!userExiest) {
        return res.status(404).json({
            message: "user not exiest"
        })
    }
    //! passerod check 
    const hash = crypto.createHash('sha256').update(password).digest('hex')

    const resultPass = hash === userExiest.password
    if (!resultPass) return res.status(401).json({ message: 'paswwrod is invalid ' })
     //NOTE - validity token 
    const token = jwt.sign(
        { id: userExiest._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)
    //NOTE - valid user
    res.status(200)
        .json({
            message: "User loggedIn successfully.",
            user: {
                username: userExiest.username,
                email: userExiest.email,
                bio: userExiest.bio,
                profileImage: userExiest.profileImage
            }
        })

}
module.exports={registerController,loginController}