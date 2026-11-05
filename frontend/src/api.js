const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Sends a request to the backend and returns the answer as an object
export async function api(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  // If the server answered with an error, pass its message on
  if (!res.ok) throw new Error(data.message || "Something went wrong.");

  return data;
}