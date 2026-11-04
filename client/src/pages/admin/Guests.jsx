import React, { useEffect, useState } from "react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { guestsApi } from "../../api/guestsApi.js";

export default function Guests() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const blank = { fullName: "", email: "", phone: "", nationality: "", guestType: "NEW", notes: "" };
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    guestsApi.list()
      .then(res => setGuests(res.data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  const save = async (e) => {
    e.preventDefault();
    try { if (editing) await guestsApi.update(editing.id, form); else await guestsApi.create(form); setEditing(null); setForm(blank); load(); }
    catch (e) { alert(e.message); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this guest? Guests with bookings cannot be deleted.")) return;
    try { await guestsApi.remove(id); load(); } catch (e) { alert(e.message); }
  };

  const initials = (n) => n.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();

  return (
    <>
      <AdminPageHeader title="Guest directory" description="All guests stored in your database." action={<button className="btn btn-gold" onClick={()=>{setEditing(null);setForm(blank)}}><Plus size={15}/> Add guest</button>}/>
      <section className="panel">
        <form onSubmit={save} className="panel-form">
          <strong>{editing ? "Edit guest" : "Add guest"}</strong>
          <div className="form-grid">
            <label>Full name<input required value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}/></label>
            <label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
            <label>Phone<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label>
            <label>Nationality<input value={form.nationality} onChange={e=>setForm({...form,nationality:e.target.value})}/></label>
            <label>Guest type<select value={form.guestType} onChange={e=>setForm({...form,guestType:e.target.value})}><option>NEW</option><option>RETURNING</option><option>VIP</option></select></label>
            <label>Notes<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></label>
          </div>
          <button className="btn btn-gold">{editing ? "Save changes" : "Create guest"}</button>
          {editing && <button type="button" className="btn btn-light" onClick={()=>{setEditing(null);setForm(blank)}}>Cancel</button>}
        </form>
        {error && <p style={{ color: "#c05d5d", padding: "0 18px" }}>{error}</p>}
        <div className="table-wrap">
          <table>
            <thead><tr><th>Guest</th><th>Email</th><th>Phone</th><th>Type</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="6" className="empty-state">Loading…</td></tr>
                : guests.length === 0 ? <tr><td colSpan="6" className="empty-state">No guests yet. They appear automatically when bookings are made.</td></tr>
                : guests.map(g => (
                  <tr key={g.id}>
                    <td><span className="guest-cell"><i>{initials(g.fullName)}</i><b>{g.fullName}</b></span></td>
                    <td>{g.email || "—"}</td>
                    <td>{g.phone || "—"}</td>
                    <td><span className="status status-confirmed">{g.guestType}</span></td>
                    <td>{new Date(g.createdAt).toLocaleDateString()}</td>
                    <td><button className="btn btn-small btn-light" onClick={()=>{setEditing(g);setForm({...blank,...g})}}><Pencil size={13}/> Edit</button>{" "}<button className="btn btn-small btn-light" onClick={()=>remove(g.id)}><Trash2 size={13}/> Delete</button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
