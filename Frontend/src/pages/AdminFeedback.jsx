import { useEffect, useState } from "react";
import * as api from "../api";
import { useApp } from "../AppContext.jsx";
import { fmtDate } from "../util.js";

export default function AdminFeedback() {
  const { user, toast } = useApp();
  const [list, setList] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    api.adminFeedback(user.id).then(setList)
      .catch((e) => setError(e.message.includes("404")
        ? "The backend has no feedback endpoints yet. Add Feedback.java, FeedbackRepository.java and FeedbackController.java (see backend-patch) and restart it."
        : e.message));
  };
  useEffect(load, [user.id]);

  const markRead = async (f) => {
    try { await api.markFeedbackRead(user.id, f.id); load(); } catch (e) { toast(e.message, "err"); }
  };
  const remove = async (f) => {
    if (!window.confirm("Delete this feedback message?")) return;
    try { await api.deleteFeedback(user.id, f.id); load(); } catch (e) { toast(e.message, "err"); }
  };

  if (error) return <p className="error">{error}</p>;
  if (!list) return <p>Loading…</p>;

  return (
    <>
      <h3>Feedback ({list.filter((f) => !f.read).length} unread of {list.length})</h3>
      {list.length === 0 ? <p>No feedback yet.</p> : (
        <div className="feedback-list">
          {list.map((f) => (
            <div className={f.read ? "fcard" : "fcard unread"} key={f.id}>
              <div className="fhead">
                <span><b>{f.fullName}</b> · {f.email}<br /><small>{fmtDate(f.submittedAt)}</small></span>
                <span>
                  {!f.read && <button className="link" onClick={() => markRead(f)}>Mark as read</button>}
                  <button className="link danger" onClick={() => remove(f)}>Delete</button>
                </span>
              </div>
              <p>{f.message}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
