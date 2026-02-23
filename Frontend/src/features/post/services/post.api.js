import axios from 'axios'

const api=axios.create({
    baseURL:"http://localhost:3000/api/posts",
    withCredentials:true
})
export async function getAllPost() {
   const res= await api.get('/get/feed')
   return res.data
}