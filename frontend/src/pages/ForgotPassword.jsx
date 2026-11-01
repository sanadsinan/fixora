import { useState } from "react";
import { Link } from "react-router-dom";
import "./ExtraPages.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // A simple check: something@something.something
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      setSent(false);
      return;
    }

    setError("");
    setSent(true);
    console.log("Reset link requested for:", email);
    // Later we will send this to the backend
  };

  return (
    <div className="wrap">
      <form
        className="card"
        style={{ maxWidth: 440, margin: "20px auto", padding: 32 }}
        onSubmit={handleSubmit}
      >
        <h2 style={{ fontSize: 26 }}>Forgot your password?</h2>
        <p className="m" style={{ marginTop: 6 }}>
          Enter your email and we will send you a link to reset it.
        </p>

        {error && (
          <p className="b x" style={{ marginTop: 14 }}>
            {error}
          </p>
        )}
        {sent && (
          <p className="notice">
            If an account exists for {email}, a reset link is on its way. Check
            your inbox.
          </p>
        )}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="in"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          className="btn"
          style={{ display: "block", width: "100%", marginTop: 22 }}
        >
          Send reset link
        </button>

        <p className="m" style={{ marginTop: 16, textAlign: "center" }}>
          <Link to="/login">Back to login</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;