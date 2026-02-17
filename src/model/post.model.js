const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        default: ""
    },
    imgUrl: {
        type: String,
        required: [true, 'image url is required']
    },
    user: {//! this is the main part it makes connection between user with post  
        ref: 'user',//! this is the name of the model with which we want to make connection
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'user id is required']
    }
})

module.exports = mongoose.model('userPost', postSchema)