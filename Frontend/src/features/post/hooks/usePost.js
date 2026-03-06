import { useContext } from "react";
import { PostContext } from "../context/post.store";
import {
  createPost,
  deltePost,
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

  async function getPostData(page = 1, isLoadMore = false) {
    try {
      if (!isLoadMore) setloading(true);
      setError("");
      const data = await getAllPost(page);

      if (isLoadMore) {
        setfeed((prev) => [...prev, ...(data.posts || [])]);
      } else {
        setfeed(data.posts || []);
      }

      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load feed");
    } finally {
      if (!isLoadMore) setloading(false);
    }
  }

  // ... (rest of the functions stay same, just ensure they are returned)

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
