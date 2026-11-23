import { Link } from "react-router-dom";
import { useApp } from "../AppContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function Wishlist() {
  const { catalog, wishlist } = useApp();
  const items = catalog.items.filter((p) => wishlist.includes(p.id));
  return (
    <>
      <h2 className="section">Your wishlist</h2>
      {items.length === 0
        ? <p className="center">Nothing saved yet. Tap the ♡ on any product to save it. <Link to="/shop">Browse products</Link></p>
        : <div className="products">{items.map((p) => <ProductCard key={p.id} item={p} />)}</div>}
    </>
  );
}
