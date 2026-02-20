import React, { createContext, useState } from 'react'
import { register, login } from './services/auth.api.jsx'
export const AuthContext = createContext()
function AuthProvider({ children }) {
    const [loading, setloading] = useState(false)
    const [user, setuser] = useState(null)

    async function handelLogin(email, password) {
        setloading(true)
        try {
            const response = await login(email, password)
            setuser(response.user)
            return response.user
        } catch (err) {
            console.log(err);
        } finally {
            setloading(false)
        }
    }
    async function handelRegiester(username, email, password) {
        setloading(true)
        try {
            const response = await register(username, email, password)
            setuser(response.user)
        } catch (err) {
            console.log(err);

        } finally {
            setloading(false)
        }
    }
    return (
        <AuthContext.Provider
            value={{ handelLogin, handelRegiester, user, loading }}
        >
            {children}
        </AuthContext.Provider>

    )
}

export default AuthProvider
