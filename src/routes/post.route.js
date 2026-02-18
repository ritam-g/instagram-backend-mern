const express = require("express");
const { postController, postGetController, postDetailsController, followUserController, unfollowUserController, likePostController, unLikePostController } = require("../controllers/post.controller");
const multer = require('multer');
const identifyUser = require("../middlewares/auth.middleware");


const upload = multer({ storage: multer.memoryStorage() })
const postRoute = express.Router()

//! image is the client sending image key name in form-data 
postRoute.post('/', identifyUser, upload.single("image"), postController)
postRoute.get('/', identifyUser, postGetController)
postRoute.get('/:postid', identifyUser, postDetailsController)

postRoute.post('/like/:postid',identifyUser,likePostController)
postRoute.post('/unlike/:postid',identifyUser,unLikePostController)

module.exports = postRoute