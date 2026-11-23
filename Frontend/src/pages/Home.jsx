import { Link } from "react-router-dom";
import { intro, CATEGORIES } from "../data.js";
import { useApp } from "../AppContext.jsx";

export default function Home() {
  const { catalog } = useApp();
  const tagline = "Grow Green, Live Well!";
  const featured = catalog.items.filter((p) => p.category === "Plants").slice(0, 8);
  const cover = (c) => catalog.items.find((p) => p.category === c)?.image;

  return (
    <>
      <div><img src="/images/plant2.jpg" alt="Plants" id="i3" /></div>
      <div id="div3"><h3><b>{intro}</b></h3></div>

      <div className="tiles">
        {CATEGORIES.map((c) => (
          <Link className="tile" key={c} to={"/" + c.toLowerCase()}>
            <img src={cover(c) || "/images/plant1.jpg"} alt="" />
            <span>Shop {c}</span>
          </Link>
        ))}
      </div>

      <h2 className="section">Popular plants</h2>
      <div className="products">
        {featured.map((p) => (
          <div className="product" key={p.id}>
            <Link to={"/product/" + p.id}><img src={p.image} alt={p.name} /><h4>{p.name}</h4></Link>
            <p className="price">₹{p.price}</p>
          </div>
        ))}
      </div>

      <div id="info">
        <h3 style={{ color: "black" }}>The Potted Leaf</h3>
        <p>The Potted Leaf is an Indian online platform that sells plants, gardening supplies, and related products.</p>
        <p>The Potted Leaf offers a variety of plants, tools, fertilizers, and other gardening accessories.</p>
        <p>The platform also provides resources such as articles, videos, and a gardening community for enthusiasts to share their knowledge and experiences.</p>
      </div>

      <div id="f">
        <div className="marquee"><h2>{Array(6).fill(tagline).join("\u00A0".repeat(10))}</h2></div>
      </div>
      <hr />
    </>
  );
}
