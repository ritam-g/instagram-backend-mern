import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import Button from "../../../components/ui/Button";
import InputField from "../../../components/ui/InputField";
import { usePageReveal } from "../../../hooks/usePageReveal";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { handleRegister, loading } = useAuth();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  usePageReveal(pageRef, []);

  const validateForm = () => {
    const nextErrors = {};

    if (!username.trim()) {
      nextErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      nextErrors.username = "Username must be at least 3 characters";
    }

    if (!email) {
      nextErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Enter a valid email";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await handleRegister(username.trim(), email, password);
      toast.success("Account created successfully");
      navigate("/feed-page");
    } catch (error) {
      toast.error(error?.message || "Unable to register");
    }
  };

  return (
    <div className="auth-shell px-4">
      <section ref={pageRef} className="glass-surface w-full max-w-md rounded-3xl p-6 sm:p-8">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
          Instagram Clone
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-sm text-muted">Set up your profile and start sharing posts.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <InputField
            label="Username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            error={errors.username}
          />

          <InputField
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
          />

          <InputField
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={errors.password}
          />

          <Button type="submit" isLoading={loading} className="w-full">
            Create account
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[var(--accent)] hover:underline">
            Login
          </Link>
        </p>
      </section>
    </div>
  );
}

export default Register;
