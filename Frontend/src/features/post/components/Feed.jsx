import { useEffect, useRef, useState } from "react";
import { FaHeart, FaRegComment, FaRegHeart, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePost } from "../hooks/usePost";
import Button from "../../../components/ui/Button";
import StateCard from "../../../components/ui/StateCard";
import ConfirmModal from "../../../components/ui/ConfirmModal";

gsap.registerPlugin(ScrollTrigger);

function formatPostDate(dateValue) {
  if (!dateValue) {
    return "New post";
  }

  const postDate = new Date(dateValue);
  const now = Date.now();
  const diffInHours = Math.floor((now - postDate.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return "Just now";
  }

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return postDate.toLocaleDateString();
}

function Feed({ feeds = [] }) {
  const {
    likePostHandeller,
    unlikePostHandeller,
    deletePostHandeller,
    followUserHandler,
    unfollowUserHandler,
  } = usePost();

  const containerRef = useRef(null);
  const likeButtonRefs = useRef({});

  const [selectedPostId, setSelectedPostId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [followActionPostId, setFollowActionPostId] = useState("");

  useEffect(() => {
    if (!containerRef.current || feeds.length === 0) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".post-card").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [feeds]);

  const triggerLikeAnimation = (postId) => {
    if (likeButtonRefs.current[postId]) {
      gsap.fromTo(
        likeButtonRefs.current[postId],
        { scale: 1 },
        {
          scale: 1.25,
          yoyo: true,
          repeat: 1,
          duration: 0.13,
          ease: "power1.inOut",
        }
      );
    }
  };

  const handleLikeToggle = async (post) => {
    try {
      if (post.isLiked) {
        await unlikePostHandeller(post._id);
      } else {
        await likePostHandeller(post._id);
        triggerLikeAnimation(post._id);
      }
    } catch (error) {
      toast.error(error?.message || "Unable to update like");
    }
  };

  const handleFollowToggle = async (post) => {
    try {
      setFollowActionPostId(post._id);
      if (post.isFollowing) {
        await unfollowUserHandler(post.user.username);
        toast.success(`Unfollowed @${post.user.username}`);
      } else {
        await followUserHandler(post.user.username);
        toast.success(`Following @${post.user.username}`);
      }
    } catch (error) {
      toast.error(error?.message || "Unable to update follow status");
    } finally {
      setFollowActionPostId("");
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPostId) {
      return;
    }
    try {
      setDeleteLoading(true);
      const message = await deletePostHandeller(selectedPostId);
      toast.success(message || "Post deleted");
      setSelectedPostId("");
    } catch (error) {
      toast.error(error?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (!feeds.length) {
    return (
      <StateCard
        title="No posts yet"
        description="When users publish posts, your feed will appear here."
      />
    );
  }

  return (
    <section
      ref={containerRef}
      className="mx-auto flex w-full max-w-xl flex-col gap-5 pb-3"
    >
      {feeds.map((post) => {
        const userProfilePath = post.user?.username
          ? `/profile/${encodeURIComponent(post.user.username)}`
          : "/feed-page";

        return (
        <article
          key={post._id}
          className="post-card glass-surface overflow-hidden rounded-2xl"
        >
          <header className="flex items-center justify-between p-4">
            <Link
              to={userProfilePath}
              className="flex items-center gap-3 rounded-lg p-1 transition hover:bg-white/40 dark:hover:bg-slate-700/40"
            >
              <img
                src={
                  post.user?.profileImage ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                }
                alt={`${post.user?.username || "user"} profile`}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white/80"
              />
              <div>
                <p className="text-sm font-semibold">
                  {post.user?.username || "unknown"}
                </p>
                <p className="text-xs text-muted">{formatPostDate(post.createdAt)}</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {!post.isOwner && (
                <Button
                  type="button"
                  size="sm"
                  variant={post.isFollowing ? "secondary" : "primary"}
                  onClick={() => handleFollowToggle(post)}
                  isLoading={followActionPostId === post._id}
                >
                  {post.isFollowing ? "Following" : "Follow"}
                </Button>
              )}

              {post.isOwner && (
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/20"
                  type="button"
                  onClick={() => setSelectedPostId(post._id)}
                  aria-label="delete post"
                >
                  <FaTrash />
                </button>
              )}
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
              ref={(element) => {
                likeButtonRefs.current[post._id] = element;
              }}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg transition ${
                post.isLiked
                  ? "text-red-500"
                  : "text-[var(--text-primary)] hover:bg-white/50 dark:hover:bg-slate-700/50"
              }`}
              type="button"
              aria-label={post.isLiked ? "unlike post" : "like post"}
              onClick={() => handleLikeToggle(post)}
            >
              {post.isLiked ? <FaHeart /> : <FaRegHeart />}
            </button>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg text-[var(--text-primary)] transition hover:bg-white/50 dark:hover:bg-slate-700/50"
              type="button"
              aria-label="open comments"
            >
              <FaRegComment />
            </button>
          </div>

          {post.caption && (
            <p className="px-4 pb-4 text-sm leading-relaxed">
              <Link
                to={userProfilePath}
                className="mr-2 font-semibold hover:underline"
              >
                {post.user?.username}
              </Link>
              <span className="text-muted">{post.caption}</span>
            </p>
          )}
        </article>
        );
      })}

      <ConfirmModal
        open={Boolean(selectedPostId)}
        title="Delete post?"
        description="This action cannot be undone. Your post will be removed permanently."
        confirmLabel="Delete"
        onCancel={() => setSelectedPostId("")}
        onConfirm={handleDeletePost}
        isLoading={deleteLoading}
      />
    </section>
  );
}

export default Feed;
