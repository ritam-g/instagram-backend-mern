import React from "react";
import { FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { usePost } from "../hooks/usePost";
import Button from "../../../components/ui/Button";

const PostCard = React.memo(({ post }) => {
  const { likePostHandeller, unlikePostHandeller, followUserHandler, unfollowUserHandler } = usePost();

  const userProfilePath = post.user?.username ? `/profile/${encodeURIComponent(post.user.username)}` : "/feed-page";

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    try {
      if (post.isLiked) {
        await unlikePostHandeller(post._id);
      } else {
        await likePostHandeller(post._id);
      }
    } catch (error) {
      // Error handled in handler
    }
  };

  const handleFollowToggle = async (e) => {
    e.stopPropagation();
    try {
      if (post.isFollowing) {
        await unfollowUserHandler(post.user.username);
      } else {
        await followUserHandler(post.user.username);
      }
    } catch (error) {
      // Error handled in handler
    }
  };

  const formatPostDate = (dateValue) => {
    if (!dateValue) return "New post";
    const postDate = new Date(dateValue);
    const now = Date.now();
    const diffInHours = Math.floor((now - postDate.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <article className="glass-surface overflow-hidden rounded-2xl">
      <header className="flex items-center justify-between p-4">
        <Link
          to={userProfilePath}
          className="flex items-center gap-3 rounded-lg p-1 transition hover:bg-white/40 dark:hover:bg-slate-700/40"
        >
          <img
            src={post.user?.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"}
            alt={`${post.user?.username || "user"} profile`}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white/80"
          />
          <div>
            <p className="text-sm font-semibold">{post.user?.username || "unknown"}</p>
            <p className="text-xs text-muted">{formatPostDate(post.createdAt)}</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          {/* Owner delete button moved to Feed */}
          {/* Follow button */}
          <Button
            type="button"
            size="sm"
            variant={post.isFollowing ? "secondary" : "primary"}
            onClick={handleFollowToggle}
          >
            {post.isFollowing ? "Following" : "Follow"}
          </Button>
        </div>
      </header>

      <div className="aspect-square w-full bg-slate-900/20">
        <img
          src={post.imgUrl}
          alt="post"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex items-center gap-3 px-4 pb-1 pt-3">
        <button
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${post.isLiked
              ? "text-red-500"
              : "text-[var(--text-primary)] hover:bg-white/50 dark:hover:bg-slate-700/50"
            }`}
          type="button"
          aria-label={post.isLiked ? "unlike post" : "like post"}
          onClick={handleLikeToggle}
        >
          {post.isLiked ? <FaHeart /> : <FaRegHeart />}
        </button>
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg text-[var(--text-primary)] transition hover:bg-white/50 dark:hover:bg-slate-700/50">
          <FaRegComment />
        </button>
      </div>

      {post.caption && (
        <p className="px-4 pb-4 text-sm leading-relaxed">
          <Link to={userProfilePath} className="mr-2 font-semibold hover:underline">
            {post.user?.username}
          </Link>
          <span className="text-muted">{post.caption}</span>
        </p>
      )}
    </article>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;

