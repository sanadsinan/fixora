import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    console.log("Login data:", { role, email, password });
    // Later we will send this to the backend
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
        >
          Log in
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