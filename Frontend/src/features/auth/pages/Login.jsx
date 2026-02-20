// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../style/auth.scss";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handelLogin ,user } = useAuth()
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and Password are required");
      return;
    }
    const respone= await handelLogin(email, password)
    // console.log(respone);
    console.log(user);
    
    

  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Login</button>
        </form>

        <p>
          Don’t have an account?
          <Link to="/register"> Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
