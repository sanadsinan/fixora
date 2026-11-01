import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { categories, reviews } from "../data/providers";
import { useProviders } from "../context/ProvidersContext";
import ProviderAvatar from "../components/ProviderAvatar";
import ServiceIllustration, {
  illustrationOptions,
  defaultIllustrationId,
} from "../components/ServiceIllustration";
import "./ProviderPages.css";

// Dummy: we pretend the logged-in provider is the one with id 1
const myId = 1;
const myReviews = reviews.filter((r) => r.providerId === myId);
const averageRating = myReviews.length
  ? (myReviews.reduce((sum, r) => sum + r.rating, 0) / myReviews.length).toFixed(1)
  : "–";

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
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function ProviderProfile() {
  const { providers, updateProvider } = useProviders();
  const me = providers.find((p) => p.id === myId);

  const [profile, setProfile] = useState({
    name: me.name,
    category: me.service,
    experience: me.experience ?? "8",
    area: me.location,
    phone: me.phone ?? "9876543210",
    about: me.description,
  });
  const [photo, setPhoto] = useState(me.photo || "");
  const [illustration, setIllustration] = useState(me.illustration || "");
  const [photoError, setPhotoError] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

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
      const small = await resizeImage(file, 400);
      setPhoto(small);
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!profile.name || !profile.phone || !profile.area) {
      setError("Name, phone and working area are required.");
      setSaved(false);
      return;
    }

    setError("");
    updateProvider(myId, {
      name: profile.name,
      service: profile.category,
      location: profile.area,
      description: profile.about,
      experience: profile.experience,
      phone: profile.phone,
      photo,
      illustration: selectedArt,
    });
    setSaved(true);
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