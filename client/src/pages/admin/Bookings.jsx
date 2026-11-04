import React, { useEffect, useState } from "react";
import { Search, Download, RotateCw, Trash2 } from "lucide-react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { bookingsApi } from "../../api/bookingsApi.js";

export default function Bookings() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All Statuses");
  const [busy, setBusy] = useState(null);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const params = {};
      if (query) params.search = query;
      if (filter !== "All Statuses") params.status = filter.toUpperCase().replace(" ", "_");
      const res = await bookingsApi.list(params);
      setRows(res.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]);

  const handleSearch = (e) => { e.preventDefault(); load(); };

  const action = async (id, fn) => {
    setBusy(id);
    try { await fn(id); await load(); }
    catch (e) { alert(e.message); }
    finally { setBusy(null); }
  };

  return (
    <>
      <AdminPageHeader
        title="Bookings management"
        description="Live reservations from your database."
        action={
          <button className="btn btn-light" onClick={load}>
            <RotateCw size={15}/> Refresh
          </button>
        }
      />
      <section className="panel">
        <div className="toolbar">
          <form className="table-search" onSubmit={handleSearch}>
            <Search size={16}/>
            <input placeholder="Search booking or guest..." value={query} onChange={e => setQuery(e.target.value)}/>
          </form>
          <select className="select-button" value={filter} onChange={e => setFilter(e.target.value)}>
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Checked In</option>
            <option>Checked Out</option>
            <option>Cancelled</option>
          </select>
          <button className="btn btn-light" onClick={() => window.print()}>
            <Download size={15}/> Export
          </button>
        </div>

        {error && <p style={{ color: "#c05d5d", padding: "0 18px 12px" }}>{error}</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Booking #</th><th>Guest</th><th>Room</th>
                <th>Check-in</th><th>Check-out</th>
                <th>Status</th><th>Total</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="empty-state">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan="8" className="empty-state">No bookings match. Try the public Booking page.</td></tr>
              ) : rows.map(b => (
                <tr key={b.id}>
                  <td className="gold-text">{b.bookingNumber}</td>
                  <td>{b.guest?.fullName}</td>
                  <td>{b.room?.roomNumber} — {b.room?.name}</td>
                  <td>{new Date(b.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(b.checkOut).toLocaleDateString()}</td>
                  <td>
                    <span className={`status status-${b.status.toLowerCase().replace(/_/g,"-")}`}>
                      {b.status.replace("_"," ")}
                    </span>
                  </td>
                  <td>ETB {Number(b.totalAmount).toLocaleString()}</td>
                  <td>
                    {b.status === "PENDING" && (
                      <button className="btn btn-small btn-gold" disabled={busy===b.id}
                              onClick={() => action(b.id, bookingsApi.confirm)}>
                        {busy===b.id ? "…" : "Confirm"}
                      </button>
                    )}
                    {b.status === "CONFIRMED" && (
                      <>
                        <button className="btn btn-small btn-gold" disabled={busy===b.id}
                                onClick={() => action(b.id, bookingsApi.checkIn)}>Check in</button>
                        <button className="btn btn-small btn-light" disabled={busy===b.id}
                                onClick={() => action(b.id, bookingsApi.cancel)}>Cancel</button>
                      </>
                    )}
                    {b.status === "CHECKED_IN" && (
                      <button className="btn btn-small btn-light" disabled={busy===b.id}
                              onClick={() => action(b.id, bookingsApi.checkOut)}>Check out</button>
                    )}
                    <button className="btn btn-small btn-light" disabled={busy===b.id}
                            onClick={() => window.confirm("Delete this booking permanently?") && action(b.id, bookingsApi.remove)}>
                      <Trash2 size={13}/> Delete
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
