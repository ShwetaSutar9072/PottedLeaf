import { useState } from "react";
import * as api from "../api";
import { useApp } from "../AppContext.jsx";
import { sampleCatalog, CATEGORIES } from "../data.js";

const blank = { name: "", category: "Plants", price: "", stock: "", imageUrl: "", description: "" };

export default function Admin() {
  const { catalog, loadCatalog, toast } = useApp();
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const hint = (e) => e.message.includes("405") || e.message.includes("404")
    ? "The backend rejected this. Add @PostMapping to PlantController.create() (see backend-patch)." : e.message;

  const save = async (e) => {
    e.preventDefault(); setBusy(true);
    const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editId) await api.updatePlant(editId, body); else await api.createPlant(body);
      toast(editId ? "Product updated" : "Product added");
      setForm(blank); setEditId(null); await loadCatalog();
    } catch (err) { toast(hint(err), "err"); } finally { setBusy(false); }
  };

  const edit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, imageUrl: p.image, description: p.description });
    window.scrollTo(0, 0);
  };
  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try { await api.deletePlant(p.id); toast("Deleted " + p.name); await loadCatalog(); }
    catch (err) { toast(err.message, "err"); }
  };
  const importSample = async () => {
    setBusy(true);
    try {
      for (const s of sampleCatalog)
        await api.createPlant({ name: s.name, category: s.category, price: s.price, stock: s.stock,
          description: s.description, imageUrl: window.location.origin + s.image });
      toast("Sample products imported"); await loadCatalog();
    } catch (err) { toast(hint(err), "err"); } finally { setBusy(false); }
  };

  const fromServer = catalog.source === "server";
  return (
    <div className="admin">
      <h2>Manage products</h2>

      {!fromServer && (
        <div className="banner">
          The store is showing sample products because the database has none (or the backend is not reachable).
          <button className="small" disabled={busy} onClick={importSample}>Import sample products</button>
        </div>
      )}

      <form className="admin-form" onSubmit={save}>
        <h3>{editId ? "Edit product" : "Add product"}</h3>
        <input placeholder="Name" required value={form.name} onChange={set("name")} />
        <input list="cats" placeholder="Category" required value={form.category} onChange={set("category")} />
        <datalist id="cats">{CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
        <input type="number" min="0" step="0.01" placeholder="Price (₹)" required value={form.price} onChange={set("price")} />
        <input type="number" min="0" placeholder="Stock" required value={form.stock} onChange={set("stock")} />
        <input placeholder="Image URL (full link, or a backend path like /images/Bamboo.png)" value={form.imageUrl} onChange={set("imageUrl")} />
        <textarea rows="3" placeholder="Description" value={form.description} onChange={set("description")} />
        <div>
          <button className="small big" disabled={busy}>{editId ? "Save changes" : "Add product"}</button>{" "}
          {editId && <button type="button" className="link" onClick={() => { setEditId(null); setForm(blank); }}>Cancel</button>}
        </div>
      </form>

      {fromServer && (
        <div className="table-wrap">
          <table>
            <thead><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
            <tbody>
              {catalog.items.map((p) => (
                <tr key={p.id}>
                  <td><img src={p.image} alt="" /></td>
                  <td>{p.name}</td><td>{p.category}</td><td>₹{p.price}</td>
                  <td className={p.stock < 5 ? "low" : ""}>{p.stock}</td>
                  <td><button className="link" onClick={() => edit(p)}>Edit</button> <button className="link danger" onClick={() => remove(p)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
