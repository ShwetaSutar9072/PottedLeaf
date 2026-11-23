import { useState } from "react";
import * as api from "../api";
import { useApp } from "../AppContext.jsx";
import { sampleCatalog, CATEGORIES } from "../data.js";

const blank = { name: "", category: "Plants", price: "", stock: "", imageUrl: "", description: "" };

export default function AdminProducts() {
  const { user, catalog, loadCatalog, toast } = useApp();
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

  const upload = async (e) => {
    const f = e.target.files[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return toast("Image must be under 5 MB", "err");
    try {
      const r = await api.uploadImage(user.id, f);
      setForm((x) => ({ ...x, imageUrl: r.url }));
      toast("Image uploaded");
    } catch (err) { toast(err.message.includes("404") ? "Add AdminController to the backend (see backend-patch)." : err.message, "err"); }
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
  const importSample = async (only) => {
    setBusy(true);
    try {
      for (const s of sampleCatalog.filter((x) => !only || x.category === only))
        await api.createPlant({ name: s.name, category: s.category, price: s.price, stock: s.stock,
          description: s.description, imageUrl: window.location.origin + s.image });
      toast(only ? "Sample " + only.toLowerCase() + " added" : "Sample products imported"); await loadCatalog();
    } catch (err) { toast(hint(err), "err"); } finally { setBusy(false); }
  };

  const fromServer = catalog.source === "server";
  const empty = fromServer ? CATEGORIES.filter((c) => !catalog.items.some((p) => (p.category || "").toLowerCase() === c.toLowerCase())) : [];
  const catOptions = CATEGORIES.includes(form.category) ? CATEGORIES : [...CATEGORIES, form.category];
  return (
    <div>
      <h3>Products</h3>

      {!fromServer && (
        <div className="banner">
          The store is showing sample products because the database has none (or the backend is not reachable).
          <button className="small" disabled={busy} onClick={() => importSample()}>Import sample products</button>
        </div>
      )}

      {empty.map((c) => (
        <div className="banner" key={c}>
          You have no {c.toLowerCase()} yet, so the {c} page is empty.
          <button className="small" disabled={busy} onClick={() => importSample(c)}>Add sample {c.toLowerCase()}</button>
        </div>
      ))}

      <form className="admin-form" onSubmit={save}>
        <h3>{editId ? "Edit product" : "Add product"}</h3>
        <input placeholder="Name" required value={form.name} onChange={set("name")} />
        <select required value={form.category} onChange={set("category")} aria-label="Category">
          {catOptions.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input type="number" min="0" step="0.01" placeholder="Price (₹)" required value={form.price} onChange={set("price")} />
        <input type="number" min="0" placeholder="Stock" required value={form.stock} onChange={set("stock")} />
        <input placeholder="Image URL (paste a link, or use Upload image)" value={form.imageUrl} onChange={set("imageUrl")} />
        <div className="upload">
          <label className="filebtn">Upload image<input type="file" accept="image/*" onChange={upload} hidden /></label>
          {form.imageUrl && <img src={api.imageSrc(form.imageUrl)} alt="Preview" />}
        </div>
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
