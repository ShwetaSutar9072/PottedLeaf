// Talks to your Spring Boot backend (PlantStore project).
import { LOCAL_IMAGES } from "./data.js";

export const API = "http://localhost:8080";
// Users with this username see the Admin page. This only hides the page in the UI:
// it is NOT real security. Add roles + Spring Security in the backend for that.
export const ADMIN_USERNAME = "admin";

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(API + path, options);
  } catch {
    throw new Error("Cannot reach the server. Is the backend running on " + API + "?");
  }
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error((data && data.message) || "Request failed (" + res.status + ")");
  return data;
}
const json = (method, body) => ({
  method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
});

/* Images: full URLs stay as they are, images bundled with this frontend stay local,
   anything else is served by the backend (Spring static folder). */
export const imageSrc = (u) => {
  if (!u) return "/images/plant1.jpg";
  if (/^https?:/.test(u) || LOCAL_IMAGES.has(u)) return u;
  return API + (u.startsWith("/") ? u : "/" + u);
};
export const normalizePlant = (x) => ({
  id: x.id, name: x.name, category: x.category || "Plants", price: Number(x.price) || 0,
  description: x.description || "", stock: x.stock ?? 0, image: imageSrc(x.imageUrl),
});

// Users
export const register = (user) => request("/api/users/register", json("POST", user));
export const login = (username, password) =>
  request("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username, password }),
  });
export const getUser = (id) => request("/api/users/" + id);

// Plants (PlantController, /api/admin/plants)
export const listPlants = () => request("/api/admin/plants");
export const createPlant = (p) => request("/api/admin/plants", json("POST", p));
export const updatePlant = (id, p) => request("/api/admin/plants/" + id, json("PUT", p));
export const deletePlant = (id) => request("/api/admin/plants/" + id, { method: "DELETE" });

// Cart
export const getCart = (userId) => request("/api/cart/" + userId);
export const addToCart = (item) => request("/api/cart/add", json("POST", item));
export const updateQty = (cartId, qty) => request(`/api/cart/${cartId}/${qty}`, { method: "PUT" });
export const removeItem = (cartId) => request("/api/cart/" + cartId, { method: "DELETE" });
export const clearCart = (userId) => request("/api/cart/clear/" + userId, { method: "DELETE" });

// Orders
export const placeOrder = (userId, method) =>
  request(`/api/orders/place/${userId}/${method}`, { method: "POST" });
export const getOrders = (userId) => request("/api/orders/user/" + userId);
export const getOrderItems = (orderId) => request("/api/orders/items/" + orderId);

// Admin (AdminController). The backend checks that X-User-Id belongs to the "admin" user.
const asAdmin = (userId) => ({ "X-User-Id": String(userId) });
export const adminOrders = (adminId) => request("/api/admin/orders", { headers: asAdmin(adminId) });
export const adminUsers = (adminId) => request("/api/admin/users", { headers: asAdmin(adminId) });
export const adminSetStatus = (adminId, orderId, status) =>
  request(`/api/admin/orders/${orderId}/status/${status}`, { method: "PUT", headers: asAdmin(adminId) });
export const uploadImage = (adminId, file) => {
  const body = new FormData();
  body.append("file", file);
  return request("/api/admin/upload", { method: "POST", headers: asAdmin(adminId), body });
};

// Password reset (PasswordController)
export const resetPassword = (username, email, newPassword) =>
  request("/api/users/reset-password", json("POST", { username, email, newPassword }));

// Cancel an order (customer, only before it ships)
export const cancelOrder = (orderId, userId) =>
  request(`/api/orders/${orderId}/cancel/${userId}`, { method: "PUT" });

// Feedback
export const sendFeedback = (feedback) => request("/api/feedback", json("POST", feedback));
export const adminFeedback = (adminId) => request("/api/feedback", { headers: asAdmin(adminId) });
export const markFeedbackRead = (adminId, id) =>
  request(`/api/feedback/${id}/read`, { method: "PUT", headers: asAdmin(adminId) });
export const deleteFeedback = (adminId, id) =>
  request(`/api/feedback/${id}`, { method: "DELETE", headers: asAdmin(adminId) });


export const askChatbot = async (question) => {
  let res;
  try {
    res = await fetch(API + "/api/v1/query?question=" + encodeURIComponent(question));
  } catch {
    throw new Error("Cannot reach the server. Is the backend running on " + API + "?");
  }
  const body = await res.text();
  if (!res.ok) {
    let msg = body;
    try { msg = JSON.parse(body).message || body; } catch { /* plain text */ }
    throw new Error("Assistant error (" + res.status + "): " + msg);
  }
  return body;
};
