import React from "react";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import "./feed.scss";
import { usePost } from "../hooks/usePost";

function Feed({ feeds }) {
  if (!feeds || feeds.length === 0) {
    return (
      <div className="feed">
        <p className="feed__empty">No posts available</p>
      </div>
    );
  }

  console.log(feeds);
const {likePostHandeller,unlikePostHandeller}=usePost()

  return (
    <div className="feed">
      <div className="feed__wrapper ">

        {feeds.map((post) => (

          <div className="post" key={post._id}>

            {/* HEADER */}
            <div className="post__header">
              <div className="post__user">
                <img
                  src={post.user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                  alt="profile"
                  className="post__avatar"
                />
                <span className="post__username">
                  {post.user?.username}
                </span>
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
                  <FaHeart className="icon liked" onClick={()=>{unlikePostHandeller(post._id)}} />
                ) : (
                  <FaRegHeart className="icon"  onClick={()=>{likePostHandeller(post._id)}}/>
                )}
                <FaRegComment className="icon" />
              </div>
            </div>

            {/* CAPTION */}
            <div className="post__caption">
              <span className="post__username">
                {post.user?.username}
              </span>
              <span className="post__text">
                {post.caption}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;