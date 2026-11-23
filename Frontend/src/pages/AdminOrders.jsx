import { Fragment, useEffect, useState } from "react";
import * as api from "../api";
import { useApp } from "../AppContext.jsx";
import { fmtDate, money, STATUSES } from "../util.js";

export default function AdminOrders() {
  const { user, toast } = useApp();
  const [orders, setOrders] = useState(null);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const [items, setItems] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.adminOrders(user.id), api.adminUsers(user.id)])
      .then(([o, u]) => { setOrders([...(o || [])].sort((a, b) => b.id - a.id)); setUsers(u || []); })
      .catch((e) => setError(e.message.includes("404")
        ? "The backend has no admin endpoints yet. Add AdminController (see backend-patch) and restart it." : e.message));
  }, [user.id]);

  const who = (id) => users.find((u) => u.id === id);
  const changeStatus = async (o, status) => {
    try {
      const saved = await api.adminSetStatus(user.id, o.id, status);
      setOrders((list) => list.map((x) => (x.id === o.id ? { ...x, status: saved.status } : x)));
      toast(`Order #${o.id} is now ${status}`);
    } catch (e) { toast(e.message, "err"); }
  };
  const toggle = async (id) => {
    setOpen(open === id ? null : id);
    if (items[id] === undefined) {
      try { setItems((m) => ({ ...m, [id]: null })); const l = await api.getOrderItems(id); setItems((m) => ({ ...m, [id]: l || [] })); }
      catch (e) { toast(e.message, "err"); }
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!orders) return <p>Loading…</p>;

  const shown = orders.filter((o) => {
    const c = who(o.userId);
    const text = `${o.id} ${c?.fullName || ""} ${c?.username || ""}`.toLowerCase();
    return (filter === "ALL" || o.status === filter) && text.includes(q.trim().toLowerCase());
  });

  return (
    <>
      <h3>Orders</h3>
      <div className="filters left">
        <input type="search" placeholder="Search by order number or customer" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by status">
          <option value="ALL">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      {shown.length === 0 ? <p>No orders match.</p> : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {shown.map((o) => {
                const c = who(o.userId);
                return (
                  <Fragment key={o.id}>
                    <tr>
                      <td>#{o.id}</td>
                      <td>{fmtDate(o.orderDate)}</td>
                      <td>{c ? c.fullName : "User #" + o.userId}</td>
                      <td>{money(o.totalAmount)}</td>
                      <td>{o.paymentMethod}</td>
                      <td>
                        <select className={"status " + String(o.status).toLowerCase()} value={o.status}
                          onChange={(e) => changeStatus(o, e.target.value)} aria-label={"Status of order " + o.id}>
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td><button className="link" onClick={() => toggle(o.id)}>{open === o.id ? "Hide" : "Details"}</button></td>
                    </tr>
                    {open === o.id && (
                      <tr className="detail-row"><td colSpan="7">
                        {c && <p className="note">Ship to: {c.fullName}, {c.address} · {c.phone} · {c.email}</p>}
                        {items[o.id] == null ? "Loading items…" : items[o.id].map((i) => (
                          <div className="cart-line" key={i.id}>
                            <img src={api.imageSrc(i.imageUrl)} alt="" />
                            <div className="grow">{i.plantName}<br /><small>{money(i.price)} × {i.quantity}</small></div>
                            <div className="line-total">{money(i.price * i.quantity)}</div>
                          </div>
                        ))}
                      </td></tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
