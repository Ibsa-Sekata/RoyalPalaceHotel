import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, BedDouble, Users, Plus, X, Utensils } from "lucide-react";
import { myBookingsApi } from "../../api/myBookingsApi.js";
import { diningReservationsApi } from "../../api/diningReservationsApi.js";
import { useAuth } from "../../context/useAuth.js";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [diningReservations, setDiningReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);
  const [flash, setFlash] = useState("");
  const [receipt, setReceipt] = useState({});

  const load = async () => {
    setLoading(true); setError("");
    try {
      const [res, diningRes] = await Promise.all([myBookingsApi.list(), diningReservationsApi.mine()]);
      setBookings(res.data || []);
      setDiningReservations(diningRes.data || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const cancelDiningReservation = async (id) => {
    if (!window.confirm("Cancel this dining reservation?")) return;
    setBusy(`dining-${id}`);
    try {
      await diningReservationsApi.cancel(id);
      setFlash("Dining reservation cancelled");
      await load();
    } catch (e) { setError(e.message); }
    finally { setBusy(null); }
  };

  useEffect(() => { load(); }, []);

  const cancelBooking = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setBusy(id); setFlash("");
    try {
      await myBookingsApi.cancel(id);
      setFlash("Booking cancelled");
      await load();
    } catch (e) {
      setError(e.message);
    } finally { setBusy(null); }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Delete this booking permanently? Payment receipts will also be deleted.")) return;
    setBusy(id); setError(""); setFlash("");
    try {
      await myBookingsApi.remove(id);
      setFlash("Booking deleted");
      await load();
    } catch (e) { setError(e.message); }
    finally { setBusy(null); }
  };

  const submitReceipt = async (booking) => {
    const selected = receipt[booking.id]?.file;
    if (!selected) return setError("Choose a receipt file first.");
    setBusy(booking.id); setError(""); setFlash("");
    try {
      const data = new FormData();
      data.append("receipt", selected);
      data.append("amount", receipt[booking.id]?.amount || booking.totalAmount);
      data.append("method", receipt[booking.id]?.method || "BANK_TRANSFER");
      await myBookingsApi.submitReceipt(booking.id, data);
      setReceipt({ ...receipt, [booking.id]: {} });
      setFlash("Receipt submitted. The hotel will review and confirm your booking.");
      await load();
    } catch (e) { setError(e.message); }
    finally { setBusy(null); }
  };

  const statusBadge = (status) => {
    const map = {
      PENDING: { bg: "#fff4dc", fg: "#a67819" },
      CONFIRMED: { bg: "#e9f6ed", fg: "#39845a" },
      CHECKED_IN: { bg: "#eaf2ff", fg: "#386fb4" },
      CHECKED_OUT: { bg: "#f3f4f6", fg: "#686e75" },
      CANCELLED: { bg: "#fdecec", fg: "#c05d5d" },
      NO_SHOW: { bg: "#fdecec", fg: "#c05d5d" },
    };
    const s = map[status] || { bg: "#f3f4f6", fg: "#686e75" };
    return (
      <span style={{
        fontSize: 10, fontWeight: 600, padding: "5px 10px", borderRadius: 20,
        background: s.bg, color: s.fg,
      }}>
        {status.replace("_", " ")}
      </span>
    );
  };

  const canCancel = (b) => {
    if (!["PENDING", "CONFIRMED"].includes(b.status)) return false;
    const checkIn = new Date(b.checkIn);
    checkIn.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today < checkIn;
  };

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <span style={{ fontSize: 9, letterSpacing: 2.4, color: "#a17b36", fontWeight: 700 }}>
          MY STAYS
        </span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 500, margin: "6px 0", color: "#20242a" }}>
          Welcome back, {user?.fullName?.split(" ")[0] || "Guest"}
        </h1>
        <p style={{ fontSize: 13, color: "#8892a0", margin: 0 }}>
          Manage your reservations and stay history.
        </p>
      </div>

      {flash && (
        <div style={{ background: "#e9f6ed", color: "#39845a", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 12 }}>
          {flash}
        </div>
      )}

      {error && (
        <div style={{ background: "#fdecec", color: "#c05d5d", padding: "12px 16px", borderRadius: 8, marginBottom: 16, fontSize: 12 }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#20242a", margin: 0 }}>
          Your bookings ({bookings.length})
        </h2>
        <Link to="/booking" className="btn btn-gold" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Plus size={14}/> Book a room
        </Link>
        <Link to="/dining" className="btn btn-light" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Utensils size={14}/> Browse dining
        </Link>
      </div>

      {diningReservations.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#20242a" }}>Dining reservations</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {diningReservations.map((reservation) => (
              <div key={reservation.id} style={{ background: "#fff", border: "1px solid #eef0f3", borderRadius: 14, padding: "16px 20px", display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center" }}>
                <div>
                  <b>{reservation.restaurantName}</b>
                  <div style={{ fontSize: 12, color: "#8892a0", marginTop: 5 }}>
                    {new Date(reservation.reservationStart).toLocaleString()} · {reservation.guests} guests · Table {reservation.tableNumber || "assigned"}
                  </div>
                  <div style={{ fontSize: 11, color: "#a17b36", marginTop: 4 }}>{reservation.confirmationNumber} · {reservation.status}</div>
                </div>
                {reservation.status !== "CANCELLED" && new Date(reservation.reservationStart) > new Date() && (
                  <button className="btn btn-small btn-light" disabled={busy === `dining-${reservation.id}`} onClick={() => cancelDiningReservation(reservation.id)}>
                    {busy === `dining-${reservation.id}` ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {loading ? (
        <p style={{ textAlign: "center", padding: 60, color: "#8892a0" }}>Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <div style={{
          background: "#fff", border: "1px solid #eef0f3", borderRadius: 14,
          padding: "60px 20px", textAlign: "center",
        }}>
          <CalendarDays size={48} color="#d9c79e" style={{ margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 8px" }}>No bookings yet</h3>
          <p style={{ fontSize: 13, color: "#8892a0", marginBottom: 20 }}>
            Explore our rooms and book your first stay.
          </p>
          <Link to="/rooms" className="btn btn-gold">Browse rooms</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {bookings.map(b => (
            <div key={b.id} style={{
              background: "#fff", border: "1px solid #eef0f3", borderRadius: 14,
              padding: "20px 22px", boxShadow: "0 2px 10px rgba(7,17,29,0.03)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#a17b36", fontWeight: 600, letterSpacing: 1 }}>
                    {b.bookingNumber}
                  </div>
                  <h3 style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", margin: "4px 0 0", color: "#20242a" }}>
                    {b.room?.name}
                  </h3>
                  <div style={{ fontSize: 11, color: "#8892a0", marginTop: 4 }}>
                    Reserved by <b style={{ color: "#555b64" }}>{b.guest?.fullName || user?.fullName}</b>
                    {b.guest?.phone && <> · {b.guest.phone}</>}
                  </div>
                </div>
                {statusBadge(b.status)}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#555b64" }}>
                  <CalendarDays size={14} color="#a17b36"/>
                  <div>
                    <div style={{ fontSize: 9, color: "#8892a0", letterSpacing: 1 }}>CHECK-IN</div>
                    <b>{new Date(b.checkIn).toLocaleDateString()}</b>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#555b64" }}>
                  <CalendarDays size={14} color="#a17b36"/>
                  <div>
                    <div style={{ fontSize: 9, color: "#8892a0", letterSpacing: 1 }}>CHECK-OUT</div>
                    <b>{new Date(b.checkOut).toLocaleDateString()}</b>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#555b64" }}>
                  <Users size={14} color="#a17b36"/>
                  <div>
                    <div style={{ fontSize: 9, color: "#8892a0", letterSpacing: 1 }}>GUESTS</div>
                    <b>{b.guests}</b>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#555b64" }}>
                  <BedDouble size={14} color="#a17b36"/>
                  <div>
                    <div style={{ fontSize: 9, color: "#8892a0", letterSpacing: 1 }}>ROOM</div>
                    <b>{b.room?.roomNumber}</b>
                  </div>
                </div>
              </div>

              {b.specialRequests && (
                <div style={{ fontSize: 11, color: "#8892a0", fontStyle: "italic", marginBottom: 12 }}>
                  "{b.specialRequests}"
                </div>
              )}

              {["PENDING", "CONFIRMED"].includes(b.status) && (
                <div style={{ background: "#fafbfc", border: "1px dashed #e9e5dc", borderRadius: 8, padding: 14, marginBottom: 14 }}>
                  <b style={{ fontSize: 12 }}>Pay and upload receipt</b>
                  <p style={{ fontSize: 11, color: "#8892a0", margin: "5px 0 10px" }}>You may submit multiple payments. Each receipt is reviewed by the hotel.</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <input type="number" min="1" placeholder={`Amount (total ETB ${Number(b.totalAmount).toLocaleString()})`} value={receipt[b.id]?.amount || ""} onChange={e=>setReceipt({...receipt,[b.id]:{...receipt[b.id],amount:e.target.value}})} />
                    <select value={receipt[b.id]?.method || "BANK_TRANSFER"} onChange={e=>setReceipt({...receipt,[b.id]:{...receipt[b.id],method:e.target.value}})}>
                      <option>BANK_TRANSFER</option><option>MOBILE_MONEY</option><option>CASH</option><option>CARD</option>
                    </select>
                    <input type="file" accept=".pdf,image/jpeg,image/png,image/webp" onChange={e=>setReceipt({...receipt,[b.id]:{...receipt[b.id],file:e.target.files[0]}})} />
                    <button className="btn btn-small btn-gold" disabled={busy === b.id} onClick={() => submitReceipt(b)}>
                      {busy === b.id ? "Uploading..." : "Submit receipt"}
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid #f0f1f2" }}>
                <div>
                  <div style={{ fontSize: 10, color: "#8892a0" }}>Total</div>
                  <b style={{ fontSize: 20, fontFamily: "'Playfair Display', serif", color: "#20242a" }}>
                    ETB {Number(b.totalAmount).toLocaleString()}
                  </b>
                </div>
                {canCancel(b) && (
                  <button
                    className="btn btn-small btn-light"
                    disabled={busy === b.id}
                    onClick={() => cancelBooking(b.id)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#c05d5d" }}
                  >
                    <X size={13}/> {busy === b.id ? "Cancelling..." : "Cancel booking"}
                  </button>
                )}
                <button
                  className="btn btn-small btn-light"
                  disabled={busy === b.id}
                  onClick={() => deleteBooking(b.id)}
                  style={{ color: "#c05d5d" }}
                >
                  {busy === b.id ? "Deleting..." : "Delete booking"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}