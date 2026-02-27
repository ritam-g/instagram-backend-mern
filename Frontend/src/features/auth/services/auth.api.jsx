import axios from 'axios'

// Use VITE_API_URL env var (set in .env.local for dev, or Render env for prod)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true
})
/**
 * 
 * @param {*} username 
 * @param {*} email 
 * @param {*} password 
 * @returns new user data 
 */
async function register(username = 'default', email, password) {
    const res = await api.post('/api/auth/register', { username, email, password })
    return res.data
}
/**
 * 
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
async function login(email, password) {
    const res = await api.post('/api/auth/login', { email, password })
    return res.data
}
/**
 * 
 * @returns user detials 
 */
async function getMe() {
    const res = await api.get('/api/auth/get-me')
    return res.data
}

export { register, login, getMe }
