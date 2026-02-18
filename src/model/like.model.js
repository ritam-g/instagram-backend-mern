/**
 * ============================================================
 *  LIKE.MODEL.JS — Mongoose Schema for Post Likes
 * ============================================================
 *
 *  Tracks which user liked which post.
 *  Each document represents a single "like" action.
 *
 *  FIELDS:
 *  ┌──────────┬──────────────────────┬─────────────────────────────────────┐
 *  │ Field    │ Type                 │ Description                         │
 *  ├──────────┼──────────────────────┼─────────────────────────────────────┤
 *  │ post     │ ObjectId → 'userPost'│ Reference to the liked post         │
 *  │ username │ String               │ Username of the person who liked it │
 *  └──────────┴──────────────────────┴─────────────────────────────────────┘
 *
 *  CONSTRAINTS:
 *    • Compound unique index on { post, username } ensures
 *      one user can like a specific post only ONCE.
 *    • Timestamps are enabled (createdAt, updatedAt).
 *
 *  COLLECTION NAME: "likes"
 *
 *  USAGE:
 *    const likeModel = require('./model/like.model');
 *    await likeModel.create({ post: postId, username: 'alice' });
 * ============================================================
 */

const mongoose = require("mongoose");


// ──────────────────────────────────────────────
//  SCHEMA DEFINITION
// ──────────────────────────────────────────────
const likeSchema = new mongoose.Schema({

    // ── Post Reference ───────────────────────
    //  • ObjectId pointing to the 'userPost' collection
    //  • `ref: 'userPost'` enables `.populate('post')` to
    //    auto-fetch the full post document when querying likes
    //  • Required → a like must always be associated with a post
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userPost',
        required: [true, 'post id is required']
    },

    // ── Username ─────────────────────────────
    //  • The username of the person who liked the post
    //  • Stored as String for easier querying and readability
    //  • Required → must know who performed the like action
    username: {
        type: String,
        required: [true, 'username is required']
    }

    // ── Timestamps Option ─────────────────────
    //  Automatically adds `createdAt` and `updatedAt` fields.
    //  `createdAt` records WHEN the user liked the post.
}, { timestamps: true })

// ──────────────────────────────────────────────
//  COMPOUND UNIQUE INDEX
// ──────────────────────────────────────────────
//  Prevents duplicate likes — a user can only like a post once.
//  If "alice" already liked post "abc123", trying to create
//  another like document with the same { post, username }
//  will throw a MongoDB duplicate key error (E11000).
likeSchema.index({ post: 1, username: 1 }, { unique: true })

// ──────────────────────────────────────────────
//  CREATE & EXPORT MODEL
// ──────────────────────────────────────────────
module.exports = mongoose.model('like', likeSchema)