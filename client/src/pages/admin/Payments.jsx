import React, { useEffect, useState } from "react";
import { Download, Plus, RotateCw, Trash2 } from "lucide-react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { paymentsApi } from "../../api/paymentsApi.js";
import { bookingsApi } from "../../api/bookingsApi.js";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ bookingId: "", method: "CASH", status: "PAID" });

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [p, b] = await Promise.all([paymentsApi.list(), bookingsApi.list({ limit: 100 })]);
      setPayments(p.data || []); setBookings(b.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const createPayment = async (e) => {
    e.preventDefault();
    if (!form.bookingId) return;
    try {
      await paymentsApi.create({ ...form, bookingId: Number(form.bookingId) });
      setShowForm(false);
      setForm({ bookingId: "", method: "CASH", status: "PAID" });
      await load();
    } catch (e) { alert(e.message); }
  };

  const paid = payments.filter(p => p.status === "PAID");
  const unpaid = payments.filter(p => p.status !== "PAID");
  const totalPaid = paid.reduce((s, p) => s + Number(p.amount), 0);
  const totalUnpaid = unpaid.reduce((s, p) => s + Number(p.amount), 0);

  const viewInvoice = (id) => {
    const url = paymentsApi.invoiceUrl(id);
    const token = localStorage.getItem("token");
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.text())
      .then(html => {
        const w = window.open("", "_blank");
        w.document.write(html);
        w.document.close();
      })
      .catch(e => alert(e.message));
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this payment record permanently?")) return;
    try { await paymentsApi.remove(id); await load(); } catch (e) { alert(e.message); }
  };
  const review = async (id, approve) => {
    try { await (approve ? paymentsApi.approve(id) : paymentsApi.reject(id)); await load(); }
    catch (e) { alert(e.message); }
  };

  return (
    <>
      <AdminPageHeader
        title="Payments & invoices"
        description="Live payment records from your database."
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-light" onClick={load}><RotateCw size={15}/> Refresh</button>
            <button className="btn btn-gold" onClick={() => setShowForm(!showForm)}><Plus size={16}/> New payment</button>
          </div>
        }
      />
      {error && <p style={{ color: "#c05d5d" }}>{error}</p>}

      <div className="stat-grid compact-stats">
        <div className="stat-card"><p>Collected</p><strong>ETB {totalPaid.toLocaleString()}</strong><small>{paid.length} payments</small></div>
        <div className="stat-card"><p>Pending</p><strong>ETB {totalUnpaid.toLocaleString()}</strong><small>{unpaid.length} unpaid</small></div>
        <div className="stat-card"><p>Total invoices</p><strong>{payments.length}</strong><small>All records</small></div>
        <div className="stat-card"><p>Collection rate</p><strong>{payments.length ? Math.round((paid.length/payments.length)*100) : 0}%</strong><small>Paid / total</small></div>
      </div>

      {showForm && (
        <section className="panel" style={{ marginBottom: 16 }}>
          <div className="panel-heading"><div><h2>Create payment</h2><p>Record a payment for a booking.</p></div></div>
          <form onSubmit={createPayment} style={{ padding: "12px 18px", display: "grid", gap: 10, gridTemplateColumns: "2fr 1fr 1fr auto" }}>
            <select value={form.bookingId} onChange={e=>setForm({...form, bookingId: e.target.value})} required>
              <option value="">Choose booking…</option>
              {bookings.map(b => <option key={b.id} value={b.id}>{b.bookingNumber} — {b.guest?.fullName} (ETB {Number(b.totalAmount).toLocaleString()})</option>)}
            </select>
            <select value={form.method} onChange={e=>setForm({...form, method: e.target.value})}>
              <option>CASH</option><option>CARD</option><option>BANK_TRANSFER</option><option>MOBILE_MONEY</option>
            </select>
            <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})}>
              <option>PAID</option><option>PARTIAL</option><option>UNPAID</option>
            </select>
            <button className="btn btn-gold">Save</button>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Invoice #</th><th>Booking</th><th>Guest</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="8" className="empty-state">Loading…</td></tr>
                : payments.length === 0 ? <tr><td colSpan="8" className="empty-state">No payments recorded yet.</td></tr>
                : payments.map(p => (
                  <tr key={p.id}>
                    <td className="gold-text">{p.invoiceNumber}</td>
                    <td>{p.booking?.bookingNumber}</td>
                    <td>{p.booking?.guest?.fullName}</td>
                    <td>ETB {Number(p.amount).toLocaleString()}</td>
                    <td>{p.method}{p.receiptName && <div><a className="text-link" href={`data:${p.receiptMimeType};base64,${p.receiptData}`} target="_blank" rel="noreferrer">View receipt</a></div>}</td>
                    <td><span className={`status status-${p.status.toLowerCase()}`}>{p.status}</span></td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>
                      {p.receiptName && p.status === "UNPAID" && <><button className="btn btn-small btn-gold" onClick={() => review(p.id, true)}>Approve</button>{" "}<button className="btn btn-small btn-light" onClick={() => review(p.id, false)}>Reject</button>{" "}</>}
                      <button className="btn btn-small btn-light" onClick={() => viewInvoice(p.id)}><Download size={13}/> Invoice</button>{" "}<button className="btn btn-small btn-light" onClick={() => remove(p.id)}><Trash2 size={13}/> Delete</button>
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
