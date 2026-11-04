import React, { useEffect, useState } from "react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { bookingsApi } from "../../api/bookingsApi.js";
import { Trash2 } from "lucide-react";

export default function CheckInOut() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await bookingsApi.list({ limit: 100 });
      setRows(res.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const arrivals = rows.filter(b => b.status === "CONFIRMED").length;
  const inHouse = rows.filter(b => b.status === "CHECKED_IN").length;
  const pending = rows.filter(b => b.status === "PENDING").length;

  const action = async (b) => {
    setBusy(b.id);
    try {
      if (b.status === "CONFIRMED") await bookingsApi.checkIn(b.id);
      else if (b.status === "CHECKED_IN") await bookingsApi.checkOut(b.id);
      await load();
    } catch (e) { alert(e.message); }
    finally { setBusy(null); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    setBusy(id);
    try { await bookingsApi.remove(id); await load(); }
    catch (e) { alert(e.message); }
    finally { setBusy(null); }
  };

  return (
    <>
      <AdminPageHeader title="Check-in / Check-out" description="Coordinate arrivals and departures."/>
      {error && <p style={{ color: "#c05d5d" }}>{error}</p>}

      <div className="stat-grid compact-stats">
        <article className="stat-card"><p>Ready to check in</p><strong>{arrivals}</strong><small>Confirmed bookings</small></article>
        <article className="stat-card"><p>Currently checked in</p><strong>{inHouse}</strong><small>Ready to check out</small></article>
        <article className="stat-card"><p>Pending</p><strong>{pending}</strong><small>Awaiting confirmation</small></article>
        <article className="stat-card"><p>Total bookings</p><strong>{rows.length}</strong><small>All records</small></article>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div><h2>Guest movements</h2><p>Confirm room readiness before completing an action.</p></div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="6" className="empty-state">Loading…</td></tr>
                : rows.length === 0 ? <tr><td colSpan="6" className="empty-state">No bookings yet.</td></tr>
                : rows.map(b => (
                  <tr key={b.id}>
                    <td>{b.guest?.fullName}</td>
                    <td>{b.room?.roomNumber} — {b.room?.name}</td>
                    <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                    <td><span className={`status status-${b.status.toLowerCase().replace(/_/g,"-")}`}>{b.status.replace("_"," ")}</span></td>
                    <td>
                      {b.status === "CONFIRMED" && (
                        <button className="btn btn-small btn-gold" disabled={busy===b.id} onClick={() => action(b)}>
                          {busy===b.id ? "…" : "Check in"}
                        </button>
                      )}
                      {b.status === "CHECKED_IN" && (
                        <button className="btn btn-small btn-light" disabled={busy===b.id} onClick={() => action(b)}>
                          {busy===b.id ? "…" : "Check out"}
                        </button>
                      )}
                      <button className="btn btn-small btn-light" disabled={busy===b.id} onClick={() => remove(b.id)}><Trash2 size={13}/> Delete</button>
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
