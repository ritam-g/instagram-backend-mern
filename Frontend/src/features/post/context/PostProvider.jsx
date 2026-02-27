import React, { useState } from 'react'
import { PostContext } from './post.store'
function PostProvider({ children }) {
    const [loading, setloading] = useState(false)
    const [post, setpost] = useState(null)
    const [feed, setfeed] = useState([])
    const [error, setError] = useState("")
    
    return (
        <PostContext.Provider value={{loading,setloading,post,setpost,feed,setfeed,error,setError}}>
            {children}
        </PostContext.Provider>
    )
}

export default PostProvider
