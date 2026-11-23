import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../AppContext.jsx";

export default function ProductCard({ item }) {
  const { user, isAdmin, add, wishlist, toggleWish, toast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const out = item.stock <= 0;
  const liked = wishlist.includes(item.id);

  const onAdd = async () => {
    if (!user) return navigate("/login", { state: { from: location.pathname } });
    try { await add(item); toast(item.name + " added to cart"); }
    catch (e) { toast(e.message, "err"); }
  };

  return (
    <div className="product">
      {!isAdmin && <button className={liked ? "heart on" : "heart"} onClick={() => toggleWish(item.id)}
        aria-label={liked ? "Remove from wishlist" : "Save to wishlist"}>{liked ? "♥" : "♡"}</button>}
      <Link to={"/product/" + item.id}>
        <img src={item.image} alt={item.name} />
        <h4>{item.name}</h4>
      </Link>
      <p className="price">₹{item.price}</p>
      {out ? <span className="out">Out of stock</span>
           : !isAdmin && <button className="small" onClick={onAdd}>Add to cart</button>}
    </div>
  );
}
