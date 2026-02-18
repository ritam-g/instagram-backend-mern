const followModel = require("../model/follow.model");
const userModel = require("../model/user.model");

/**
 * @param {Object}   req  - Express request object (must have `req.cookies.token`)
 * @param {Object}   res  - Express response object
 * @param {Function} next - Callback to pass control to the next middleware/controller
 *
 * @returns {void} - Calls next() on success, or sends JSON error response on failure
 */
async function followUserController(req, res, next) {
    try {
        const followerUsername = req.user.username
        const followeeUsername = req.params.username

        if (followeeUsername === followerUsername) {
            return res.status(400).json({ message: "You cannot follow yourself" })
        }

        const user = await userModel.findOne({ username: followeeUsername })
        if (!user) {
            return res.status(404).json({ message: "User you are trying to follow does not exist" })
        }

        const isAlreadyFollowing = await followModel.findOne({
            followee: followeeUsername,
            follower: followerUsername
        })

        if (isAlreadyFollowing) {
            return res.status(400).json({ message: `You are already following ${followeeUsername}` })
        }

        const followRecord = await followModel.create({
            followee: followeeUsername,
            follower: followerUsername,
            status: 'pending'
        })

        return res.status(201).json({
            message: `follw request is sent to ${followeeUsername}`,
            follow: followRecord
        })

    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong' })
    }
}

/**
 * @param {Object}   req  - Express request object (must have `req.cookies.token`)
 * @param {Object}   res  - Express response object
 * @param {Function} next - Callback to pass control to the next middleware/controller
 *
 * @returns {void} - Calls next() on success, or sends JSON error response on failure
 */
async function unfollowUserController(req, res, next) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isFollowe = await followModel.findOne({ follower: followerUsername, followee: followeeUsername })

    if (!isFollowe) {
        return res.status(200).json({ message: `You are not following ${followeeUsername}` })
    }

    await followModel.findByIdAndDelete(isFollowe._id)

    res.status(200).json({ message: `You have unfollowed ${followeeUsername}` })
}

/**
 * @param {Object}   req  - Express request object (must have `req.cookies.token`)
 * @param {Object}   res  - Express response object
 * @param {Function} next - Callback to pass control to the next middleware/controller
 *
 * @returns {void} - Calls next() on success, or sends JSON error response on failure
 */
async function acceptFollowRequestController(req, res, next) {
    try {
        const follweid = req.params.follweid
        const { response } = req.body

        if (response !== "accepted" && response !== "rejected") {
            return res.status(200).json({
                message: "'first choose 'accepted','rejected''",
                statusbar: 'faild'
            })
        }

        const follow = await followModel.findById(follweid)

        if (response === "accepted") {
            follow.status = 'accepted'
            await follow.save()
            return res.status(201).json({ message: 'you have new follower' })
        }
        else if (response === "rejected") {
            follow.status = 'rejected'
            await follow.save()
            return res.status(201).json({ message: 'you rejected' })
        }

    } catch (err) {
        return res.status(404).json({ message: 'someting went wrong' })
    }
}

module.exports = { followUserController, unfollowUserController, acceptFollowRequestController }
