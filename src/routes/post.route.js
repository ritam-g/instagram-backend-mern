const express = require("express");
const { postController, postGetController, postDetailsController, followUserController } = require("../controllers/post.controller");
const multer  = require('multer'); 
const identifyUser = require("../middlewares/auth.middleware");


const upload = multer({ storage: multer.memoryStorage() })
const postRoute=express.Router()

//! image is the client seding imge key name in from-data 
postRoute.post('/',identifyUser,upload.single("image"),postController)
postRoute.get('/',identifyUser,postGetController)
postRoute.get('/:postid',identifyUser,postDetailsController)

postRoute.post('/follow/:userid',identifyUser,followUserController)
module.exports=postRoute