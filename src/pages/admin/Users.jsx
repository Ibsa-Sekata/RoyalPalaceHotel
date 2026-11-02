import React, { useEffect, useState } from "react";
import { Plus, RotateCw, Shield } from "lucide-react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { usersApi } from "../../api/usersApi.js";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [adminCount, setAdminCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(null);
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "" });

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await usersApi.list();
      setUsers(res.data || []);
      setAdminCount((res.data || []).filter(u => u.role === "ADMIN").length);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    if (adminCount >= 2) {
      alert("Maximum 2 admins already reached.");
      return;
    }
    try {
      await usersApi.create({ ...form, role: "ADMIN" });
      setShowForm(false);
      setForm({ fullName: "", email: "", password: "", phone: "" });
      await load();
    } catch (e) { alert(e.message); }
  };

  const toggleStatus = async (u) => {
    setBusy(u.id);
    const nextStatus = u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try { await usersApi.setStatus(u.id, nextStatus); await load(); }
    catch (e) { alert(e.message); }
    finally { setBusy(null); }
  };

  const initials = (n) => n.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();
  const canAddAdmin = adminCount < 2;

  return (
    <>
      <AdminPageHeader
        title="User management"
        description="Manage staff accounts. Maximum 2 admin accounts allowed."
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-light" onClick={load}><RotateCw size={15}/> Refresh</button>
            <button
              className="btn btn-gold"
              onClick={() => setShowForm(!showForm)}
              disabled={!canAddAdmin}
              title={!canAddAdmin ? "Maximum 2 admins reached" : ""}
            >
              <Plus size={16}/> Add admin
            </button>
          </div>
        }
      />
      {error && <p style={{ color: "#c05d5d" }}>{error}</p>}

      <div className="stat-grid compact-stats">
        <div className="stat-card">
          <p>Admins</p>
          <strong>{adminCount} / 2</strong>
          <small>{canAddAdmin ? "1 slot available" : "Limit reached"}</small>
        </div>
        <div className="stat-card"><p>Total users</p><strong>{users.length}</strong></div>
      </div>

      {showForm && canAddAdmin && (
        <section className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-heading"><div><h2>Create admin</h2><p>Only 2 admin accounts allowed in total.</p></div></div>
          <form onSubmit={create} style={{ padding: "12px 18px", display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr 1fr 1fr auto" }}>
            <input placeholder="Full name" required value={form.fullName} onChange={e=>setForm({...form, fullName: e.target.value})}/>
            <input type="email" placeholder="Email" required value={form.email} onChange={e=>setForm({...form, email: e.target.value})}/>
            <input type="password" placeholder="Password" required minLength="8" value={form.password} onChange={e=>setForm({...form, password: e.target.value})}/>
            <input type="tel" placeholder="Phone (optional)" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})}/>
            <button className="btn btn-gold">Create</button>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="5" className="empty-state">Loading…</td></tr>
                : users.length === 0 ? <tr><td colSpan="5" className="empty-state">No users yet.</td></tr>
                : users.map(u => (
                  <tr key={u.id}>
                    <td><span className="guest-cell"><i>{initials(u.fullName)}</i><b>{u.fullName}</b></span></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`status ${u.role === "ADMIN" ? "status-confirmed" : ""}`}>
                        {u.role === "ADMIN" && <Shield size={10} style={{ marginRight: 4, verticalAlign: "middle" }}/>}
                        {u.role}
                      </span>
                    </td>
                    <td><span className={`status status-${u.status.toLowerCase()}`}>{u.status}</span></td>
                    <td>
                      <button className="btn btn-small btn-light" disabled={busy===u.id} onClick={() => toggleStatus(u)}>
                        {busy===u.id ? "…" : (u.status === "ACTIVE" ? "Deactivate" : "Activate")}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}