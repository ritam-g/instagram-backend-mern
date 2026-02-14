const express = require("express");
const { postController, postGetController, postDetailsController } = require("../controllers/post.controller");
const multer  = require('multer') 


const upload = multer({ storage: multer.memoryStorage() })
const postRoute=express.Router()

//! image is the client seding imge key name in from-data 
postRoute.post('/',upload.single("image"),postController)
postRoute.get('/',postGetController)
postRoute.get('/:postid',postDetailsController)
module.exports=postRoute