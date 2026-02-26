import axios from 'axios'

// Use VITE_API_URL env var (set in .env.local for dev, or Render env for prod)
// Falls back to the deployed backend URL if env var is not set
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

export async function getAllPost() {
    try {
        const res = await api.get('/api/posts/get/feed');
        return res.data;
    } catch (err) {
        console.error("Fetch Posts Error:", err.response?.data || err.message);
        throw err;
    }
}

export async function createPost(image, caption) {
    try {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('caption', caption);
        const res = await api.post('/api/posts/', formData);
        return res.data;
    } catch (err) {
        console.error("Create Post Error:", err.response?.data || err.message);
        throw err;
    }
}

export async function likePost(postId) {
    try {
        const res = await api.post(`/api/posts/like/${postId}`);
        return res.data;
    } catch (err) {
        console.error("Like Post Error:", err.response?.data || err.message);
        throw err;
    }
}

export async function unlikePost(postId) {
    try {
        const res = await api.post(`/api/posts/unlike/${postId}`);
        return res.data;
    } catch (err) {
        console.error("Unlike Post Error:", err.response?.data || err.message);
        throw err;
    }
}

export async function deltePost(postid) {
    try {
        const res = await api.delete(`/api/posts/${postid}`);
        return res.data;
    } catch (err) {
        console.error("Delete Post Error:", err.response?.data || err.message);
        throw err;
    }
}

export async function followUser(username) {
    try {
        const res = await api.post(`/api/users/follow/${username}`);
        return res.data;
    } catch (err) {
        console.error("Follow User Error:", err.response?.data || err.message);
        throw err;
    }
}

export async function unfollowUser(username) {
    try {
        const res = await api.post(`/api/users/unfollow/${username}`);
        return res.data;
    } catch (err) {
        console.error("Unfollow User Error:", err.response?.data || err.message);
        throw err;
    }
}