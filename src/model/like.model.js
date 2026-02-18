const mongoose = require("mongoose");


const likeSchema=new mongoose.Schema({
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userPost',
        required:[true,'post id is required']
    },
    username:{
        type:String,
        required:[true,'username is required']
    }
},{timestamps:true})

likeSchema.index({post:1,username:1},{unique:true})

module.exports=mongoose.model('like',likeSchema)