import { useMemo, useState } from "react";
import { intro, CATEGORIES } from "../data.js";
import { useApp } from "../AppContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

// category = "Plants" | "Seeds" | "Fertilizers", or omit for all products
export default function Catalog({ category }) {
  const { catalog } = useApp();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("featured");
  const [range, setRange] = useState("any");
  const [cat, setCat] = useState("All");

  const shown = useMemo(() => {
    const active = category || cat;
    let list = catalog.items.filter((p) =>
      (active === "All" || (p.category || "").toLowerCase() === active.toLowerCase()) &&
      p.name.toLowerCase().includes(q.trim().toLowerCase()) &&
      (range === "any" || (range === "u200" && p.price < 200) ||
        (range === "200-500" && p.price >= 200 && p.price <= 500) || (range === "o500" && p.price > 500)));
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [catalog.items, category, cat, q, sort, range]);

  return (
    <>
      <div id="div3"><h3><b>{intro}</b></h3></div>
      <h2 className="section">{category || "All products"}</h2>

      <div className="filters">
        <input type="search" placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
        {!category && (
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category">
            <option value="All">All categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        )}
        <select value={range} onChange={(e) => setRange(e.target.value)} aria-label="Price range">
          <option value="any">Any price</option>
          <option value="u200">Under ₹200</option>
          <option value="200-500">₹200 to ₹500</option>
          <option value="o500">Over ₹500</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="featured">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
          <option value="name">Name</option>
        </select>
      </div>

      {catalog.loading ? <p className="center">Loading products…</p>
        : shown.length === 0 ? <p className="center">{q || range !== "any" ? "No products match your search. Try clearing the filters." : "No products here yet. Please check back soon."}</p>
        : <div className="products">{shown.map((item) => <ProductCard key={item.id} item={item} />)}</div>}
    </>
  );
}
