/**
 * ============================================================
 *  FOLLOW.MODEL.JS — Mongoose Schema for Follow Relationships
 * ============================================================
 *
 *  Manages the follower-followee relationship between users.
 *  Implements a "follow request" system with status tracking
 *  (pending → accepted / rejected), similar to Instagram's
 *  private account behavior.
 *
 *  FIELDS:
 *  ┌──────────┬──────────┬───────────────────────────────────────────────┐
 *  │ Field    │ Type     │ Description                                   │
 *  ├──────────┼──────────┼───────────────────────────────────────────────┤
 *  │ follower │ String   │ Username of the person who sends the request  │
 *  │ followee │ String   │ Username of the person being followed         │
 *  │ status   │ String   │ Request status: pending / accepted / rejected │
 *  └──────────┴──────────┴───────────────────────────────────────────────┘
 *
 *  EXAMPLE:
 *    If "alice" follows "bob":
 *      follower = "alice"   (she is the one requesting to follow)
 *      followee = "bob"     (he is the one being followed)
 *      status   = "pending" (until bob accepts/rejects)
 *
 *  COLLECTION NAME: "follows"
 *
 *  USAGE:
 *    const followModel = require('./model/follow.model');
 *    await followModel.create({ follower: 'alice', followee: 'bob' });
 * ============================================================
 */

const mongoose = require("mongoose");

// ──────────────────────────────────────────────
//  SCHEMA DEFINITION
// ──────────────────────────────────────────────
const followSchema = new mongoose.Schema({

    // ── Follower ─────────────────────────────
    //  • The username of the person who INITIATED the follow.
    //  • Stored as String (username) instead of ObjectId for
    //    readability and simpler queries.
    follower: {
        type: String
    },

    // ── Followee ─────────────────────────────
    //  • The username of the person BEING FOLLOWED.
    //  • This is the recipient of the follow request.
    followee: {
        type: String
    },

    // ── Status ───────────────────────────────
    //  • Tracks the current state of the follow request.
    //  • Defaults to 'pending' when a request is first created.
    //  • Allowed values (enforced by `enum`):
    //      'pending'  → Request sent, awaiting response
    //      'accepted' → Followee approved the request
    //      'rejected' → Followee declined the request
    status: {
        type: String,
        default: 'pending',
        enum: {
            values: ['pending', 'accepted', 'rejected'],
            message: 'satause can only be "pending,accepted,rejected" '
        }
    }

    // ── Timestamps Option ─────────────────────
    //  Adds `createdAt` and `updatedAt` fields automatically.
    //  Useful for sorting follow requests by date.
}, { timestamps: true })

// ──────────────────────────────────────────────
//  COMPOUND UNIQUE INDEX
// ──────────────────────────────────────────────
//  Creates a unique index on { follower, followee }.
//  This ensures a user can only follow another user ONCE.
//  If "alice" already follows "bob", trying to create the
//  same record again will throw a duplicate key error.
//
//  The `1` means ascending order for each field in the index.
followSchema.index({ follower: 1, followee: 1 }, { unique: true })

// ──────────────────────────────────────────────
//  CREATE & EXPORT MODEL
// ──────────────────────────────────────────────
module.exports = mongoose.model('follows', followSchema)