import { useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useApp } from "../AppContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { catalog, user, isAdmin, add, wishlist, toggleWish, toast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [qty, setQty] = useState(1);

  const item = catalog.items.find((p) => String(p.id) === id);
  if (catalog.loading) return <p className="center">Loading…</p>;
  if (!item)
    return <div className="checkout-container single"><h2>Product not found</h2><p><Link to="/shop">Back to all products</Link></p></div>;

  const related = catalog.items.filter((p) => p.category === item.category && p.id !== item.id).slice(0, 4);
  const liked = wishlist.includes(item.id);

  const onAdd = async () => {
    if (!user) return navigate("/login", { state: { from: location.pathname } });
    try { await add(item, qty); toast(`${qty} × ${item.name} added to cart`); }
    catch (e) { toast(e.message, "err"); }
  };

  return (
    <>
      <div className="detail">
        <img src={item.image} alt={item.name} />
        <div>
          <p className="crumb"><Link to="/shop">Shop</Link> / <Link to={"/" + item.category.toLowerCase()}>{item.category}</Link></p>
          <h1>{item.name}</h1>
          <p className="price big">₹{item.price}</p>
          <p>{item.description || "No description added yet."}</p>
          <p className={item.stock > 0 ? "instock" : "out"}>
            {item.stock > 0 ? (item.stock < 10 ? `Only ${item.stock} left` : "In stock") : "Out of stock"}
          </p>
          {item.stock > 0 && !isAdmin && (
            <div className="row">
              <div className="qty">
                <button className="small" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span>{qty}</span>
                <button className="small" onClick={() => setQty(Math.min(item.stock, qty + 1))}>+</button>
              </div>
              <button className="small big" onClick={onAdd}>Add to cart</button>
            </div>
          )}
          {!isAdmin && <button className="link" onClick={() => toggleWish(item.id)}>{liked ? "♥ Saved to wishlist" : "♡ Save to wishlist"}</button>}
        </div>
      </div>
      {related.length > 0 && (
        <>
          <h2 className="section">More {item.category.toLowerCase()}</h2>
          <div className="products">{related.map((r) => <ProductCard key={r.id} item={r} />)}</div>
        </>
      )}
    </>
  );
}
