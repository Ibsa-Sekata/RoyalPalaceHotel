import React, { useEffect, useState } from "react";
import { Search, RotateCw, Plus, Pencil, Trash2 } from "lucide-react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { roomsApi } from "../../api/roomsApi.js";

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const blank = { roomNumber: "", name: "", type: "Standard", pricePerNight: "", maxGuests: 2, beds: "1 King", size: "", image: "", description: "", status: "AVAILABLE" };
  const [form, setForm] = useState(blank);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await roomsApi.list({ search: query, limit: 50 });
      setRooms(res.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => { e.preventDefault(); load(); };
  const save = async (e) => {
    e.preventDefault();
    try {
      const body = { ...form, pricePerNight: Number(form.pricePerNight), maxGuests: Number(form.maxGuests) };
      if (editing) await roomsApi.update(editing.id, body); else await roomsApi.create(body);
      setEditing(null); setForm(blank); await load();
    } catch (e) { alert(e.message); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this room? Rooms with bookings cannot be deleted.")) return;
    try { await roomsApi.remove(id); await load(); } catch (e) { alert(e.message); }
  };

  return (
    <>
      <AdminPageHeader
        title="Room management"
        description="Live room inventory from your database."
        action={<div style={{display:"flex", gap:8}}><button className="btn btn-light" onClick={load}><RotateCw size={15}/> Refresh</button><button className="btn btn-gold" onClick={() => {setEditing(null); setForm(blank);}}><Plus size={15}/> Add room</button></div>}
      />
      <section className="panel">
        <div className="toolbar">
          <form className="table-search" onSubmit={handleSearch}>
            <Search size={16}/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search rooms..."/>
          </form>
          <span className="muted">{rooms.length} room(s)</span>
        </div>
        <form onSubmit={save} className="panel-form">
          <strong>{editing ? "Edit room details" : "Add a room"}</strong>
          <div className="form-grid">
            {[
              ["roomNumber","Room number"],["name","Room name"],["type","Type"],["pricePerNight","Price / night"],
              ["maxGuests","Max guests"],["beds","Beds"],["size","Size"],["image","Image key"]
            ].map(([key, label]) => <label key={key}>{label}<input required={["roomNumber","name","pricePerNight","maxGuests","beds","size"].includes(key)} type={["pricePerNight","maxGuests"].includes(key) ? "number" : "text"} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}/></label>)}
            <label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>AVAILABLE</option><option>BOOKED</option><option>CLEANING</option><option>MAINTENANCE</option><option>OUT_OF_SERVICE</option></select></label>
            <label>Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
          </div>
          <button className="btn btn-gold">{editing ? "Save changes" : "Create room"}</button>
          {editing && <button type="button" className="btn btn-light" onClick={()=>{setEditing(null);setForm(blank)}}>Cancel</button>}
        </form>
        {error && <p style={{ color: "#c05d5d", padding: "0 18px" }}>{error}</p>}
        {loading ? <p className="empty-state">Loading…</p> : (
          <div className="room-admin-grid">
            {rooms.map(r => (
              <article className="room-admin-card" key={r.id}>
                <img src={`https://images.unsplash.com/${r.image}?auto=format&fit=crop&w=700&q=80`} alt={r.name}/>
                <div>
                  <div className="room-admin-title">
                    <h3>{r.name}</h3>
                    <span className={`status status-${r.status.toLowerCase()}`}>{r.status}</span>
                  </div>
                  <p>{r.maxGuests} guests · {r.beds} · {r.size}</p>
                  <b>ETB {Number(r.pricePerNight).toLocaleString()} <small>/ night</small></b>
                  <div className="row-actions">
                    <button className="btn btn-small btn-light" onClick={() => { setEditing(r); setForm({...r, pricePerNight: Number(r.pricePerNight)}); }}><Pencil size={13}/> Edit</button>
                    <button className="btn btn-small btn-light" onClick={() => remove(r.id)}><Trash2 size={13}/> Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
