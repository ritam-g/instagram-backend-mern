import { useContext } from "react";
import { postContext } from "../context/PostProvider";
import { createPost, getAllPost ,likePost, unlikePost} from "../services/post.api";

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
    return { getPostData, post,unlikePostHandeller,likePostHandeller, feed,setfeed, loading,createPostHandeller }
}




