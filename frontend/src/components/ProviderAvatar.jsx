function ProviderAvatar({ src, name, size = 160 }) {
  // With no photo, show the initials, like "RN" for Rahul Nair
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <img
        className="avatar-circle"
        src={src}
        alt={name}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="avatar-circle avatar-fallback"
      style={{ width: size, height: size, fontSize: size / 3 }}
    >
      {initials}
    </div>
  );
}

export default ProviderAvatar;