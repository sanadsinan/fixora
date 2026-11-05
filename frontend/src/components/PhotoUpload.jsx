import { useRef, useState } from "react";
import ProviderAvatar from "./ProviderAvatar";

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

// Shows the photo with Upload / Change / Remove buttons.
// onChange is called with the new photo (or "" when removed).
function PhotoUpload({ photo, name, onChange, size = 88 }) {
  const fileRef = useRef(null);
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = ""; // lets the user pick the same file again later
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please choose a JPG, PNG or WEBP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    try {
      onChange(await resizeImage(file, 400));
      setError("");
    } catch {
      setError("Could not read this image. Try another one.");
    }
  };

  return (
    <>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 14 }}>
        <ProviderAvatar src={photo} name={name || "?"} size={size} />

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
              onClick={() => {
                onChange("");
                setError("");
              }}
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
          onChange={handleFile}
          hidden
        />
      </div>

      {error && (
        <p className="b x" style={{ marginTop: 14 }}>
          {error}
        </p>
      )}
    </>
  );
}

export default PhotoUpload;