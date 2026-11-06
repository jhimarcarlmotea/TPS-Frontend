import { apiFetch, API_URL, getToken } from "../auth";

/** GET /api/home-content (public) */
export const getHomeContent = () => apiFetch("/home-content");

/** POST /api/admin/home-content (admin only) */
export const saveHomeContent = (content) =>
  apiFetch("/admin/home-content", {
    method: "POST",
    body: JSON.stringify(content),
  });

/** POST /api/admin/home-content/image (multipart, field "image") -> { url } */
export const uploadHomeImage = async (file) => {
  const token = getToken();
  const body = new FormData();
  body.append("image", file);

  const res = await fetch(`${API_URL}/admin/home-content/image`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to upload image.");
  }
  return data;
};
