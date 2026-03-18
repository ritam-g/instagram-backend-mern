import { useContext, useRef, useCallback } from "react";
import { PostContext } from "../context/post.store";
import {
  createPost,
  deletePost,
  followUser,
  getAllPost,
  likePost,
  unfollowUser,
  unlikePost,
} from "../services/post.api";

export function usePost() {
  const {
    loading,
    setloading,
    post,
    setpost,
    feed,
    setfeed,
    error,
    setError,
    pagination,
    setPagination
  } = useContext(PostContext);

  const cache = useRef(new Map());

  const getPostData = useCallback(async (page = 1, isLoadMore = false) => {
    if (cache.current.has(page)) return; // Dedup

    const controller = new AbortController();
    try {
      if (!isLoadMore) setloading(true);
      setError("");
      const data = await getAllPost(page, 10, controller.signal);

      if (!data) return; // Aborted

      cache.current.set(page, data);

      if (isLoadMore) {
        setfeed((prev) => [...prev, ...(data.posts || [])]);
      } else {
        setfeed(data.posts || []);
      }

      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err?.response?.data?.message || "Failed to load feed");
      }
    } finally {
      if (!isLoadMore) setloading(false);
    }
  }, [setloading, setError, setfeed, setPagination]);

  const createPostHandeller = useCallback(async (imageFile, caption) => {
    try {
      const res = await createPost(imageFile, caption);
      setError("");
      return res;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create post");
      throw err;
    }
  }, [setError]);

  const likePostHandeller = useCallback(async (postId) => {
    try {
      await likePost(postId);
      setfeed((prevFeed) =>
        prevFeed.map((singlePost) =>
          singlePost._id === postId
            ? { ...singlePost, isLiked: true }
            : singlePost
        )
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to like post");
      throw err;
    }
  }, [setfeed, setError]);

  async function unlikePostHandeller(postId) {
    try {
      await unlikePost(postId);
      setfeed((prevFeed) =>
        prevFeed.map((singlePost) =>
          singlePost._id === postId
            ? { ...singlePost, isLiked: false }
            : singlePost
        )
      );
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to unlike post");
      throw err;
    }
  }

  async function deletePostHandeller(postid) {
    try {
      const controller = new AbortController();
      const res = await deletePost(postid, controller.signal);
      if (!res) return; // Aborted
      setfeed((prevFeed) => prevFeed.filter((singlePost) => singlePost._id !== postid));
      return res.message;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err?.response?.data?.message || "Failed to delete post");
        throw err;
      }
    }
  }

  async function followUserHandler(username) {
    try {
      const res = await followUser(username);
      setfeed((prevFeed) =>
        prevFeed.map((singlePost) =>
          singlePost.user?.username === username
            ? { ...singlePost, isFollowing: true }
            : singlePost
        )
      );
      return res;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to follow user");
      throw err;
    }
  }

  async function unfollowUserHandler(username) {
    try {
      const res = await unfollowUser(username);
      setfeed((prevFeed) =>
        prevFeed.map((singlePost) =>
          singlePost.user?.username === username
            ? { ...singlePost, isFollowing: false }
            : singlePost
        )
      );
      return res;
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to unfollow user");
      throw err;
    }
  }

  return {
    unfollowUserHandler,
    followUserHandler,
    getPostData,
    deletePostHandeller,
    post,
    setpost,
    unlikePostHandeller,
    likePostHandeller,
    feed,
    setfeed,
    loading,
    error,
    createPostHandeller,
    pagination,
  };
}
