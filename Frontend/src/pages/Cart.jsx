import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../AppContext.jsx";
import { imageSrc } from "../api";

export default function Cart() {
  const { user, cart, total, setQty, toast } = useApp();
  const navigate = useNavigate();

  if (!user)
    return <div className="checkout-container single"><p>Please <Link to="/login" state={{ from: "/cart" }}>log in</Link> to see your cart.</p></div>;

  const change = async (item, q) => { try { await setQty(item, q); } catch (e) { toast(e.message, "err"); } };

  return (
    <div className="checkout-container single">
      <div>
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty. Browse <Link to="/plants">plants</Link>, <Link to="/seeds">seeds</Link> or <Link to="/fertilizers">fertilizers</Link>.</p>
        ) : (
          <>
            {cart.map((i) => (
              <div className="cart-line" key={i.id}>
                <img src={imageSrc(i.imageUrl)} alt="" />
                <div className="grow"><b><Link to={"/product/" + i.plantId}>{i.plantName}</Link></b><br />₹{i.price}</div>
                <div className="qty">
                  <button className="small" onClick={() => change(i, i.quantity - 1)} aria-label="Decrease quantity">−</button>
                  <span>{i.quantity}</span>
                  <button className="small" onClick={() => change(i, i.quantity + 1)} aria-label="Increase quantity">+</button>
                </div>
                <div className="line-total">₹{i.price * i.quantity}</div>
                <button className="link" onClick={() => change(i, 0)} aria-label={"Remove " + i.plantName}>Remove</button>
              </div>
            ))}
            <div className="order-item order-total"><span>Total</span><span>₹{total}</span></div>
            <button onClick={() => navigate("/payment")}>Proceed to payment</button>
          </>
        )}
      </div>
    </div>
  );
}
