import axios from 'axios'

const api = axios.create({
    baseURL: "http://localhost:3000/api/posts",
    withCredentials: true
})
export async function getAllPost() {
    const res = await api.get('/get/feed')
    return res.data
}
export async function createPost(image, caption) {
    /**for the file folder case we have to main tain this structure  */
    const formData = new FormData()

    formData.append('image', image)
    formData.append('caption', caption)
    const res = await api.post('/', formData)
    return res.data

}
export async function likePost(postId) {
    const res = await api.post(`/like/${postId}`)
    return res.data
}
export async function unlikePost(postId) {
    const res = await api.post(`/unlike/${postId}`)
    return res.data
}
export async function deltePost(postid) {
    const res = await api.delete(`/${postid}`)
    return res.data
}