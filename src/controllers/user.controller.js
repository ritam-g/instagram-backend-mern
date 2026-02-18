/**
 * ============================================================
 *  USER.CONTROLLER.JS — User Interaction Controllers
 * ============================================================
 *
 *  Contains the business logic for user-to-user interactions:
 *    1. followUserController          → Send a follow request to another user
 *    2. unfollowUserController        → Unfollow a user
 *    3. acceptFollowRequestController → Accept or reject a follow request
 *
 *  FOLLOW SYSTEM:
 *    This implements a REQUEST-BASED follow system (like Instagram's
 *    private accounts). When User A follows User B:
 *      1. A follow record is created with status = 'pending'
 *      2. User B can then 'accept' or 'reject' the request
 *      3. Only 'accepted' follows count as real followers
 *
 *  DEPENDENCIES:
 *    followModel → Mongoose model for follow relationships
 *    userModel   → Mongoose model for user data
 * ============================================================
 */

// ──────────────────────────────────────────────
//  DEPENDENCY IMPORTS
// ──────────────────────────────────────────────
const followModel = require("../model/follow.model");  // Follow relationship model
const userModel = require("../model/user.model");      // User model (for existence checks)

/**
 * ============================================================
 *  1. FOLLOW USER CONTROLLER — Send a Follow Request
 * ============================================================
 *
 *  ENDPOINT: POST /api/users/follow/:username
 *  AUTH:     Required (identifyUser middleware)
 *
 *  URL PARAMS:
 *    :username → The username of the person to follow
 *
 *  FLOW:
 *    1. Get follower (logged-in user) and followee (target user) usernames
 *    2. Prevent self-follow (cannot follow yourself)
 *    3. Check if the target user exists in the database
 *    4. Check if already following (prevent duplicate follow records)
 *    5. Create a follow record with status = 'pending'
 *    6. Return success response
 *
 *  RESPONSE (Success - 201):
 *    { "message": "follow request is sent to bob", "follow": { ... } }
 */
async function followUserController(req, res) {
    try {
        // ── Extract usernames ──
        //  followerUsername → WHO is following (from JWT, the logged-in user)
        //  followeeUsername → WHO is being followed (from URL params)
        const followerUsername = req.user.username
        const followeeUsername = req.params.username

        // ── Guard: Cannot follow yourself ──
        //  Early return prevents unnecessary database queries.
        if (followeeUsername === followerUsername) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            })
        }

        // ── Check if the target user actually exists ──
        //  No point creating a follow record for a non-existent user.
        const user = await userModel.findOne({ username: followeeUsername })
        if (!user) {
            return res.status(404).json({
                message: "User you are trying to follow does not exist"
            })
        }

        // ── Check if already following ──
        //  Query the follow collection for an existing relationship
        //  between these two users. The compound unique index also
        //  prevents duplicates at the database level.
        const isAlreadyFollowing = await followModel.findOne({
            followee: followeeUsername,
            follower: followerUsername
        })

        if (isAlreadyFollowing) {
            return res.status(400).json({
                message: `You are already following ${followeeUsername}`
            })
        }

        // ── Create follow record ──
        //  Status starts as 'pending' — the followee must accept/reject.
        const followRecord = await followModel.create({
            followee: followeeUsername,
            follower: followerUsername,
            status: 'pending'
        })

        // ── Return success ──
        return res.status(201).json({
            message: `follw request is sent to  ${followeeUsername}`,
            follow: followRecord
        })

    } catch (err) {
        // ── Catch-all error handler ──
        return res.status(500).json({
            message: 'Something went wrong'
        })
    }
}


/**
 * ============================================================
 *  2. UNFOLLOW USER CONTROLLER — Unfollow a User
 * ============================================================
 *
 *  ENDPOINT: POST /api/users/unfollow/:username
 *  AUTH:     Required
 *
 *  URL PARAMS:
 *    :username → The username of the person to unfollow
 *
 *  FLOW:
 *    1. Get follower and followee usernames
 *    2. Find the existing follow record between these two users
 *    3. If no record found → user was not following them
 *    4. Delete the follow record from the database
 *    5. Return success message
 *
 *  RESPONSE (Success - 200):
 *    { "message": "You have unfollowed bob" }
 *
 *  RESPONSE (Not Following - 200):
 *    { "message": "You are not following bob" }
 */
async function unfollowUserController(req, res) {

    // ── Extract usernames ──
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    // ── Find the existing follow relationship ──
    //  Looks for a record where the logged-in user is the follower
    //  and the target user is the followee.
    const isFollowe = await followModel.findOne({ follower: followerUsername, followee: followeeUsername })

    // ── Not following → nothing to unfollow ──
    if (!isFollowe) {
        return res.status(200).json({
            message: `You are not following ${followeeUsername}`
        })

    }

    // ── Delete the follow record ──
    //  Completely removes the relationship from the database.
    await followModel.findByIdAndDelete(isFollowe._id)

    // ── Return success ──
    res.status(200).json({
        message: `You have unfollowed ${followeeUsername}`
    })
}

/**
 * ============================================================
 *  3. ACCEPT FOLLOW REQUEST CONTROLLER — Accept or Reject
 * ============================================================
 *
 *  ENDPOINT: POST /api/posts/:follweid
 *  AUTH:     Required
 *
 *  URL PARAMS:
 *    :follweid → The MongoDB _id of the follow request document
 *
 *  REQUEST BODY:
 *    { "response": "accepted" }   → Accept the follow request
 *    { "response": "rejected" }   → Reject the follow request
 *
 *  FLOW:
 *    1. Extract follow request ID from URL params
 *    2. Extract response choice from request body
 *    3. Validate that response is either "accepted" or "rejected"
 *    4. Find the follow document by its _id
 *    5. Update the status field based on the response
 *    6. Save the updated document
 *    7. Return appropriate message
 *
 *  NOTE:
 *    When rejected, the follow record is kept in the database
 *    with status = 'rejected' (not deleted). This can be useful
 *    for analytics or preventing re-follow spam.
 */
async function acceptFollowRequestController(req, res) {
    try {
        // ── Extract follow request ID from URL params ──
        const follweid = req.params.follweid

        // ── Extract the accept/reject decision from request body ──
        const { response } = req.body

        // ── Validate the response value ──
        //  Only "accepted" and "rejected" are allowed.
        //  Any other value gets an error message.
        if (response !== "accepted" && response !== "rejected") {
            return res.status(200).json({
                message: "'first choose 'accepted','rejected''",
                statusbar: 'faild'
            })
        }

        // ── Find the follow request document ──
        const follow = await followModel.findById(follweid)

        // ── Handle "accepted" response ──
        //  Update the status to 'accepted' and save.
        //  This means the follower is now an official follower.
        if (response === "accepted") {

            follow.status = 'accepted'
            await follow.save()
            return res.status(201).json({
                message: 'you have new follower'
            })
        }
        // ── Handle "rejected" response ──
        //  Update the status to 'rejected' and save.
        //  The record is preserved (not deleted) for potential
        //  future reference or anti-spam measures.
        else if (response === "rejected") {
            follow.status = 'rejected'
            await follow.save()
            return res.status(201).json({
                message: 'you rejected'
            })
        }

    } catch (err) {
        // ── Catch-all error handler ──
        return res.status(404).json({ message: 'someting went wrong ' })
    }


}

// ──────────────────────────────────────────────
//  EXPORT ALL CONTROLLERS
// ──────────────────────────────────────────────
//  Exported as named functions for use in user.route.js and post.route.js
module.exports = {
    followUserController, unfollowUserController, acceptFollowRequestController
}