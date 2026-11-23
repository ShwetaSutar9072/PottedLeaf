import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../api";
import { useApp } from "../AppContext.jsx";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useApp();
  const [f, setF] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (f.password.length < 6) return setError("Password must be at least 6 characters.");
    if (f.password !== f.confirm) return setError("Passwords do not match.");
    setBusy(true);
    try {
      await api.resetPassword(f.username.trim(), f.email.trim(), f.password);
      toast("Password updated. Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message.includes("404") || err.message.includes("405")
        ? "The backend has no reset endpoint yet. Add PasswordController (see backend-patch) and restart it."
        : err.message.startsWith("Request failed") ? "Could not reset the password. Please try again." : err.message);
    } finally { setBusy(false); }
  };

  return (
    <div id="login-box">
      <h2>Forgot Password</h2>
      <p className="note">Enter your username and the email you registered with, then choose a new password.</p>
      <form onSubmit={submit}>
        <input type="text" placeholder="Username" required autoComplete="username" value={f.username} onChange={set("username")} />
        <input type="email" placeholder="Registered email" required autoComplete="email" value={f.email} onChange={set("email")} />
        <input type="password" placeholder="New Password" required autoComplete="new-password" value={f.password} onChange={set("password")} />
        <input type="password" placeholder="Confirm New Password" required autoComplete="new-password" value={f.confirm} onChange={set("confirm")} />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
        <Link to="/login">Back to login</Link>
        <Link to="/register">New User?</Link>
      </form>
    </div>
  );
}
