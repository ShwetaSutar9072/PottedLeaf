import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useApp } from "../AppContext.jsx";
import ChatWidget from "./ChatWidget.jsx";

export default function Layout() {
  const { user, isAdmin, signOut, count, wishlist } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  // No Wishlist / Cart links on the home, login, register and forgot-password pages
  const plainPage = ["/", "/login", "/register", "/forgot-password"].includes(pathname);
  const showShopLinks = !isAdmin && !plainPage;

  const link = (to, label) => <li><NavLink to={to} className={({ isActive }) => (isActive ? "active" : "")}>{label}</NavLink></li>;

  return (
    <>
      <header>
        <div id="div1">
          <img id="i2" src="/images/logo.png" alt="The Potted Leaf logo" />
          <nav>
            <ul>
              <li><Link to="/"><h2>The Potted Leaf</h2></Link></li>
              {link("/plants", "Plants")}
              {link("/seeds", "Seeds")}
              {link("/fertilizers", "Fertilizers")}
              {link("/about", "About Us")}
              {showShopLinks && link("/wishlist", `Wishlist (${wishlist.length})`)}
              {showShopLinks && link("/cart", `Cart (${count})`)}
              {user ? (
                <>
                  {isAdmin ? link("/admin", "Admin") : (
                    <>
                      {link("/orders", "My Orders")}
                      {link("/profile", "Profile")}
                    </>
                  )}
                  <li><a href="/" onClick={(e) => { e.preventDefault(); signOut(); navigate("/"); }}>Logout</a></li>
                </>
              ) : (
                <>
                  {link("/login", "Login")}
                  {link("/register", "New User")}
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <Outlet />

      <footer>
        <div className="foot-col">
          <h4>The Potted Leaf</h4>
          <p>Plants that arrive happy and stay that way.</p>
        </div>
        <div className="foot-col">
          <h4>Contact us</h4>
          <p>Mob. no: 7030169072</p>
          <p>Email: thepottedleaf@gmail.com</p>
          <p>Instagram: The_Potted_Leaf</p>
        </div>
        <div className="foot-col">
          <h4>Get in touch</h4>
          <p><Link to="/contact">Contact Us</Link></p>
          <p><Link to="/feedback">Send feedback</Link></p>
          <p><Link to="/about">About Us</Link></p>
        </div>
      </footer>

      {/* AI support chat (hidden for the admin) */}
      {!isAdmin && <ChatWidget />}
    </>
  );
}