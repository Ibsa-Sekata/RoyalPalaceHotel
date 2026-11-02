import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SectionHeading from "../../components/SectionHeading.jsx";
import { roomsApi } from "../../api/roomsApi.js";
import { bookingsApi } from "../../api/bookingsApi.js";
import { useAuth } from "../../context/useAuth.js";
import { Lock, User, Mail, Phone } from "lucide-react";

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    roomId: params.get("roomId") || "",
    guests: "2",
    specialRequests: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    roomsApi.list({ limit: 50 }).then(r => setRooms(r.data || [])).catch(e => setError(e.message));
  }, []);

  useEffect(() => {
    if (!user) {
      const redirect = "/booking" + (params.toString() ? "?" + params.toString() : "");
      navigate("/login", { state: { from: redirect }, replace: true });
    }
  }, [user, navigate, params]);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(null); setLoading(true);
    try {
      const res = await bookingsApi.create({
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        roomId: Number(form.roomId),
        guests: Number(form.guests),
        specialRequests: form.specialRequests,
      });
      setSuccess(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <section className="section internal-section" style={{ padding: 80, textAlign: "center" }}>
        <Lock size={40} color="#a17b36" style={{ margin: "0 auto 16px" }}/>
        <h2 style={{ fontFamily: "'Playfair Display', serif" }}>Please sign in to book</h2>
        <p style={{ color: "#8892a0" }}>Redirecting you to login...</p>
      </section>
    );
  }

  if (success) {
    return (
      <>
        <section className="page-hero small-hero">
          <div className="internal-page-container">
            <SectionHeading title="Booking confirmed!" text="Your reservation has been saved."/>
          </div>
        </section>
        <section className="section internal-section" style={{ maxWidth: 600, margin: "0 auto" }}>
          <div className="form-card">
            <h2>Booking {success.bookingNumber}</h2>
            <p>Thank you, {success.guest?.fullName}. Here are your details:</p>
            <ul style={{ lineHeight: 2 }}>
              <li><b>Room:</b> {success.room?.name}</li>
              <li><b>Check-in:</b> {new Date(success.checkIn).toLocaleDateString()}</li>
              <li><b>Check-out:</b> {new Date(success.checkOut).toLocaleDateString()}</li>
              <li><b>Guests:</b> {success.guests}</li>
              <li><b>Subtotal:</b> ETB {Number(success.subtotal).toLocaleString()}</li>
              <li><b>VAT (15%):</b> ETB {Number(success.tax).toLocaleString()}</li>
              <li><b>Total:</b> ETB {Number(success.totalAmount).toLocaleString()}</li>
            </ul>
            <Link to="/my-bookings" className="btn btn-gold">View my bookings</Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="page-hero small-hero">
        <div className="internal-page-container">
          <SectionHeading title="Make your stay yours" text="Share your dates and preferences to begin your Royal Palace experience."/>
        </div>
      </section>

      <section className="section internal-section booking-page">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Reservation details</h2>

          <div style={{
            background: "#fafbfc", padding: "14px 16px", borderRadius: 8,
            marginBottom: 16, border: "1px dashed #e9e5dc",
          }}>
            <div style={{ fontSize: 10, color: "#8892a0", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>
              YOUR DETAILS (from your account)
            </div>
            <div style={{ display: "grid", gap: 6, fontSize: 12, color: "#555b64" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <User size={14} color="#a17b36"/> <b>{user.fullName}</b>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mail size={14} color="#a17b36"/> {user.email}
              </span>
              {user.phone && (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Phone size={14} color="#a17b36"/> {user.phone}
                </span>
              )}
            </div>
            <Link to="/my-profile" style={{ fontSize: 11, color: "#9c762e", marginTop: 8, display: "inline-block" }}>
              Update my profile
            </Link>
          </div>

          {error && <p style={{ color: "#c05d5d" }}>{error}</p>}

          <div className="form-two">
            <label>Check-in
              <input type="date" required value={form.checkIn} onChange={update("checkIn")}/>
            </label>
            <label>Check-out
              <input type="date" required value={form.checkOut} onChange={update("checkOut")}/>
            </label>
            <label>Room
              <select required value={form.roomId} onChange={update("roomId")}>
                <option value="">Choose a room...</option>
                {rooms.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} - ETB {Number(r.pricePerNight).toLocaleString()}/night
                  </option>
                ))}
              </select>
            </label>
            <label>Guests
              <select value={form.guests} onChange={update("guests")}>
                <option value="1">1 adult</option>
                <option value="2">2 adults</option>
                <option value="3">3 adults</option>
                <option value="4">4 adults</option>
                <option value="5">5 adults</option>
              </select>
            </label>
          </div>

          <label>Special requests (optional)
            <textarea rows="3" value={form.specialRequests} onChange={update("specialRequests")} placeholder="Anything we should know?"/>
          </label>

          <button className="btn btn-gold full-width" disabled={loading}>
            {loading ? "Submitting..." : "Request reservation"}
          </button>
        </form>

        <aside className="booking-side">
          <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=85" alt="Luxury room"/>
          <h3>A stay worth looking forward to.</h3>
          <p>Need help choosing? Contact our guest services team.</p>
          <Link to="/contact" className="text-link">Contact guest services</Link>
        </aside>
      </section>
    </>
  );
}