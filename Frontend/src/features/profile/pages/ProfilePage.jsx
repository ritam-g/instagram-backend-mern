import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Button from "../../../components/ui/Button";
import StateCard from "../../../components/ui/StateCard";
import SkeletonPostCard from "../../../components/ui/SkeletonPostCard";
import { usePageReveal } from "../../../hooks/usePageReveal";
import { useAuth } from "../../auth/hooks/useAuth";
import {
  getPostsByUsername,
  getProfileByUsername,
} from "../services/profile.api";
import {
  followUser,
  likePost,
  unfollowUser,
  unlikePost,
} from "../../post/services/post.api";

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }
  return new Date(dateValue).toLocaleDateString();
}

function ProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();
  const resolvedUsername =
    username === "me" ? user?.username || "" : decodeURIComponent(username || "");

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followLoading, setFollowLoading] = useState(false);

  const pageRef = useRef(null);

  usePageReveal(pageRef, [username]);

  const loadProfileData = async () => {
    if (!resolvedUsername) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [profileData, postsData] = await Promise.all([
        getProfileByUsername(resolvedUsername),
        getPostsByUsername(resolvedUsername),
      ]);

      setProfile(profileData.profile);
      setPosts(postsData.posts || []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [resolvedUsername]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFollowToggle = async () => {
    if (!profile || profile.isOwner) {
      return;
    }

    try {
      setFollowLoading(true);
      if (profile.isFollowing) {
        await unfollowUser(profile.username);
        setProfile((prev) => ({
          ...prev,
          isFollowing: false,
          followersCount: Math.max(0, prev.followersCount - 1),
        }));
        toast.success(`Unfollowed @${profile.username}`);
      } else {
        await followUser(profile.username);
        setProfile((prev) => ({
          ...prev,
          isFollowing: true,
          followersCount: prev.followersCount + 1,
        }));
        toast.success(`Following @${profile.username}`);
      }
    } catch (requestError) {
      toast.error(requestError?.response?.data?.message || "Unable to update follow");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLikeToggle = async (post) => {
    try {
      if (post.isLiked) {
        await unlikePost(post._id);
      } else {
        await likePost(post._id);
      }

      setPosts((prevPosts) =>
        prevPosts.map((singlePost) =>
          singlePost._id === post._id
            ? { ...singlePost, isLiked: !singlePost.isLiked }
            : singlePost
        )
      );
    } catch (requestError) {
      toast.error(requestError?.response?.data?.message || "Unable to update like");
    }
  };

  if (loading) {
    return (
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-5">
        <div className="glass-surface rounded-2xl p-6">
          <div className="h-8 w-40 animate-pulse rounded bg-slate-300/60 dark:bg-slate-700/60" />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="h-16 animate-pulse rounded bg-slate-300/60 dark:bg-slate-700/60" />
            <div className="h-16 animate-pulse rounded bg-slate-300/60 dark:bg-slate-700/60" />
            <div className="h-16 animate-pulse rounded bg-slate-300/60 dark:bg-slate-700/60" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonPostCard />
          <SkeletonPostCard />
          <SkeletonPostCard />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <StateCard
        title="Profile unavailable"
        description={error}
        action={
          <Button type="button" onClick={loadProfileData}>
            Retry
          </Button>
        }
      />
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <section ref={pageRef} className="mx-auto w-full max-w-4xl space-y-6 pb-4">
      <div className="glass-surface rounded-2xl p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={profile.profileImage}
              alt={`${profile.username} profile`}
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/70"
            />
            <div>
              <h1 className="font-display text-2xl font-bold">@{profile.username}</h1>
              {profile.bio ? (
                <p className="mt-1 text-sm text-muted">{profile.bio}</p>
              ) : (
                <p className="mt-1 text-sm text-muted">No bio added yet.</p>
              )}
              {profile.isOwner && profile.email && (
                <p className="mt-1 text-xs text-muted">{profile.email}</p>
              )}
            </div>
          </div>

          {!profile.isOwner && user && (
            <Button
              type="button"
              onClick={handleFollowToggle}
              isLoading={followLoading}
              variant={profile.isFollowing ? "secondary" : "primary"}
            >
              {profile.isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-white/55 p-3 dark:bg-slate-800/55">
            <p className="text-xl font-bold">{profile.postsCount}</p>
            <p className="text-xs text-muted">Posts</p>
          </div>
          <div className="rounded-xl bg-white/55 p-3 dark:bg-slate-800/55">
            <p className="text-xl font-bold">{profile.followersCount}</p>
            <p className="text-xs text-muted">Followers</p>
          </div>
          <div className="rounded-xl bg-white/55 p-3 dark:bg-slate-800/55">
            <p className="text-xl font-bold">{profile.followingCount}</p>
            <p className="text-xs text-muted">Following</p>
          </div>
        </div>
      </div>

      {!posts.length ? (
        <StateCard
          title="No posts yet"
          description="This profile has not published any posts yet."
          action={
            profile.isOwner ? (
              <Link to="/createpost">
                <Button type="button">Create your first post</Button>
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post._id} className="glass-surface overflow-hidden rounded-2xl">
              <div className="aspect-square w-full bg-slate-950/15">
                <img
                  src={post.imgUrl}
                  alt="post"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="space-y-2 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted">{formatDate(post.createdAt)}</p>
                  <button
                    type="button"
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-base transition ${
                      post.isLiked
                        ? "text-red-500"
                        : "text-[var(--text-primary)] hover:bg-white/60 dark:hover:bg-slate-700/60"
                    }`}
                    onClick={() => handleLikeToggle(post)}
                    aria-label={post.isLiked ? "unlike" : "like"}
                  >
                    {post.isLiked ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
                {post.caption && (
                  <p className="max-h-16 overflow-hidden text-sm text-muted">{post.caption}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProfilePage;
