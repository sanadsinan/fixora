import { useState } from "react";
import { Link } from "react-router-dom";
import { categories, reviews } from "../data/providers";
import "./ProviderPages.css";

// Dummy: we pretend the logged-in provider is the one with id 1
const myId = 1;
const myReviews = reviews.filter((r) => r.providerId === myId);
const averageRating = myReviews.length
  ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
  : "–";

function ProviderProfile() {
  const [profile, setProfile] = useState({
    name: "Rahul Nair",
    category: "Plumbing",
    experience: "8",
    area: "Kochi",
    phone: "9876543210",
    about: "Pipe repairs, leak fixing and bathroom fittings.",
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!profile.name || !profile.phone || !profile.area) {
      setError("Name, phone and working area are required.");
      setSaved(false);
      return;
    }

    setError("");
    setSaved(true);
    console.log("Provider profile:", profile);
    // Later we will send this to the backend
  };

  return (
    <div>
      <div className="page-head">
        <h1 style={{ fontSize: 26 }}>Provider profile</h1>
      </div>

      <div className="pp-layout">
        <form className="card pp-main" onSubmit={handleSubmit}>
          <div className="avatar-row">
            <div className="ph avatar-lg">Photo</div>
            <button type="button" className="btn btn2 btn-sm">
              Change photo
            </button>
          </div>

          {error && (
            <p className="b x" style={{ marginTop: 14 }}>
              {error}
            </p>
          )}
          {saved && (
            <p className="b ok" style={{ marginTop: 14 }}>
              Profile saved.
            </p>
          )}

          <label htmlFor="name">Business / full name</label>
          <input
            id="name"
            name="name"
            className="in"
            value={profile.name}
            onChange={handleChange}
          />

          <label htmlFor="category">Service category</label>
          <select
            id="category"
            name="category"
            className="in"
            value={profile.category}
            onChange={handleChange}
          >
            {categories.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>

          <label htmlFor="experience">Experience (years)</label>
          <input
            id="experience"
            name="experience"
            className="in"
            value={profile.experience}
            onChange={handleChange}
          />

          <label htmlFor="area">Working area</label>
          <input
            id="area"
            name="area"
            className="in"
            value={profile.area}
            onChange={handleChange}
          />

          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            className="in"
            value={profile.phone}
            onChange={handleChange}
          />

          <label htmlFor="about">About your service</label>
          <textarea
            id="about"
            name="about"
            rows="2"
            className="in"
            value={profile.about}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn"
            style={{ display: "block", width: "100%", marginTop: 22 }}
          >
            Save profile
          </button>
        </form>

        <div className="pp-side">
          <div className="card">
            <h3>Rating</h3>
            <h2 style={{ marginTop: 6 }}>★ {averageRating}</h2>
            <p className="m" style={{ marginTop: 4 }}>
              From {myReviews.length} reviews
            </p>
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <h3>Account</h3>
            <p className="m" style={{ marginTop: 6 }}>
              Status: <span className="b ok">Approved</span>
            </p>
            <Link
              className="btn btn2"
              to="/change-password"
              style={{ display: "block", textAlign: "center", marginTop: 16 }}
            >
              Change password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProviderProfile;