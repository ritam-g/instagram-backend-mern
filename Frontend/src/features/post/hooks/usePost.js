import { useContext } from "react";
import { postContext } from "../context/PostProvider";
import { createPost, deltePost, followUser, getAllPost ,likePost, unfollowUser, unlikePost} from "../services/post.api";

export function usePost() {
    const { loading, setloading, post, setpost, feed, setfeed } = useContext(postContext)
    async function getPostData() {
        try {
            setloading(true)
            const data = await getAllPost()
            setfeed(data.posts.reverse())
        } catch (err) {
            console.log(err);

        } finally {
            setloading(false)
        }
    }
    /**
     * @access it will return post and message
    */
    async function createPostHandeller(imageFile, caption) {

        const res = await createPost(imageFile, caption)
        return res

    }
    async function likePostHandeller(postId) {
       await likePost(postId)
       await getPostData()
    }
    async function unlikePostHandeller(postId) {
       await unlikePost(postId)
       await getPostData()
    }
    async function deletePostHandeller(postid) {
       const res= await deltePost(postid)
       return res.message
    }
    async function followUserHandler(username) {
       const res= await followUser(username)
       await getPostData()
       return res
    }
    async function unfollowUserHandler(username) {
       const res= await unfollowUser(username)
       await getPostData()
       return res
    }
    return {unfollowUserHandler, followUserHandler,getPostData,deletePostHandeller, post,unlikePostHandeller,likePostHandeller, feed,setfeed, loading,createPostHandeller }
}




