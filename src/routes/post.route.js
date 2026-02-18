const express = require("express");
const { postController, postGetController, postDetailsController, followUserController, unfollowUserController } = require("../controllers/post.controller");
const multer = require('multer');
const identifyUser = require("../middlewares/auth.middleware");


const upload = multer({ storage: multer.memoryStorage() })
const postRoute = express.Router()

//! image is the client sending image key name in form-data 
postRoute.post('/', identifyUser, upload.single("image"), postController)
postRoute.get('/', identifyUser, postGetController)
postRoute.get('/:postid', identifyUser, postDetailsController)


module.exports = postRoute