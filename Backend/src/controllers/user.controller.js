const followModel = require("../model/follow.model");
const postModel = require("../model/post.model");
const userModel = require("../model/user.model");

/**
 * @param {Object}   req  - Express request object (must have `req.cookies.token`)
 * @param {Object}   res  - Express response object
 * @param {Function} next - Callback to pass control to the next middleware/controller
 *
 * @returns {void} - Calls next() on success, or sends JSON error response on failure
 */
/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function followUserController(req, res) {
    try {
        const followerId = req.user.id;
        const followeeUsername = req.params.username;

        const followee = await userModel.findOne({ username: followeeUsername });
        if (!followee) {
            return res.status(404).json({ message: "User not found" });
        }

        if (followee._id.toString() === followerId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const existingFollow = await followModel.findOne({
            follower: followerId,
            followee: followee._id
        });

        if (existingFollow) {
            return res.status(400).json({ message: `You already follow ${followeeUsername}` });
        }

        const followRecord = await followModel.create({
            follower: followerId,
            followee: followee._id,
            status: 'accepted' // Default to direct follow for simple clone
        });

        return res.status(201).json({
            message: `Successfully followed ${followeeUsername}`,
            follow: followRecord
        });

    } catch (err) {
        console.error("Follow Error:", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function unfollowUserController(req, res) {
    try {
        const followerId = req.user.id;
        const followeeUsername = req.params.username;

        const followee = await userModel.findOne({ username: followeeUsername });
        if (!followee) {
            return res.status(404).json({ message: "User not found" });
        }

        const deletedFollow = await followModel.findOneAndDelete({
            follower: followerId,
            followee: followee._id
        });

        if (!deletedFollow) {
            return res.status(400).json({ message: `You are not following ${followeeUsername}` });
        }

        return res.status(200).json({ message: `Successfully unfollowed ${followeeUsername}` });
    } catch (err) {
        console.error("Unfollow Error:", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function acceptFollowRequestController(req, res) {
    try {
        const { requestId } = req.params;
        const { response } = req.body;

        if (!["accepted", "rejected"].includes(response)) {
            return res.status(400).json({ message: "Invalid response type. Use 'accepted' or 'rejected'" });
        }

        const follow = await followModel.findById(requestId);
        if (!follow) {
            return res.status(404).json({ message: "Follow request not found" });
        }

        // Verify that the person accepting is the followee
        if (follow.followee.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to respond to this request" });
        }

        follow.status = response;
        await follow.save();

        return res.status(200).json({
            message: `Follow request ${response}`,
            status: response
        });

    } catch (err) {
        console.error("Accept Follow Error:", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { followUserController, unfollowUserController, acceptFollowRequestController };

