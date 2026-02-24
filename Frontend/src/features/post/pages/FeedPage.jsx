import React, { useEffect } from 'react'
import Feed from '../components/Feed'
import { usePost } from '../hooks/usePost'
import '../components/feed.scss'
function FeedPage() {
 const {getPostData,post,feed,loading}= usePost()
  useEffect(() => {
    getPostData()
  }, [])
  if(loading){
    return (<section>loading....</section>)
  }
  return (
    <section>

      <Feed feeds={feed} />

    </section>
  )
}

export default FeedPage
