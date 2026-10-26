import { useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "../data/providers";
import "./Profile.css";

function Profile() {
  // Dummy details for now. Later they come from the logged-in user.
  const [profile, setProfile] = useState({
    name: "Arun S",
    email: "arun@example.com",
    phone: "9876543210",
    address: "Kochi, Kerala",
  });
  const [profileError, setProfileError] = useState("");
  const [saved, setSaved] = useState(false);

  const [provider, setProvider] = useState({
    category: categories[0],
    experience: "",
    area: "",
  });
  const [providerError, setProviderError] = useState("");
  const [requested, setRequested] = useState(false);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleProviderChange = (e) => {
    setProvider({ ...provider, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!profile.name || !profile.email || !profile.phone) {
      setProfileError("Name, email and phone are required.");
      setSaved(false);
      return;
    }

    setProfileError("");
    setSaved(true);
    console.log("Profile data:", profile);
    // Later we will send this to the backend
  };

  const handleBecomeProvider = (e) => {
    e.preventDefault();

    if (!provider.experience || !provider.area) {
      setProviderError("Please fill in your experience and working area.");
      return;
    }

    setProviderError("");
    setRequested(true);
    console.log("Provider request:", provider);
    // Later we will send this to the backend
  };

  return (
    <div className="wrap">
      <h1 style={{ fontSize: 28 }}>My profile</h1>

      <div className="profile-layout">
        {/* Left column */}
        <div className="profile-col">
          <form className="card" onSubmit={handleSave}>
            <h2 style={{ fontSize: 20 }}>Personal details</h2>

            {profileError && (
              <p className="b x" style={{ marginTop: 14 }}>
                {profileError}
              </p>
            )}
            {saved && (
              <p className="b ok" style={{ marginTop: 14 }}>
                Profile updated.
              </p>
            )}

            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              className="in"
              value={profile.name}
              onChange={handleProfileChange}
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="in"
              value={profile.email}
              onChange={handleProfileChange}
            />

            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              className="in"
              value={profile.phone}
              onChange={handleProfileChange}
            />

            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              rows="2"
              className="in"
              value={profile.address}
              onChange={handleProfileChange}
            />

            <button
              type="submit"
              className="btn"
              style={{ display: "block", width: "100%", marginTop: 22 }}
            >
              Save changes
            </button>
          </form>

          <div className="card password-row" style={{ marginTop: 20 }}>
            <div>
              <h2 style={{ fontSize: 20 }}>Password</h2>
              <p className="m" style={{ marginTop: 4 }}>
                Keep your account secure.
              </p>
            </div>
            <Link className="btn btn2" to="/change-password">
              Change password
            </Link>
          </div>
        </div>

        {/* Right column */}
        <div className="profile-col">
          <form className="card become-card" onSubmit={handleBecomeProvider}>
            <h2 style={{ fontSize: 20 }}>Want to offer services too?</h2>
            <p className="m" style={{ marginTop: 6 }}>
              Use the same account to become a service provider and receive
              bookings.
            </p>

            {providerError && (
              <p className="b x" style={{ marginTop: 14 }}>
                {providerError}
              </p>
            )}

            <label htmlFor="category">Service category</label>
            <select
              id="category"
              name="category"
              className="in"
              value={provider.category}
              onChange={handleProviderChange}
              disabled={requested}
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
              value={provider.experience}
              onChange={handleProviderChange}
              disabled={requested}
            />

            <label htmlFor="area">Working area</label>
            <input
              id="area"
              name="area"
              className="in"
              value={provider.area}
              onChange={handleProviderChange}
              disabled={requested}
            />

            <button
              type="submit"
              className="btn"
              style={{ display: "block", width: "100%", marginTop: 22 }}
              disabled={requested}
            >
              {requested ? "Request sent" : "Become a provider"}
            </button>

            <p className="m" style={{ marginTop: 12 }}>
              An admin will review your request.
              {requested && (
                <>
                  {" "}
                  Status: <span className="b w">Pending approval</span>
                </>
              )}
            </p>
          </form>

          <div className="card" style={{ marginTop: 20 }}>
            <h3>Already a provider?</h3>
            <p className="m" style={{ marginTop: 6 }}>
              Switch between customer and provider mode anytime.
            </p>
            <Link
              className="btn btn2"
              to="/provider"
              style={{ display: "block", textAlign: "center", marginTop: 22 }}
            >
              Go to provider dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
