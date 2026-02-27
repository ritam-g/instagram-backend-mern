import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

export async function getProfileByUsername(username) {
  const res = await api.get(`/api/users/profile/${username}`);
  return res.data;
}

export async function getPostsByUsername(username) {
  const res = await api.get(`/api/users/posts/${username}`);
  return res.data;
}
