/**
 * ============================================================
 *  POST.MODEL.JS — Mongoose Schema for User Posts
 * ============================================================
 *
 *  Defines the structure of a "Post" document in MongoDB.
 *  Each post represents an image shared by a user (like Instagram).
 *
 *  FIELDS:
 *  ┌──────────┬──────────────────────┬──────────────────────────────────────┐
 *  │ Field    │ Type                 │ Description                          │
 *  ├──────────┼──────────────────────┼──────────────────────────────────────┤
 *  │ caption  │ String               │ Text caption for the post (optional) │
 *  │ imgUrl   │ String               │ URL of the uploaded image (required) │
 *  │ user     │ ObjectId → 'user'    │ Reference to the User who posted it  │
 *  └──────────┴──────────────────────┴──────────────────────────────────────┘
 *
 *  COLLECTION NAME: "userposts" (from model name 'userPost')
 *
 *  RELATIONSHIP:
 *    Post.user → User._id  (Many-to-One: Many posts belong to one user)
 *    This enables `.populate('user')` to auto-fetch the user's data.
 *
 *  USAGE:
 *    const postModel = require('./model/post.model');
 *    const newPost   = await postModel.create({ caption, imgUrl, user: userId });
 * ============================================================
 */

const mongoose = require("mongoose");


// ──────────────────────────────────────────────
//  SCHEMA DEFINITION
// ──────────────────────────────────────────────
const postSchema = new mongoose.Schema({

    // ── Caption ──────────────────────────────
    //  • The text that appears below the image
    //  • Defaults to empty string if not provided
    caption: {
        type: String,
        default: ""
    },

    // ── Image URL ────────────────────────────
    //  • Full URL to the image stored on ImageKit CDN
    //  • Required → a post must always have an image
    //  • The image is uploaded via the post controller using ImageKit SDK
    imgUrl: {
        type: String,
        required: [true, 'image url is required']
    },

    // ── User Reference (Foreign Key) ─────────
    //  • This field creates a RELATIONSHIP between Post and User collections
    //  • `ref: 'user'` → tells Mongoose which model to use when populating
    //  • `type: ObjectId` → stores the MongoDB `_id` of the user who created this post
    //  • Required → every post must belong to a user
    //
    //  HOW IT WORKS:
    //    When you save a post, you store just the user's `_id`.
    //    Later, you can call `postModel.findById(id).populate('user')`
    //    to automatically replace the ObjectId with the full user document.
    user: {
        ref: 'user',
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'user id is required']
    }
})

// ──────────────────────────────────────────────
//  CREATE & EXPORT MODEL
// ──────────────────────────────────────────────
//  Model name: 'userPost'  →  Collection name: 'userposts'
//  Used by post.controller.js for all post-related CRUD operations.
module.exports = mongoose.model('userPost', postSchema)