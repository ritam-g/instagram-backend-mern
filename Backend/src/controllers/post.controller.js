const postModel = require("../model/post.model");
const ImageKit = require('@imagekit/nodejs');
const userModel = require("../model/user.model");
const followModel = require("../model/follow.model");
const likeModel = require("../model/like.model");

const imagekit = new ImageKit({
    publicKey: "xxx",
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: "https://ik.imagekit.io/xxx"
});

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
async function postController(req, res) {
    try {
        const { caption } = req.body;
        const userId = req.user.id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        let file = null;
        try {
            file = await imagekit.files.upload({
                file: req.file.buffer.toString("base64"),
                fileName: `post_${Date.now()}`,
                folder: "/Instagram/posts"
            });
        } catch (uploadErr) {
            console.error("ImageKit Error:", uploadErr);
            return res.status(500).json({ message: "Failed to upload image" });
        }

        const post = await postModel.create({
            caption,
            imgUrl: file.url,
            user: userId
        });

        return res.status(201).json({
            message: 'Post created successfully',
            post
        });

    } catch (err) {
        console.error("Create Post Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function postGetController(req, res) {
    try {
        const { id } = req.user;
        const userAllPost = await postModel.find({ user: id }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'User posts fetched successfully',
            userAllPost
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function postDetailsController(req, res) {
    try {
        const { postid } = req.params;
        const post = await postModel.findById(postid).populate("user", "username profileImage");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({
            message: "Post fetched successfully",
            post
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function likePostController(req, res) {
    try {
        const { postid } = req.params;
        const userId = req.user.id;

        const post = await postModel.findById(postid);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const alreadyLiked = await likeModel.findOne({ post: postid, userId });
        if (alreadyLiked) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        const like = await likeModel.create({
            post: postid,
            userId
        });

        return res.status(200).json({
            message: "Post liked successfully",
            like
        });
    } catch (err) {
        console.error("Like Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function unLikePostController(req, res) {
    try {
        const { postid } = req.params;
        const userId = req.user.id;

        const deletedLike = await likeModel.findOneAndDelete({ post: postid, userId });

        if (!deletedLike) {
            return res.status(400).json({ message: "You haven't liked this post yet" });
        }

        return res.status(200).json({
            message: 'Post unliked successfully'
        });

    } catch (err) {
        console.error("Unlike Error:", err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function feedController(req, res) {
    try {
        const userId = req.user.id;

        // 1️⃣ Get all posts (Ideally we would filter based on followings, but for now fetching all is fine for a small app)
        const posts = await postModel
            .find()
            .populate("user", "username profileImage")
            .sort({ createdAt: -1 })
            .lean();

        // 2️⃣ Get current user's likes
        const userLikes = await likeModel.find({ userId }).select("post");
        const likedPostIds = new Set(userLikes.map(like => like.post.toString()));

        // 3️⃣ Get current user's followings
        const followings = await followModel.find({
            follower: userId,
            status: "accepted"
        }).select("followee");
        const followedUserIds = new Set(followings.map(f => f.followee.toString()));

        // 4️⃣ Add flags
        const finalPosts = posts.map(post => ({
            ...post,
            isLiked: likedPostIds.has(post._id.toString()),
            isOwner: post.user ? post.user._id.toString() === userId : false,
            isFollowing: post.user ? followedUserIds.has(post.user._id.toString()) : false
        }));

        return res.status(200).json({
            posts: finalPosts
        });

    } catch (err) {
        console.error("Feed Error:", err);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

/**
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function deletePostController(req, res) {
    try {
        const { postid } = req.params;
        const userId = req.user.id;

        const post = await postModel.findById(postid);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.user.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await postModel.findByIdAndDelete(postid);
        // Also cleanup likes
        await likeModel.deleteMany({ post: postid });

        return res.status(200).json({
            message: 'Post deleted successfully'
        });
    } catch (err) {
        console.error("Delete Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { deletePostController, postController, postGetController, postDetailsController, likePostController, unLikePostController, feedController };
