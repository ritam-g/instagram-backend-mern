import axios from 'axios'

// Use VITE_API_URL env var (set in .env.local for dev, or Render env for prod)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})
/**
 * 
 * @param {*} username 
 * @param {*} email 
 * @param {*} password 
 * @returns new user data 
 */
async function register(username = 'defalut', email, password) {

    try {
        const res = await api.post('/api/auth/register', { username, email, password })
        return res.data

    } catch (err) {

        throw err
    }
}
/**
 * 
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
async function login(email, password) {
    try {
        const res = await api.post('/api/auth/login', { email, password })
        return res.data

    } catch (err) {
        throw err
    }
}
/**
 * 
 * @returns user detials 
 */
async function getMe() {
    try {
        const res = await api.get('/api/auth/get-me')
        return res.data
    } catch (err) {
        throw err
    }
}

export { register, login, getMe }