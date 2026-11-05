import { createContext, useContext, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);
const STORAGE_KEY = "fixora-auth";

// Read a saved login from the browser (or start logged out)
function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadSaved); // { token, user } or null

  const save = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setAuth(data);
    return data.user;
  };

  const login = async (email, password) =>
    save(await api("/api/auth/login", { method: "POST", body: { email, password } }));

  const register = async (form) =>
    save(await api("/api/auth/register", { method: "POST", body: form }));

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth ? auth.user : null,
        token: auth ? auth.token : null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}