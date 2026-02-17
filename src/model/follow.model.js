const mongoose = require("mongoose");

const followSchema=new mongoose.Schema({
    //NOTE - we can use user id instead of username but i want to use username to make it more clear and easy to understand
    follower:{
        type:String //NOTE - who is follwing 
    },
    
    followee:{
        type:String//NOTE - this person is follwing other
    },
    
},{timestamps:true})
//REVIEW - !understading 
followSchema.index({follower:1,followee:1},{unique:true})
module.exports=mongoose.model('follows',followSchema)