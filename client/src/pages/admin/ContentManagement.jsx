import React, { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, RotateCw } from "lucide-react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { settingsApi } from "../../api/settingsApi.js";

const sections = {
  gallery: { label: "Gallery", fields: ["name", "description", "image"], defaults: { name: "", description: "", image: "" } },
  amenities: { label: "Amenities", fields: ["name", "description", "image"], defaults: { name: "", description: "", image: "" } },
  dining: { label: "Dining", fields: ["name", "description", "image"], defaults: { name: "", description: "", image: "" } },
};

export default function ContentManagement() {
  const [active, setActive] = useState("gallery");
  const [items, setItems] = useState({ gallery: [], amenities: [], dining: [] });
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(sections.gallery.defaults);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const response = await settingsApi.list();
      const next = { gallery: [], amenities: [], dining: [] };
      (response.data || []).forEach((setting) => {
        if (next[setting.key]) {
          try { next[setting.key] = JSON.parse(setting.value); } catch { next[setting.key] = []; }
        }
      });
      setItems(next);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const selectSection = (key) => {
    setActive(key); setEditing(null); setForm(sections[key].defaults);
  };

  const save = async (event) => {
    event.preventDefault();
    try {
      let image = form.image;
      if (imageFile) {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("image", imageFile);
        const uploadResponse = await settingsApi.uploadImage(uploadData);
        image = uploadResponse.data.url;
      }
      const item = { ...form, image };
      const updated = editing
        ? items[active].map((current) => current.id === editing.id ? { ...item, id: editing.id } : current)
        : [...items[active], { ...item, id: crypto.randomUUID() }];
      await settingsApi.update(active, JSON.stringify(updated));
      setItems({ ...items, [active]: updated });
      setEditing(null); setForm(sections[active].defaults); setImageFile(null);
    } catch (e) { alert(e.message); }
    finally { setUploading(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this content permanently?")) return;
    const updated = items[active].filter((item) => item.id !== id);
    try {
      await settingsApi.update(active, JSON.stringify(updated));
      setItems({ ...items, [active]: updated });
    } catch (e) { alert(e.message); }
  };

  const current = sections[active];
  return (
    <>
      <AdminPageHeader title="Website content" description="Manage gallery, amenities, and dining content shown to visitors."
        action={<button className="btn btn-light" onClick={load}><RotateCw size={15}/> Refresh</button>} />
      {error && <p style={{ color: "#c05d5d" }}>{error}</p>}
      <section className="panel">
        <div className="toolbar">
          {Object.entries(sections).map(([key, section]) => (
            <button key={key} className={`btn ${active === key ? "btn-gold" : "btn-light"}`} onClick={() => selectSection(key)}>
              {section.label}
            </button>
          ))}
          <button className="btn btn-gold" onClick={() => { setEditing(null); setForm(current.defaults); }}><Plus size={15}/> Add {current.label.toLowerCase()}</button>
        </div>
        <form className="panel-form" onSubmit={save}>
          <strong>{editing ? `Edit ${current.label.toLowerCase()}` : `Add ${current.label.toLowerCase()}`}</strong>
          <div className="form-grid">
            <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/></label>
            <label>Description<textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}/></label>
            <label>Image URL or Unsplash photo key<input required={!imageFile} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })}/></label>
            <label>Upload new image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setImageFile(e.target.files?.[0] || null)}/><small>Uploads to Cloudinary and stores its URL in Neon.</small></label>
          </div>
          <div><button className="btn btn-gold" disabled={uploading}>{uploading ? "Uploading..." : editing ? "Save changes" : "Add content"}</button>{" "}<button type="button" className="btn btn-light" onClick={() => { setEditing(null); setForm(current.defaults); setImageFile(null); }}>Clear</button></div>
        </form>
        {loading ? <p className="empty-state">Loading...</p> : (
          <div className="table-wrap">
            <table><thead><tr><th>Name</th><th>Description</th><th>Image</th><th>Actions</th></tr></thead>
              <tbody>{items[active].length === 0 ? <tr><td colSpan="4" className="empty-state">No content added yet.</td></tr> : items[active].map((item) => (
                <tr key={item.id}><td>{item.name}</td><td style={{ maxWidth: 360, whiteSpace: "normal" }}>{item.description}</td><td>{item.image}</td>
                  <td><button className="btn btn-small btn-light" onClick={() => { setEditing(item); setForm(item); }}><Pencil size={13}/> Edit</button>{" "}
                    <button className="btn btn-small btn-light" onClick={() => remove(item.id)}><Trash2 size={13}/> Delete</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
