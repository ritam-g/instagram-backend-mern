import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePost } from "../hooks/usePost";
import Button from "../../../components/ui/Button";
import StateCard from "../../../components/ui/StateCard";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import PostCard from "./PostCard";

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

const Feed = React.memo(({ feeds = [] }) => {
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
      {feeds.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

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
});

Feed.displayName = 'Feed';
export default Feed;
