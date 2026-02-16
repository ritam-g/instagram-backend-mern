const postModel = require("../model/post.model");
const ImageKit = require('@imagekit/nodejs');
const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
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

    //NOTE - this task will do by middle ware
    // //* INFO  check the cokkie exiest or not  
    // const token = req.cookies.token;

    // if (!token) return res.status(401).json({ message: "user is unauthorize" })

    // //* INFO  if exieste check valid or not 
    // let decode = null
    // try {
    //     decode = jwt.verify(token, process.env.JWT_SECRET)
    // } catch (err) {
    //     return res.status(400).json({ messsage: err })
    // }

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


module.exports = { postController, postGetController, postDetailsController };
