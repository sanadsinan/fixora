import { useState } from "react";
import { Link } from "react-router-dom";

function ChangePassword() {
  const [form, setForm] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(false);

    if (!form.current || !form.newPassword || !form.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (form.newPassword !== form.confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (form.newPassword === form.current) {
      setError("New password must be different from the current one.");
      return;
    }

    setError("");
    setSuccess(true);
    setForm({ current: "", newPassword: "", confirm: "" });
    // Later we will send this to the backend (never log passwords!)
  };

  return (
    <div className="wrap">
      <form
        className="card"
        style={{ maxWidth: 440, margin: "20px auto", padding: 32 }}
        onSubmit={handleSubmit}
      >
        <h2 style={{ fontSize: 26 }}>Change password</h2>
        <p className="m" style={{ marginTop: 6 }}>
          Enter your current password, then choose a new one.
        </p>

        {error && (
          <p className="b x" style={{ marginTop: 14 }}>
            {error}
          </p>
        )}
        {success && (
          <p className="b ok" style={{ marginTop: 14 }}>
            Password updated.
          </p>
        )}

        <label htmlFor="current">Current password</label>
        <input
          id="current"
          name="current"
          type="password"
          className="in"
          value={form.current}
          onChange={handleChange}
        />

        <label htmlFor="newPassword">New password</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          className="in"
          value={form.newPassword}
          onChange={handleChange}
        />

        <label htmlFor="confirm">Confirm new password</label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          className="in"
          value={form.confirm}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="btn"
          style={{ display: "block", width: "100%", marginTop: 24 }}
        >
          Update password
        </button>

        <p className="m" style={{ marginTop: 16, textAlign: "center" }}>
          <Link to="/profile">Back to profile</Link>
        </p>
      </form>
    </div>
  );
}

export default ChangePassword;