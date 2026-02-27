import React from 'react'
import AppRoutes from './AppRoutes'
import AuthProvider from './features/auth/auth.context'
import PostProvider from './features/post/context/PostProvider'
import ThemeProvider from './features/theme/theme.context'


function App() {
  return (
    <>
      <AuthProvider>
        <PostProvider>
          <ThemeProvider>
            <AppRoutes />
          </ThemeProvider>
        </PostProvider>
      </AuthProvider>
    </>
  )
}

export default App
