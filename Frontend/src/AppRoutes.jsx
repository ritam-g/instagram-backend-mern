import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './features/auth/Login'

function AppRoutes() {
    return (
        <main>
            <BrowserRouter>
                <Routes>
                        <Route path='/login' element={<Login/>}/>
                </Routes>
            </BrowserRouter>
        </main>
    )
}

export default AppRoutes
