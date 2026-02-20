import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api/auth',
    withCredentials: true
})
/**
 * 
 * @param {*} username 
 * @param {*} email 
 * @param {*} password 
 * @returns new user data 
 */
async function register(username, email, password) {

    try {
        const res = await api.post('/register', { username, email, password })
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
        const res = await api.post('/login', { email, password })
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
        const res = await api.get('/get-me')
        return res.data
    } catch (err) {
        throw err
    }
}

export { register, login, getMe }