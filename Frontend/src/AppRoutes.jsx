import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import FeedPage from './features/post/pages/FeedPage'
import CreatePost from './features/post/pages/CreatePost'
import { Toaster } from "react-hot-toast";
import Nav from './features/post/components/Nav'

function AppRoutes() {
    return (
        <main>
            <Toaster />
            
            <BrowserRouter>
            <Nav/>
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='/feed-page' element={<FeedPage />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/createpost' element={<CreatePost />} />

                </Routes>
            </BrowserRouter>
        </main>
    )
}

export default AppRoutes
