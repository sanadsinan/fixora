import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    category: "Plumbing",
    experience: "",
    area: "",
    about: "",
  });

  // One function updates whichever field the user is typing in
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    console.log("Register data:", { role, ...form });
    // Later we will send this to the backend
  };

  return (
    <div className="wrap">
      <form
        className="card"
        style={{ maxWidth: 600, margin: "20px auto", padding: 32 }}
        onSubmit={handleSubmit}
      >
        <h2 style={{ fontSize: 26 }}>Create your account</h2>
        <p className="m" style={{ marginTop: 6 }}>
          Choose how you want to use Fixora.
        </p>

        {error && (
          <p className="b x" style={{ marginTop: 14 }}>
            {error}
          </p>
        )}

        {/* Role cards */}
        <div
          className="grid"
          style={{
            marginTop: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <button
            type="button"
            className={role === "customer" ? "role-card active" : "role-card"}
            onClick={() => setRole("customer")}
          >
            <b>Customer</b>
            <span className="m" style={{ display: "block", marginTop: 6 }}>
              I want to book local services.
            </span>
          </button>

          <button
            type="button"
            className={role === "provider" ? "role-card active" : "role-card"}
            onClick={() => setRole("provider")}
          >
            <b>Service provider</b>
            <span className="m" style={{ display: "block", marginTop: 6 }}>
              I want to offer services and get bookings.
            </span>
          </button>
        </div>

        {/* Fields for everyone */}
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          className="in"
          value={form.name}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="in"
          value={form.email}
          onChange={handleChange}
        />

        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          className="in"
          value={form.phone}
          onChange={handleChange}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="in"
          value={form.password}
          onChange={handleChange}
        />

        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="in"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        {/* Only shown when "Service provider" is selected */}
        {role === "provider" && (
          <div className="provider-fields">
            <h3 style={{ marginTop: 18, fontSize: 18 }}>Provider details</h3>

            <label htmlFor="category">Service category</label>
            <select
              id="category"
              name="category"
              className="in"
              value={form.category}
              onChange={handleChange}
            >
              <option>Plumbing</option>
              <option>Electrical</option>
              <option>Cleaning</option>
            </select>

            <label htmlFor="experience">Experience (years)</label>
            <input
              id="experience"
              name="experience"
              className="in"
              value={form.experience}
              onChange={handleChange}
            />

            <label htmlFor="area">Working area</label>
            <input
              id="area"
              name="area"
              className="in"
              value={form.area}
              onChange={handleChange}
            />

            <label htmlFor="about">About your service</label>
            <textarea
              id="about"
              name="about"
              className="in"
              rows="3"
              value={form.about}
              onChange={handleChange}
            />

            <p className="m" style={{ marginTop: 10 }}>
              New providers are reviewed by an admin before going live.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="btn"
          style={{ display: "block", width: "100%", marginTop: 24 }}
        >
          Create account
        </button>

        <p className="m" style={{ marginTop: 16, textAlign: "center" }}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;