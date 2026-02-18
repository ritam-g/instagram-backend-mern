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
    user: {
        ref: 'user',
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'user id is required']
    }
})

module.exports = mongoose.model('userPost', postSchema)
