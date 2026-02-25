const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    followee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        default: 'accepted',
        enum: {
            values: ['pending', 'accepted', 'rejected'],
            message: 'status can only be "pending, accepted, rejected"'
        }
    }
}, { timestamps: true })

followSchema.index({ follower: 1, followee: 1 }, { unique: true })

module.exports = mongoose.model('follows', followSchema)
