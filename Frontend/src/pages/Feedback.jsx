import { useState } from "react";
import * as api from "../api";
import { useApp } from "../AppContext.jsx";

export default function Feedback() {
  const { user } = useApp();
  const [f, setF] = useState({ fullName: user?.fullName || "", email: user?.email || "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      await api.sendFeedback(f);
      setSent(true);
    } catch (err) {
      setError(err.message.includes("404")
        ? "The backend has no feedback endpoint yet. Add FeedbackController (see backend-patch) and restart it."
        : err.message);
    } finally { setBusy(false); }
  };

  return (
    <div className="checkout-container single">
      <div>
        <h2>Feedback</h2>
        {sent ? (
          <p>Thanks for your feedback. We read every message.</p>
        ) : (
          <form onSubmit={submit}>
            <label>Full Name</label>
            <input type="text" placeholder="Enter Name" required value={f.fullName} onChange={set("fullName")} />
            <label>Email</label>
            <input type="email" placeholder="email" required value={f.email} onChange={set("email")} />
            <label>Message</label>
            <textarea placeholder="Message" required rows="5" value={f.message} onChange={set("message")} />
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={busy}>{busy ? "Sending…" : "Submit"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
