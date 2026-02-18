/**
 * ============================================================
 *  USER.MODEL.JS — Mongoose Schema for User
 * ============================================================
 *
 *  Defines the structure of a "User" document in MongoDB.
 *
 *  FIELDS:
 *  ┌───────────────┬──────────┬──────────────────────────────────────┐
 *  │ Field         │ Type     │ Description                          │
 *  ├───────────────┼──────────┼──────────────────────────────────────┤
 *  │ username      │ String   │ Unique display name (required)       │
 *  │ email         │ String   │ Unique email address (required)      │
 *  │ password      │ String   │ Hashed password via bcrypt (required)│
 *  │ bio           │ String   │ Short user biography (optional)      │
 *  │ profileImage  │ String   │ URL to avatar image (has default)    │
 *  └───────────────┴──────────┴──────────────────────────────────────┘
 *
 *  COLLECTION NAME: "users" (Mongoose auto-pluralizes "user")
 *
 *  USAGE:
 *    const userModel = require('./model/user.model');
 *    const newUser   = await userModel.create({ username, email, password });
 * ============================================================
 */

const mongoose = require("mongoose");

// ──────────────────────────────────────────────
//  SCHEMA DEFINITION
// ──────────────────────────────────────────────
//  Defines the shape of every User document stored in MongoDB.
//  Mongoose validates incoming data against these rules before saving.
const userSchema = new mongoose.Schema({

    // ── Username ─────────────────────────────
    //  • Must be unique → prevents duplicate usernames in the database
    //  • Required → every user must have a username
    username: {
        type: String,
        unique: [true, "User name already exists"],
        required: [true, "User name is required"]
    },

    // ── Email ────────────────────────────────
    //  • Must be unique → one account per email
    //  • Required → used for login & identification
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Email is required"]
    },

    // ── Password ─────────────────────────────
    //  • Stored as a HASHED value (bcrypt), never plain text
    //  • Required → authentication depends on it
    password: {
        type: String,
        required: [true, "Password is required"]
    },

    // ── Bio ───────────────────────────────────
    //  • Optional short biography text
    //  • No validation constraints — allows any string
    bio: String,

    // ── Profile Image ────────────────────────
    //  • URL pointing to the user's avatar/profile picture
    //  • Default value → a generic user icon from ImageKit CDN
    //  • Gets overridden when the user uploads a custom picture
    profileImage: {
        type: String,
        default: "https://ik.imagekit.io/6b0qui93u/tech-user-icon-black-background-vector-1471212.avif"
    }
})

// ──────────────────────────────────────────────
//  CREATE & EXPORT MODEL
// ──────────────────────────────────────────────
//  mongoose.model('user', userSchema) creates:
//    1. A model class named `user`
//    2. A MongoDB collection named `users` (auto-pluralized)
//  Other files import this model to perform CRUD on users.
const userModel = mongoose.model('user', userSchema)
module.exports = userModel