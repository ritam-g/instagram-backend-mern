import React from "react";
import { FaHeart, FaRegHeart, FaRegComment, FaTrash } from "react-icons/fa";
import "./feed.scss";
import { usePost } from "../hooks/usePost";
import toast from "react-hot-toast";

function Feed({ feeds }) {

  // ✅ ALWAYS call hooks at top
  const {
    likePostHandeller,
    unlikePostHandeller,
    deletePostHandeller,
    // followUserHandler,
    // unfollowUserHandler,
    setfeed
  } = usePost();

  if (!feeds || feeds.length === 0) {
    return (
      <div className="feed">
        <p className="feed__empty">No posts available</p>
      </div>
    );
  }

  // ✅ Delete handler
  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Delete this post?");
    if (!confirmDelete) return;

    try {
      const message = await deletePostHandeller(postId);

      // remove post from UI
      setfeed((prev) =>
        prev.filter((post) => post._id !== postId)
      );

      toast.success(message || "Post deleted 🗑️");
    } catch (error) {
      toast.error("Delete failed ❌");
    }
  };


  return (
    <div className="feed">
      <div className="feed__wrapper">

        {feeds.map((post) => (
          
          
          <div className="post" key={post._id}>

            {/* HEADER */}
            <div className="post__header">
              <div className="post__user">
                <img
                  src={
                    post.user?.profileImage ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                  }
                  alt="profile"
                  className="post__avatar"
                />
                <span className="post__username">
                  {post.user?.username}
                </span>
              </div>

              <div className="post__header-actions">

                {/* FOLLOW BUTTON (not owner only) */}
                {!post.isOwner && (
                  post.isFollowing ? (
                    <button
                      className="post__follow following"
                      onClick={() => unfollowUserHandler(post.user._id)}
                    >
                      Following
                    </button>
                  ) : (
                    <button
                      className="post__follow"
                      onClick={() => followUserHandler(post.user._id)}
                    >
                      Follow
                    </button>
                  )
                )}

                {/* DELETE BUTTON */}
                {post.isOwner && (
                  <button
                    className="post__delete"
                    onClick={() => handleDelete(post._id)}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>

            {/* IMAGE */}
            <div className="post__image-container">
              <img
                src={post.imgUrl}
                alt="post"
                className="post__image"
              />
            </div>

            {/* ACTIONS */}
            <div className="post__actions">
              <div className="post__left-actions">
                {post.isLiked ? (
                  <FaHeart
                    className="icon liked"
                    onClick={() => unlikePostHandeller(post._id)}
                  />
                ) : (
                  <FaRegHeart
                    className="icon"
                    onClick={() => likePostHandeller(post._id)}
                  />
                )}
                <FaRegComment className="icon" />
              </div>
            </div>

            {/* CAPTION */}
            {post.caption && (
              <div className="post__caption">
                <span className="post__username">
                  {post.user?.username}
                </span>
                <span className="post__text">
                  {post.caption}
                </span>
              </div>
            )}

          </div>

        ))}

      </div>
    </div>
  );
}

export default Feed;