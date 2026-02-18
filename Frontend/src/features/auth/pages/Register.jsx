import React, { useState } from 'react'
import { Link } from 'react-router'
import axios from 'axios'
import "../style/register.scss"
const Register = () => {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        { username, email, password },
        { withCredentials: true }
      )

      console.log("SUCCESS:", res.data)

    } catch (error) {
      console.log("ERROR:", error.response?.data?.message)
      alert(error.response?.data?.message)
    }
  }


  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit} >
          <input
            onInput={(e) => { setUsername(e.target.value) }}
            type="text"
            name='username'
            placeholder='Enter username' />
          <input
            onInput={(e) => { setEmail(e.target.value) }}
            type="text"
            name='email'
            placeholder='Enter email' />
          <input
            onInput={(e) => { setPassword(e.target.value) }}
            type="password"
            name='password'
            placeholder='Enter password' />
          <button>Register</button>
        </form>

        <p>Already have an account? <Link className='toggleAuthForm' to="/login">Login</Link></p>
      </div>
    </main>
  )
}

export default Register