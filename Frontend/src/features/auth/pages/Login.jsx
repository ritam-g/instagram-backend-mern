// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../style/auth.scss";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and Password are required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },{withCredentials:true}
      );

      console.log(res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
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
