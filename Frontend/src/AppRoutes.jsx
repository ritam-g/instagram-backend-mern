import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import FeedPage from './features/post/pages/FeedPage'
import CreatePost from './features/post/pages/CreatePost'
import ProfilePage from './features/profile/pages/ProfilePage'
import ProfileRedirect from './features/profile/components/ProfileRedirect'
import { Toaster } from "react-hot-toast";
import MainLayout from './components/layout/MainLayout'
import LandingPage from './features/landing/pages/LandingPage'

function AppRoutes() {
    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 2500,
                    style: {
                        borderRadius: "12px",
                        padding: "12px 14px",
                        border: "1px solid rgba(148, 163, 184, 0.25)",
                        background: "rgba(15, 23, 42, 0.92)",
                        color: "#f8fafc",
                    },
                }}
            />
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/login' element={<Login />} />

                <Route path='/register' element={<Register />} />

                <Route element={<MainLayout />}>
                    <Route path='/feed-page' element={<FeedPage />} />
                    <Route path='/createpost' element={<CreatePost />} />
                    <Route path='/profile' element={<ProfileRedirect />} />
                    <Route path='/profile/me' element={<ProfileRedirect />} />
                    <Route path='/profile/:username' element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
