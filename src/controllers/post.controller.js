const postModel = require("../model/post.model");
const ImageKit = require('@imagekit/nodejs');
const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
const imagekit = new ImageKit({
    publicKey: "xxx",
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: "https://ik.imagekit.io/xxx"
});

async function postController(req, res) {

    //NOTE - //! now doing valid one  

    /**
     * //* INFO  enough for the day    
     */
    //* INFO  create peroper post controler 
    const { caption } = req.body

    //* INFO  check the cokkie exiest or not  
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "user is unauthorize" })

    //* INFO  if exieste check valid or not 
    let decode = null
    try {
        decode = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(400).json({ messsage: err })
    }

    let user = await userModel.findOne({ _id: decode.id })

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

async function postGetController(req, res) {
    const token = req.cookies.token
    let decode = null
    try {
        decode = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        console.log(err);
        
        return res.status(404).json({
            message: err.message,
            message2: 'taken is invalid'
        })
    }
    const { id } = decode
    const userAllPost = await postModel.find({ user: id })

    if (!userAllPost) return res.status(401).json({ message: 'not post is found' })

    return res.status(200).json({
        message:'all post fetch',userAllPost
    })
}


module.exports = { postController, postGetController };
