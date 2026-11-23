import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../api";
import { useApp } from "../AppContext.jsx";
import { fmtDate, money, toDate, STATUSES } from "../util.js";

export default function AdminDashboard() {
  const { user, catalog } = useApp();
  const [orders, setOrders] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.adminOrders(user.id), api.adminUsers(user.id)])
      .then(([o, u]) => { setOrders(o || []); setUsers(u || []); })
      .catch((e) => setError(e.message.includes("404")
        ? "The backend has no admin endpoints yet. Add AdminController (see backend-patch) and restart it." : e.message));
  }, [user.id]);

  if (error) return <p className="error">{error}</p>;
  if (!orders) return <p>Loading…</p>;

  const counted = orders.filter((o) => o.status !== "CANCELLED");
  const revenue = counted.reduce((s, o) => s + o.totalAmount, 0);
  const byStatus = STATUSES.map((s) => ({ s, n: orders.filter((o) => o.status === s).length }));
  const maxStatus = Math.max(1, ...byStatus.map((x) => x.n));

  const days = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toDateString();
    const sum = counted.filter((o) => toDate(o.orderDate)?.toDateString() === key).reduce((t, o) => t + o.totalAmount, 0);
    return { label: d.toLocaleDateString("en-IN", { weekday: "short" }), sum };
  });
  const maxDay = Math.max(1, ...days.map((d) => d.sum));

  const low = catalog.source === "server" ? catalog.items.filter((p) => p.stock < 5).sort((a, b) => a.stock - b.stock) : [];
  const recent = [...orders].sort((a, b) => b.id - a.id).slice(0, 5);
  const name = (id) => users.find((u) => u.id === id)?.fullName || "User #" + id;

  return (
    <>
      <div className="stats">
        <div className="stat"><span>Revenue</span><b>{money(revenue)}</b></div>
        <div className="stat"><span>Orders</span><b>{orders.length}</b></div>
        <div className="stat"><span>Customers</span><b>{users.length}</b></div>
        <div className="stat"><span>Products</span><b>{catalog.source === "server" ? catalog.items.length : 0}</b></div>
      </div>

      <div className="panels">
        <div className="panel">
          <h3>Orders by status</h3>
          {byStatus.map(({ s, n }) => (
            <div className="hbar" key={s}>
              <span>{s}</span>
              <div><i style={{ width: (n / maxStatus) * 100 + "%" }} /></div>
              <b>{n}</b>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>Revenue, last 7 days</h3>
          <div className="cols">
            {days.map((d, i) => (
              <div key={i} title={money(d.sum)}>
                <i style={{ height: (d.sum / maxDay) * 100 + "%" }} />
                <span>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Low stock</h3>
          {low.length === 0 ? <p className="note">No products are running low.</p> : (
            <ul className="plain">
              {low.map((p) => (
                <li key={p.id}><span>{p.name}</span><b className={p.stock === 0 ? "low" : ""}>{p.stock === 0 ? "Out of stock" : p.stock + " left"}</b></li>
              ))}
            </ul>
          )}
          <Link to="/admin/products">Manage products</Link>
        </div>

        <div className="panel">
          <h3>Recent orders</h3>
          {recent.length === 0 ? <p className="note">No orders yet.</p> : (
            <ul className="plain">
              {recent.map((o) => (
                <li key={o.id}><span>#{o.id} · {name(o.userId)}<br /><small>{fmtDate(o.orderDate)}</small></span><b>{money(o.totalAmount)}</b></li>
              ))}
            </ul>
          )}
          <Link to="/admin/orders">All orders</Link>
        </div>
      </div>
    </>
  );
}
