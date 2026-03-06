import React, { useState } from 'react'
import { PostContext } from './post.store'
function PostProvider({ children }) {
    const [loading, setloading] = useState(false)
    const [post, setpost] = useState(null)
    const [feed, setfeed] = useState([])
    const [error, setError] = useState("")
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false
    })

    return (
        <PostContext.Provider value={{
            loading,
            setloading,
            post,
            setpost,
            feed,
            setfeed,
            error,
            setError,
            pagination,
            setPagination
        }}>
            {children}
        </PostContext.Provider>
    )
}

export default PostProvider
