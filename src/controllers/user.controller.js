const followModel = require("../model/follow.model");
const userModel = require("../model/user.model");

async function followUserController(req, res) {
    try {
        const followerUsername = req.user.username
        const followeeUsername = req.params.username

        // ❌ Cannot follow yourself
        if (followeeUsername === followerUsername) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            })
        }

        // ✅ Check if user exists
        const user = await userModel.findOne({ username: followeeUsername })
        if (!user) {
            return res.status(404).json({
                message: "User you are trying to follow does not exist"
            })
        }

        // ✅ Check if already following
        const isAlreadyFollowing = await followModel.findOne({
            followee: followeeUsername,
            follower: followerUsername
        })

        if (isAlreadyFollowing) {
            return res.status(400).json({
                message: `You are already following ${followeeUsername}`
            })
        }

        // ✅ Create follow record
        const followRecord = await followModel.create({
            followee: followeeUsername,
            follower: followerUsername
        })

        return res.status(201).json({
            message: `You are now following ${followeeUsername}`,
            follow: followRecord
        })

    } catch (err) {
        return res.status(500).json({
            message: 'Something went wrong'
        })
    }
}


async function unfollowUserController(req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isFollowe = await followModel.findOne({ follower: followerUsername, followee: followeeUsername })

    if (!isFollowe) {
        return res.status(200).json({
            message: `You are not following ${followeeUsername}`
        })

    }
    await followModel.findByIdAndDelete(isFollowe._id)
    res.status(200).json({
        message: `You have unfollowed ${followeeUsername}`
    })
}

module.exports = {
    followUserController, unfollowUserController
}