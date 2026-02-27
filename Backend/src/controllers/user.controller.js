const followModel = require("../model/follow.model");
const postModel = require("../model/post.model");
const userModel = require("../model/user.model");
const likeModel = require("../model/like.model");

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

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getUserProfileController(req, res) {
    try {
        const viewerId = req.user.id;
        const { username } = req.params;

        const user = await userModel
            .findOne({ username })
            .select("username email bio profileImage")
            .lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isOwner = user._id.toString() === viewerId;

        const [postsCount, followersCount, followingCount, followRecord] = await Promise.all([
            postModel.countDocuments({ user: user._id }),
            followModel.countDocuments({ followee: user._id, status: "accepted" }),
            followModel.countDocuments({ follower: user._id, status: "accepted" }),
            isOwner
                ? Promise.resolve(null)
                : followModel.findOne({
                    follower: viewerId,
                    followee: user._id,
                    status: "accepted",
                }),
        ]);

        return res.status(200).json({
            profile: {
                username: user.username,
                email: isOwner ? user.email : null,
                bio: user.bio || "",
                profileImage: user.profileImage,
                postsCount,
                followersCount,
                followingCount,
                isOwner,
                isFollowing: Boolean(followRecord),
            },
        });
    } catch (err) {
        console.error("Get Profile Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getMyProfileController(req, res) {
    try {
        const viewerId = req.user.id;

        const user = await userModel
            .findById(viewerId)
            .select("username email bio profileImage")
            .lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const [postsCount, followersCount, followingCount] = await Promise.all([
            postModel.countDocuments({ user: user._id }),
            followModel.countDocuments({ followee: user._id, status: "accepted" }),
            followModel.countDocuments({ follower: user._id, status: "accepted" }),
        ]);

        return res.status(200).json({
            profile: {
                username: user.username,
                email: user.email,
                bio: user.bio || "",
                profileImage: user.profileImage,
                postsCount,
                followersCount,
                followingCount,
                isOwner: true,
                isFollowing: false,
            },
        });
    } catch (err) {
        console.error("Get My Profile Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getUserPostsController(req, res) {
    try {
        const viewerId = req.user.id;
        const { username } = req.params;

        const user = await userModel
            .findOne({ username })
            .select("username profileImage")
            .lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const [posts, userLikes] = await Promise.all([
            postModel.find({ user: user._id }).sort({ createdAt: -1 }).lean(),
            likeModel.find({ userId: viewerId }).select("post").lean(),
        ]);

        const likedPostIds = new Set(userLikes.map((like) => like.post.toString()));

        const enrichedPosts = posts.map((post) => ({
            ...post,
            user: {
                username: user.username,
                profileImage: user.profileImage,
                _id: user._id,
            },
            isOwner: post.user.toString() === viewerId,
            isLiked: likedPostIds.has(post._id.toString()),
        }));

        return res.status(200).json({ posts: enrichedPosts });
    } catch (err) {
        console.error("Get User Posts Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function getMyPostsController(req, res) {
    try {
        const viewerId = req.user.id;

        const user = await userModel
            .findById(viewerId)
            .select("username profileImage")
            .lean();

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const [posts, userLikes] = await Promise.all([
            postModel.find({ user: viewerId }).sort({ createdAt: -1 }).lean(),
            likeModel.find({ userId: viewerId }).select("post").lean(),
        ]);

        const likedPostIds = new Set(userLikes.map((like) => like.post.toString()));

        const enrichedPosts = posts.map((post) => ({
            ...post,
            user: {
                username: user.username,
                profileImage: user.profileImage,
                _id: user._id,
            },
            isOwner: true,
            isLiked: likedPostIds.has(post._id.toString()),
        }));

        return res.status(200).json({ posts: enrichedPosts });
    } catch (err) {
        console.error("Get My Posts Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    followUserController,
    unfollowUserController,
    acceptFollowRequestController,
    getMyProfileController,
    getMyPostsController,
    getUserProfileController,
    getUserPostsController,
};

