import React from "react";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
} from "react-icons/fa";
import "./feed.scss";

function Feed({ feeds }) {
  if (!Array.isArray(feeds) || feeds.length === 0) {
    return (
      <div className="feed-page">
        <div className="feed-empty">No posts available</div>
      </div>
    );
  }

  return (
    <div className="feed-page">
      <div className="feed">
        {feeds.map((post) => {
          console.log(post._id,post.isLiked);
          
          if (!post || !post._id ) return null;

          const { _id, caption, imgUrl, user, isLiked } = post;

          return (
            <article className="post" key={_id}>

              {/* USER HEADER */}
              <header className="post-header">
                <div className="user">
                  <div className="avatar">
                    <img
                      src={
                        user?.profileImage ||
                        "https://i.pravatar.cc/150?img=12"
                      }
                      alt="profile"
                    />
                  </div>
                  <span className="username">
                    {user?.username || "Unknown User"}
                  </span>
                </div>
              </header>

              {/* IMAGE */}
              <div className="post-image-wrapper">
                <img src={imgUrl} alt="post" />
              </div>

              {/* ACTIONS */}
              <div className="post-actions">
                <div className="left-actions">
                  <button className="icon-btn">
                    {isLiked ? (
                      <FaHeart className="icon liked" />
                    ) : (
                      <FaRegHeart className="icon" />
                    )}
                  </button>

                  <button className="icon-btn">
                    <FaRegComment className="icon" />
                  </button>
                </div>

                <button className="icon-btn">
                  <FaRegBookmark className="icon" />
                </button>
              </div>

              {/* CAPTION */}
              {caption && (
                <div className="post-caption">
                  <span className="username">
                    {user?.username || "user"}
                  </span>
                  <span className="caption-text">
                    {caption}
                  </span>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default Feed;