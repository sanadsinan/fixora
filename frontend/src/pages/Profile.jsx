import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { categories } from "../data/providers";
import "./Profile.css";
import PhotoUpload from "../components/PhotoUpload";

const statusBadge = { pending: "b w", approved: "b ok", rejected: "b x" };
const statusLabel = {
  pending: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
};

function Profile() {
  const { user, token, updateUser } = useAuth();

  // ----- Personal details -----
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // ----- Become a provider -----
  const [application, setApplication] = useState({
    category: categories[0],
    experience: "",
    area: "",
  });
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");

  // Load my real details from the server when the page opens
  useEffect(() => {
    api("/api/users/me", { token })
      .then((data) => {
        setProfile({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          address: data.address || "",
        });
        setPhoto(data.photo || "");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    // Refresh the provider status too (an admin may have approved it)
    api("/api/auth/me", { token })
      .then((me) =>
        updateUser({ isProvider: me.isProvider, approvalStatus: me.approvalStatus })
      )
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!profile.name.trim() || !profile.phone.trim()) {
      setError("Name and phone are required.");
      setSaved(false);
      return;
    }

    setError("");
    setSaving(true);

    try {
      const data = await api("/api/users/me", {
        method: "PUT",
        token,
        body: {
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          photo,
        },
      });
      updateUser({ name: data.name, photo: data.photo }); // the navbar shows them
      setSaved(true);
    } catch (err) {
      setError(err.message);
      setSaved(false);
    } finally {
      setSaving(false);
    }
  };

  const handleApplicationChange = (e) => {
    setApplication({ ...application, [e.target.name]: e.target.value });
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!application.experience || !application.area.trim()) {
      setApplyError("Please fill in your experience and working area.");
      return;
    }

    setApplyError("");
    setApplying(true);

    try {
      await api("/api/providers/apply", {
        method: "POST",
        token,
        body: application,
      });
      // The account is now a provider too, waiting for approval
      updateUser({ isProvider: true, approvalStatus: "pending" });
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="wrap">
        <p className="m">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="wrap">
      <h1 style={{ fontSize: 28 }}>My profile</h1>

      <div className="profile-layout">
        {/* Left column */}
        <div className="profile-col">
          <form className="card" onSubmit={handleSave}>
            <h2 style={{ fontSize: 20 }}>Personal details</h2>
              <PhotoUpload
                photo={photo}
                name={profile.name}
                onChange={(p) => {
                  setPhoto(p);
                  setSaved(false);
                }}
              />

            {error && (
              <p className="b x" style={{ marginTop: 14 }}>
                {error}
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
              onChange={handleChange}
            />

            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="in"
              value={profile.email}
              disabled
              title="Your email is your login and cannot be changed here"
            />

            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              className="in"
              value={profile.phone}
              onChange={handleChange}
            />

            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              rows="2"
              className="in"
              value={profile.address}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="btn"
              style={{ display: "block", width: "100%", marginTop: 22 }}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save changes"}
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
          {user?.isProvider ? (
            <div className="card become-card">
              <h2 style={{ fontSize: 20 }}>You are also a provider</h2>
              <p className="m" style={{ marginTop: 6 }}>
                Status:{" "}
                <span className={statusBadge[user.approvalStatus] || "b w"}>
                  {statusLabel[user.approvalStatus] || "Pending approval"}
                </span>
              </p>
              <p className="m" style={{ marginTop: 8 }}>
                You can switch between customer and provider mode anytime.
              </p>
              <Link
                className="btn"
                to="/provider"
                style={{ display: "block", textAlign: "center", marginTop: 22 }}
              >
                Go to provider dashboard
              </Link>
            </div>
          ) : (
            <form className="card become-card" onSubmit={handleApply}>
              <h2 style={{ fontSize: 20 }}>Want to offer services too?</h2>
              <p className="m" style={{ marginTop: 6 }}>
                Use the same account to become a service provider and receive
                bookings.
              </p>

              {applyError && (
                <p className="b x" style={{ marginTop: 14 }}>
                  {applyError}
                </p>
              )}

              <label htmlFor="category">Service category</label>
              <select
                id="category"
                name="category"
                className="in"
                value={application.category}
                onChange={handleApplicationChange}
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
                value={application.experience}
                onChange={handleApplicationChange}
              />

              <label htmlFor="area">Working area</label>
              <input
                id="area"
                name="area"
                className="in"
                value={application.area}
                onChange={handleApplicationChange}
              />

              <button
                type="submit"
                className="btn"
                style={{ display: "block", width: "100%", marginTop: 22 }}
                disabled={applying}
              >
                {applying ? "Sending..." : "Become a provider"}
              </button>

              <p className="m" style={{ marginTop: 12 }}>
                An admin will review your request.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;