const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userPost',
        required: [true, 'post id is required']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'user id is required']
    }
}, { timestamps: true })

likeSchema.index({ post: 1, userId: 1 }, { unique: true })

module.exports = mongoose.model('like', likeSchema)
