import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'


function AppRoutes() {
    return (
        <main>

            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<h1>welcome brother</h1>} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />

                </Routes>
            </BrowserRouter>
        </main>
    )
}

export default AppRoutes
