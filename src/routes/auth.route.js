const express = require("express");
const userModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authRoute = express.Router()
//! regiester route  
authRoute.post('/register', async (req, res) => {
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
        message: 'user already exiest'
    })

   //NOTE - //! not ducplicate that means create user  

   //STUB - //! hash password 
   const hashPassword = crypto.createHash('sha256').update(password).digest('hex') 
   const user= await userModel.create({
        username, email, password:hashPassword, bio, profileImage
    })
    //! create token 
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{ expiresIn: "1d" })
    //NOTE - set cokkie

    res.cookie('token',token)

    res.status(201).json({
        message:'user is created ',
        user:{
            username:user.username,
            email:user.email,
            password:user.password,
            bio:user.bio,
            profileImage:user.profileImage,
        }
    })

})

//! loggin route 
authRoute.post('/login', async (req, res) => {

})

module.exports = authRoute

