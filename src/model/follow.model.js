const mongoose = require("mongoose");

const followSchema=new mongoose.Schema({
    follower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        require:[true,'follower is required']
    },
    
    followee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        require:[true,'followe is required']
    },
    
},{timestamps:true})

module.exports=mongoose.model('follows',followSchema)