import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { categories } from "../data/providers";
import ProviderAvatar from "../components/ProviderAvatar";
import ServiceIllustration, {
  illustrationOptions,
  defaultIllustrationId,
} from "../components/ServiceIllustration";
import "./ProviderPages.css";

// Shrinks the chosen photo so it is small enough to store
const resizeImage = (file, maxSize) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const statusBadge = { pending: "b w", approved: "b ok", rejected: "b x" };
const statusLabel = {
  pending: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
};

function ProviderProfile() {
  const { token, updateUser } = useAuth();
  const fileRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [photo, setPhoto] = useState("");
  const [illustration, setIllustration] = useState("");
  const [info, setInfo] = useState({
    approvalStatus: "pending",
    rating: null,
    reviewCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  // Load my real profile from the server when the page opens
  useEffect(() => {
    api("/api/providers/me", { token })
      .then((data) => {
        setProfile({
          name: data.name,
          category: data.category,
          experience: String(data.experience),
          area: data.area,
          phone: data.phone,
          about: data.about,
        });
        setPhoto(data.photo);
        setIllustration(data.illustration);
        setInfo({
          approvalStatus: data.approvalStatus,
          rating: data.rating,
          reviewCount: data.reviewCount,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="m">Loading your profile...</p>;

  if (!profile) {
    return <p className="b x">{error || "Could not load your profile."}</p>;
  }

  // The illustration shown as selected (the category default if none was chosen)
  const selectedArt = illustration || defaultIllustrationId(profile.category);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    e.target.value = ""; // lets the user pick the same file again later
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Please choose a JPG, PNG or WEBP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image must be smaller than 5 MB.");
      return;
    }

    try {
      setPhoto(await resizeImage(file, 400));
      setPhotoError("");
      setSaved(false);
    } catch {
      setPhotoError("Could not read this image. Try another one.");
    }
  };

  const handleRemovePhoto = () => {
    setPhoto("");
    setPhotoError("");
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.name.trim() || !profile.phone.trim() || !profile.area.trim()) {
      setError("Name, phone and working area are required.");
      setSaved(false);
      return;
    }

    setError("");
    setSaving(true);

    try {
      const data = await api("/api/providers/me", {
        method: "PUT",
        token,
        body: { ...profile, photo, illustration: selectedArt },
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

  return (
    <div>
      <div className="page-head">
        <h1 style={{ fontSize: 26 }}>Provider profile</h1>
      </div>

      <div className="pp-layout">
        <form className="card pp-main" onSubmit={handleSubmit}>
          <div className="avatar-row">
            <ProviderAvatar src={photo} name={profile.name || "?"} size={88} />

            <div>
              <button
                type="button"
                className="btn btn2 btn-sm"
                onClick={() => fileRef.current.click()}
              >
                {photo ? "Change photo" : "Upload photo"}
              </button>
              {photo && (
                <button
                  type="button"
                  className="btn btn2 btn-sm"
                  style={{ marginLeft: 8 }}
                  onClick={handleRemovePhoto}
                >
                  Remove
                </button>
              )}
              <p className="m" style={{ marginTop: 8 }}>
                Profile photo: JPG, PNG or WEBP.
              </p>
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handlePhotoChange}
              hidden
            />
          </div>

          {photoError && (
            <p className="b x" style={{ marginTop: 14 }}>
              {photoError}
            </p>
          )}
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

          <label>Card illustration</label>
          <p className="m" style={{ marginTop: 4 }}>
            Shown on your service card on the Home and Services pages.
          </p>
          <div className="art-grid">
            {illustrationOptions.map((opt) => (
              <button
                type="button"
                key={opt.id}
                className={
                  selectedArt === opt.id ? "art-option selected" : "art-option"
                }
                aria-pressed={selectedArt === opt.id}
                onClick={() => {
                  setIllustration(opt.id);
                  setSaved(false);
                }}
              >
                <ServiceIllustration id={opt.id} height={70} />
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

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
            disabled={saving}
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>

        <div className="pp-side">
          <div className="card">
            <h3>Rating</h3>
            <h2 style={{ marginTop: 6 }}>★ {info.rating ?? "–"}</h2>
            <p className="m" style={{ marginTop: 4 }}>
              From {info.reviewCount} reviews
            </p>
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <h3>Account</h3>
            <p className="m" style={{ marginTop: 6 }}>
              Status:{" "}
              <span className={statusBadge[info.approvalStatus]}>
                {statusLabel[info.approvalStatus]}
              </span>
            </p>
            {info.approvalStatus === "pending" && (
              <p className="m" style={{ marginTop: 8 }}>
                Your profile goes live after an admin approves it.
              </p>
            )}
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