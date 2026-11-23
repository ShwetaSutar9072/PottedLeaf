import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import * as api from "./api";
import { sampleCatalog } from "./data.js";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [catalog, setCatalog] = useState({ items: sampleCatalog, source: "sample", loading: true });
  const [wishlist, setWishlist] = useState([]);
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  const toast = useCallback((message, type = "ok") => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  /* Catalog: from the backend when it has plants, otherwise the sample products */
  const loadCatalog = useCallback(async () => {
    try {
      const list = await api.listPlants();
      if (Array.isArray(list) && list.length)
        return setCatalog({ items: list.map(api.normalizePlant), source: "server", loading: false });
    } catch { /* fall through */ }
    setCatalog({ items: sampleCatalog, source: "sample", loading: false });
  }, []);
  useEffect(() => { loadCatalog(); }, [loadCatalog]);

  /* Cart */
  const refreshCart = useCallback(async () => {
    if (!user) return setCart([]);
    try { setCart((await api.getCart(user.id)) || []); } catch { setCart([]); }
  }, [user]);
  useEffect(() => { refreshCart(); }, [refreshCart]);

  /* Wishlist (saved in this browser, per user) */
  const wKey = "wishlist:" + (user ? user.id : "guest");
  useEffect(() => { setWishlist(read(wKey, [])); }, [wKey]);
  const toggleWish = (id) => {
    setWishlist((w) => {
      const next = w.includes(id) ? w.filter((x) => x !== id) : [...w, id];
      localStorage.setItem(wKey, JSON.stringify(next));
      return next;
    });
  };

  const signIn = (u) => { localStorage.setItem("user", JSON.stringify(u)); setUser(u); };
  const signOut = () => { localStorage.removeItem("user"); setUser(null); setCart([]); };

  const add = async (product, qty = 1) => {
    await api.addToCart({
      userId: user.id, plantId: product.id, plantName: product.name,
      price: product.price, quantity: qty, imageUrl: product.image,
    });
    await refreshCart();
  };
  const setQty = async (item, qty) => {
    if (qty <= 0) await api.removeItem(item.id); else await api.updateQty(item.id, qty);
    await refreshCart();
  };

  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const total = cart.reduce((s, i) => s + i.quantity * i.price, 0);
  const isAdmin = !!user && user.username === api.ADMIN_USERNAME;

  return (
    <Ctx.Provider value={{
      user, isAdmin, signIn, signOut, cart, count, total, add, setQty, refreshCart,
      catalog, loadCatalog, wishlist, toggleWish, toast,
    }}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={"toast " + t.type}>{t.message}</div>)}
      </div>
    </Ctx.Provider>
  );
}
