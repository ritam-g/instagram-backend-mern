import React, { createContext, useState } from 'react'
export const postContext = createContext()
function PostProvider({ children }) {
    const [loading, setloading] = useState(false)
    const [post, setpost] = useState(null)
    const [feed, setfeed] = useState(null)
    return (
        <postContext.Provider value={{loading,setloading,post,setpost,feed,setfeed}}>
            {children}
        </postContext.Provider>
    )
}

export default PostProvider
