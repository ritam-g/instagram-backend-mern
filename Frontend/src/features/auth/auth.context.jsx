import React, { useEffect, useState } from "react";
import { register, login, getMe } from "./services/auth.api.jsx";
import { AuthContext } from "./auth.store";

function getErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || fallbackMessage;
}

function AuthProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function hydrateUser() {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        setUser(null);
      }
    }
    hydrateUser();
  }, []);

  async function handleLogin(email, password) {
    setLoading(true);
    try {
      const response = await login(email, password);
      setUser(response.user);
      return response.user;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to login"));
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(username, email, password) {
    setLoading(true);
    try {
      const response = await register(username, email, password);
      setUser(response.user);
      return response.user;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Unable to register"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        handleLogin,
        handleRegister,
        // Backward compatibility with existing misspelled names.
        handelLogin: handleLogin,
        handelRegiester: handleRegister,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
