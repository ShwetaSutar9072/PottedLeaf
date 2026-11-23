import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../api";
import { useApp } from "../AppContext.jsx";
import { fmtDate } from "../util.js";


export default function Orders() {
  const { user, toast } = useApp();
  const [orders, setOrders] = useState(null);
  const [open, setOpen] = useState(null);
  const [items, setItems] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const CANCELLABLE = ["CREATED", "PAID"];

  const load = () => {
    api.getOrders(user.id)
      .then((list) => setOrders([...(list || [])].sort((a, b) => b.id - a.id)))
      .catch((e) => setError(e.message));
  };
  useEffect(load, [user.id]);

  const cancel = async (o) => {
    if (!window.confirm(`Cancel order #${o.id}? This cannot be undone.`)) return;
    setBusy(o.id);
    try {
      await api.cancelOrder(o.id, user.id);
      toast("Order #" + o.id + " cancelled");
      load();
    } catch (e) {
      toast(e.message.includes("404") ? "Add OrderCancelController to the backend (see backend-patch)." : e.message, "err");
    } finally { setBusy(null); }
  };

  const toggle = async (id) => {
    setOpen(open === id ? null : id);
    if (!items[id]) {
      try { setItems((m) => ({ ...m, [id]: null })); const list = await api.getOrderItems(id); setItems((m) => ({ ...m, [id]: list || [] })); }
      catch (e) { setError(e.message); }
    }
  };

  return (
    <div className="checkout-container single">
      <div>
        <h2>My Orders</h2>
        {error && <p className="error">{error}</p>}
        {orders === null && !error && <p>Loading…</p>}
        {orders && orders.length === 0 && <p>You have not placed any orders yet. <Link to="/shop">Start shopping</Link></p>}
        {orders && orders.map((o) => (
          <div className="order-card" key={o.id}>
            <button className="order-head" onClick={() => toggle(o.id)} aria-expanded={open === o.id}>
              <span><b>Order #{o.id}</b><br /><small>{fmtDate(o.orderDate)}</small></span>
              <span className={"status " + String(o.status).toLowerCase()}>{o.status}</span>
              <span><b>₹{o.totalAmount}</b><br /><small>{o.paymentMethod}</small></span>
            </button>
            {CANCELLABLE.includes(o.status) && (
              <div className="order-actions">
                <button className="link danger" disabled={busy === o.id}
                  onClick={(e) => { e.stopPropagation(); cancel(o); }}>
                  {busy === o.id ? "Cancelling…" : "Cancel order"}
                </button>
              </div>
            )}
            {open === o.id && (
              <div className="order-body">
                {items[o.id] === null || items[o.id] === undefined ? <p>Loading items…</p> :
                  items[o.id].map((i) => (
                    <div className="cart-line" key={i.id}>
                      <img src={api.imageSrc(i.imageUrl)} alt="" />
                      <div className="grow">{i.plantName}<br /><small>₹{i.price} × {i.quantity}</small></div>
                      <div className="line-total">₹{i.price * i.quantity}</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
