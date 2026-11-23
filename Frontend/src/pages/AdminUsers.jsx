import { useEffect, useState } from "react";
import * as api from "../api";
import { useApp } from "../AppContext.jsx";
import { money } from "../util.js";

export default function AdminUsers() {
  const { user } = useApp();
  const [users, setUsers] = useState(null);
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.adminUsers(user.id), api.adminOrders(user.id)])
      .then(([u, o]) => { setUsers(u || []); setOrders(o || []); })
      .catch((e) => setError(e.message.includes("404")
        ? "The backend has no admin endpoints yet. Add AdminController (see backend-patch) and restart it." : e.message));
  }, [user.id]);

  if (error) return <p className="error">{error}</p>;
  if (!users) return <p>Loading…</p>;

  const stats = (id) => {
    const mine = orders.filter((o) => o.userId === id && o.status !== "CANCELLED");
    return { n: mine.length, spent: mine.reduce((s, o) => s + o.totalAmount, 0) };
  };
  const shown = users.filter((u) =>
    `${u.fullName} ${u.username} ${u.email} ${u.phone}`.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <>
      <h3>Customers ({users.length})</h3>
      <div className="filters left">
        <input type="search" placeholder="Search by name, username, email or phone" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {shown.length === 0 ? <p>No customers match.</p> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Phone</th><th>Address</th><th>Orders</th><th>Spent</th></tr></thead>
            <tbody>
              {shown.map((u) => {
                const s = stats(u.id);
                return (
                  <tr key={u.id}>
                    <td>{u.fullName}</td><td>{u.username}</td><td>{u.email}</td><td>{u.phone}</td>
                    <td>{u.address}</td><td>{s.n}</td><td>{money(s.spent)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
