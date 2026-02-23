import React from 'react'
import AppRoutes from './AppRoutes'
import AuthProvider from './features/auth/auth.context'
import PostProvider from './features/post/context/PostProvider'

function App() {
  return (
    <>
      <AuthProvider>
        <PostProvider>
          <AppRoutes />
        </PostProvider>

      </AuthProvider>

    </>
  )
}

export default App
