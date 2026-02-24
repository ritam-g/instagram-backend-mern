import { useContext } from "react";
import { postContext } from "../context/PostProvider";
import { getAllPost } from "../services/post.api";

export function usePost() {
    const { loading, setloading, post, setpost, feed, setfeed } = useContext(postContext)
    async function getPostData() {
        try {
            setloading(true)
            const data = await getAllPost()  
            setfeed(data.posts)
        } catch (err) {
            console.log(err);
            
        }finally{
            setloading(false)
        }
    }
    return {getPostData,post,feed,loading}
}




