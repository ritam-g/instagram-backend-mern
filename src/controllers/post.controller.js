const postModel = require("../model/post.model");
const ImageKit = require('@imagekit/nodejs');
const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
const followModel = require("../model/follow.model");
const { json } = require("express");
const imagekit = new ImageKit({
    publicKey: "xxx",
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: "https://ik.imagekit.io/xxx"
});
/**
 * 
 * 
 */
async function postController(req, res) {

    //NOTE - //! now doing valid one  

    /**
     * //* INFO  enough for the day    
     */
    //* INFO  create peroper post controler 
    const { caption } = req.body

    

    let user = await userModel.findOne({ _id: req.user.id })

    if (!user) return res.status(401).json({ message: "user is unauthorize" })

    let file = null
    try {
        file = await imagekit.files.upload({
            file: req.file.buffer.toString("base64"),
            fileName: "Test",
            folder: "/Instgram/posts" //! //* INFO INFO  mkae proper folder structure for image kit 
        });
    } catch (err) {
        res.status(404).json({
            message: 'something went wrong '
        })
    }

    //* INFO  then create post  

    const post = await postModel.create({
        caption, imgUrl: file.url, user: user._id
    })

    return res.status(201).json({
        message: 'post is created ',
        post
    })
}
/**
 * 
 * they will get post 
 */
async function postGetController(req, res) {
    
    const { id } = req.user
    const userAllPost = await postModel.find({ user: id })

    if (!userAllPost) return res.status(401).json({ message: 'not post is found' })

    return res.status(200).json({
        message: 'all post fetch', userAllPost
    })
}
/**
 * 
 * now they will get post if they in  
 */

async function postDetailsController(req, res) {
    try {
        // 1️⃣ Get Post ID from route params
        const postId = req.params.postid;

        

        // 5️⃣ Find post by ID
        const post = await postModel.findById(postId);

        // 6️⃣ If post does not exist
        if (!post) {
            return res.status(404).json({
                message: "Post not found."
            });
        }

        // 7️⃣ Check if logged-in user is the owner of the post
        // post.user is ObjectId → compare properly
        const isOwner = post.user.toString() === req.user.id;

        if (!isOwner) {
            return res.status(403).json({
                message: "Forbidden. You are not authorized to view this post."
            });
        }

        // 8️⃣ If everything is valid → return post details
        return res.status(200).json({
            message: "Post fetched successfully.",
            post
        });

    } catch (error) {
        // 9️⃣ Handle unexpected server errors
        return res.status(500).json({
            message: "Internal server error.",
            error: error.message
        });
    }
}

async function followUserController(req,res) {
    try {
        const follower=req.user.id
        const followee=req.params.userid
    
        const isUserExiest=await userModel.findById(followee)
        const isCelebrity=await userModel.findById(follower)

        
        if(!isUserExiest)return res.status(401).json({message:'invalid user',statusbar:'faild'})
        
        if(!isCelebrity)return res.status(401).json({message:'invalid person you are follwing',statusbar:'faild'})
    
        //NOTE - both are ok then create 
        const follow=await followModel.create({
            follower:req.user.username,followee:isUserExiest.username
        }) 
    
        return res.status(201).json({message:`'you sucessfull follow' ${isCelebrity.username}`,follow})
    } catch (err) {
        console.log(err);
        
        return res.status(404).json({message:'some internal err'})
    }
    
}


module.exports = { postController, postGetController, postDetailsController,followUserController };
