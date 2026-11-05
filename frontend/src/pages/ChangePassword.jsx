import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

function ChangePassword() {
  const { token } = useAuth();

  const [form, setForm] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
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

    setError("");
    setLoading(true);

    try {
      await api("/api/users/me/password", {
        method: "PUT",
        token,
        body: {
          currentPassword: form.current,
          newPassword: form.newPassword,
        },
      });
      setSuccess(true);
      setForm({ current: "", newPassword: "", confirm: "" });
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
          disabled={loading}
        >
          {loading ? "Updating..." : "Update password"}
        </button>

        <p className="m" style={{ marginTop: 16, textAlign: "center" }}>
          <Link to="/">Back to home</Link>
        </p>
      </form>
    </div>
  );
}

export default ChangePassword;