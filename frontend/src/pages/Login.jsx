import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Where each type of account goes after logging in


function Login() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from; // the page that sent us to log in

  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setError("Please fill in all fields.");
    return;
  }

  setError("");
  setLoading(true);

  try {
    const user = await login(email, password);

    // The toggle must match the account (admins can use either).
    // A customer who applied as a provider can use both.
      if (user.role !== "admin") {
        const allowed = role === "customer" ? user.role === "customer" : user.isProvider;

        if (!allowed) {
          logout();
          setError(
            role === "customer"
              ? 'This is a provider account. Please choose "Service provider" above.'
              : 'This account is not a provider. Please choose "Customer" above.'
          );
          return;
        }
      }

    if (user.role === "admin") navigate("/admin");
    else if (role === "provider") navigate("/provider");
    else navigate(from || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap">
      <form
        className="card"
        style={{ maxWidth: 440, margin: "20px auto" }}
        onSubmit={handleSubmit}
      >
        <h2>Welcome back</h2>
        <p className="m" style={{ marginTop: 6 }}>
          Log in to your Fixora account.
        </p>

        {error && (
          <p className="b x" style={{ marginTop: 14 }}>
            {error}
          </p>
        )}

        <label>Log in as</label>
        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button
            type="button"
            className={role === "customer" ? "btn" : "btn btn2"}
            style={{ flex: 1 }}
            onClick={() => setRole("customer")}
          >
            Customer
          </button>
          <button
            type="button"
            className={role === "provider" ? "btn" : "btn btn2"}
            style={{ flex: 1 }}
            onClick={() => setRole("provider")}
          >
            Service provider
          </button>
        </div>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          className="in"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          className="in"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="btn"
          style={{ display: "block", width: "100%", marginTop: 22 }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="m" style={{ marginTop: 16, textAlign: "center" }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
        <p className="m" style={{ marginTop: 10, textAlign: "center" }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;