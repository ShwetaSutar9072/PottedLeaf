import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../api";
import { useApp } from "../AppContext.jsx";

export default function Payment() {
  const { user, cart, total, refreshCart, toast } = useApp();
  const navigate = useNavigate();
  const [method, setMethod] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (cart.length === 0)
    return <div className="checkout-container single"><p>Your cart is empty. <Link to="/shop">Browse products</Link></p></div>;

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const order = await api.placeOrder(user.id, method.toUpperCase());
      await refreshCart();
      toast("Order #" + order.id + " placed. Thank you!");
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    } finally { setBusy(false); }
  };

  return (
    <div className="checkout-container">
      <div>
        <h2>Shipping Information</h2>
        <form onSubmit={submit}>
          <label>Full Name</label>
          <input type="text" defaultValue={user.fullName} required />
          <label>Address</label>
          <input type="text" defaultValue={user.address} required />
          <label>PIN Code</label>
          <input type="text" inputMode="numeric" pattern="\d{6}" title="6 digit PIN code" placeholder="Pincode" required />
          <label>Phone</label>
          <input type="text" defaultValue={user.phone} required />

          <h2>Payment Information</h2>
          <label>Payment Method</label>
          <select required value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="">Select</option>
            <option value="card">Credit / Debit Card</option>
            <option value="upi">UPI</option>
            <option value="cod">Cash on Delivery</option>
          </select>
          {method === "upi" && <><label>UPI ID</label><input type="text" placeholder="name@bank" required /></>}
          {method === "card" && <><label>Card Number</label><input type="text" inputMode="numeric" placeholder="xxxx-xxxx-xxxx-xxxx" required /></>}
          <p className="note">Card and UPI details are not sent to the backend. Only the payment method is saved with the order.</p>
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={busy}>{busy ? "Placing order…" : "Place Order"}</button>
        </form>
      </div>

      <div className="order-summary">
        <h2>Order Details</h2>
        {cart.map((i) => (
          <div className="order-item" key={i.id}><span>{i.plantName} × {i.quantity}</span><span>₹{i.price * i.quantity}</span></div>
        ))}
        <div className="order-item order-total"><span>Total</span><span>₹{total}</span></div>
      </div>
    </div>
  );
}
