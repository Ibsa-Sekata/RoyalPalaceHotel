import React, { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, Clock3, Wrench, Trash2 } from "lucide-react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { housekeepingApi } from "../../api/housekeepingApi.js";
import { roomsApi } from "../../api/roomsApi.js";

export default function Housekeeping() {
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [newTask, setNewTask] = useState({ roomId: "", taskType: "CLEANING", description: "", priority: "NORMAL" });

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [t, r] = await Promise.all([housekeepingApi.list(), roomsApi.list({ limit: 50 })]);
      setTasks(t.data || []); setRooms(r.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const act = async (id, fn) => {
    setBusy(id);
    try { await fn(id); await load(); }
    catch (e) { alert(e.message); }
    finally { setBusy(null); }
  };

  const create = async (e) => {
    e.preventDefault();
    if (!newTask.roomId) return;
    try {
      await housekeepingApi.create({ ...newTask, roomId: Number(newTask.roomId) });
      setNewTask({ roomId: "", taskType: "CLEANING", description: "", priority: "NORMAL" });
      await load();
    } catch (e) { alert(e.message); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this housekeeping task?")) return;
    try { await housekeepingApi.remove(id); await load(); } catch (e) { alert(e.message); }
  };

  const pending = tasks.filter(t => t.status === "PENDING").length;
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const completed = tasks.filter(t => t.status === "COMPLETED").length;

  return (
    <>
      <AdminPageHeader title="Housekeeping dashboard" description="Live task queue from your database."/>
      {error && <p style={{ color: "#c05d5d" }}>{error}</p>}

      <div className="stat-grid">
        <div className="stat-card"><span className="stat-icon"><Sparkles/></span><p>Pending</p><strong>{pending}</strong></div>
        <div className="stat-card"><span className="stat-icon"><Clock3/></span><p>In progress</p><strong>{inProgress}</strong></div>
        <div className="stat-card"><span className="stat-icon"><CheckCircle2/></span><p>Completed</p><strong>{completed}</strong></div>
        <div className="stat-card"><span className="stat-icon"><Wrench/></span><p>Total tasks</p><strong>{tasks.length}</strong></div>
      </div>

      <section className="panel">
        <div className="panel-heading"><div><h2>Create task</h2><p>Schedule cleaning or maintenance.</p></div></div>
        <form onSubmit={create} style={{ padding: "12px 18px", display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr 1fr 1fr auto" }}>
          <select value={newTask.roomId} onChange={e=>setNewTask({...newTask, roomId: e.target.value})} required>
            <option value="">Choose room…</option>
            {rooms.map(r => <option key={r.id} value={r.id}>{r.roomNumber} — {r.name}</option>)}
          </select>
          <select value={newTask.taskType} onChange={e=>setNewTask({...newTask, taskType: e.target.value})}>
            <option>CLEANING</option><option>DEEP_CLEANING</option><option>LINENS</option>
            <option>INSPECTION</option><option>MAINTENANCE</option>
          </select>
          <input placeholder="Description" value={newTask.description} onChange={e=>setNewTask({...newTask, description: e.target.value})}/>
          <select value={newTask.priority} onChange={e=>setNewTask({...newTask, priority: e.target.value})}>
            <option>LOW</option><option>NORMAL</option><option>HIGH</option>
          </select>
          <button className="btn btn-gold">Create</button>
        </form>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <div className="panel-heading"><div><h2>Task queue</h2><p>All current housekeeping tasks.</p></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Room</th><th>Type</th><th>Description</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="6" className="empty-state">Loading…</td></tr>
                : tasks.length === 0 ? <tr><td colSpan="6" className="empty-state">No tasks yet. Create one above.</td></tr>
                : tasks.map(t => (
                  <tr key={t.id}>
                    <td>{t.room?.roomNumber} — {t.room?.name}</td>
                    <td>{t.taskType.replace(/_/g," ")}</td>
                    <td>{t.description || "—"}</td>
                    <td><span className="status">{t.priority}</span></td>
                    <td><span className={`status status-${t.status.toLowerCase().replace(/_/g,"-")}`}>{t.status.replace(/_/g," ")}</span></td>
                    <td>
                      {t.status === "PENDING" && (
                        <button className="btn btn-small btn-gold" disabled={busy===t.id} onClick={() => act(t.id, housekeepingApi.start)}>Start</button>
                      )}
                      {t.status === "IN_PROGRESS" && (
                        <button className="btn btn-small btn-light" disabled={busy===t.id} onClick={() => act(t.id, housekeepingApi.complete)}>Complete</button>
                      )}
                      <button className="btn btn-small btn-light" disabled={busy===t.id} onClick={() => remove(t.id)}><Trash2 size={13}/> Delete</button>
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
