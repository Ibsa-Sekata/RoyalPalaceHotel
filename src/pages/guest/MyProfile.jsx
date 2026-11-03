import React, { useEffect, useState } from "react";
import { CircleUserRound, Mail, Phone, Crown, BedDouble, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/useAuth.js";
import { apiRequest } from "../../api/client.js";
import { diningReservationsApi } from "../../api/diningReservationsApi.js";

export default function MyProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [diningReservations, setDiningReservations] = useState([]);
  const [diningLoading, setDiningLoading] = useState(true);
  const [diningError, setDiningError] = useState("");

  useEffect(() => {
    diningReservationsApi.mine()
      .then((response) => setDiningReservations(response.data || []))
      .catch((error) => setDiningError(error.message))
      .finally(() => setDiningLoading(false));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage("");
    try {
      await apiRequest("/auth/profile", { method: "PATCH", body: form });
      setMessage("Profile updated successfully");
    } catch (e) {
      setMessage(e.message);
    } finally { setSaving(false); }
  };

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <span style={{ fontSize: 9, letterSpacing: 2.4, color: "#a17b36", fontWeight: 700 }}>
          MY ACCOUNT
        </span>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 500, margin: "6px 0", color: "#20242a" }}>
          Your profile
        </h1>
        <p style={{ fontSize: 13, color: "#8892a0", margin: 0 }}>
          Manage the personal details tied to your bookings.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <Link to="/rooms" className="btn btn-gold" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <BedDouble size={15}/> Browse rooms
        </Link>
        <Link to="/dining" className="btn btn-light" style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <Utensils size={15}/> Browse dining
        </Link>
      </div>

      <div style={{
        background: "#fff", border: "1px solid #eef0f3", borderRadius: 14,
        padding: "32px 28px", boxShadow: "0 2px 10px rgba(7,17,29,0.03)",
        maxWidth: 700,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "#f8f2e6", color: "#a17b36",
            display: "grid", placeItems: "center",
          }}>
            <CircleUserRound size={40}/>
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontFamily: "'Playfair Display', serif", margin: 0, color: "#20242a" }}>
              {user?.fullName}
            </h2>
            <div style={{ fontSize: 11, color: "#8892a0", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
              <Crown size={12} color="#a17b36"/> Guest account
            </div>
          </div>
        </div>

        {message && (
          <div style={{
            padding: "12px 16px", borderRadius: 8, marginBottom: 18, fontSize: 12,
            background: message.startsWith("Profile updated") ? "#e9f6ed" : "#fdecec",
            color: message.startsWith("Profile updated") ? "#39845a" : "#c05d5d",
          }}>
            {message}
          </div>
        )}

        <form onSubmit={save}>
          <div style={{ display: "grid", gap: 16, marginBottom: 20 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 600, color: "#555b64", letterSpacing: 0.5 }}>
              FULL NAME
              <input
                type="text"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                style={{ padding: "10px 12px", border: "1px solid #e9e5dc", borderRadius: 6, fontSize: 13, fontWeight: 400, color: "#20242a" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 600, color: "#555b64", letterSpacing: 0.5 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Mail size={12}/> EMAIL (read-only)
              </span>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                style={{ padding: "10px 12px", border: "1px solid #f0f1f2", borderRadius: 6, fontSize: 13, background: "#fafbfc", color: "#8892a0" }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 600, color: "#555b64", letterSpacing: 0.5 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Phone size={12}/> PHONE NUMBER
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+251..."
                style={{ padding: "10px 12px", border: "1px solid #e9e5dc", borderRadius: 6, fontSize: 13, fontWeight: 400, color: "#20242a" }}
              />
            </label>
          </div>

          <button className="btn btn-gold" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>

      <section style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 9, letterSpacing: 2.4, color: "#a17b36", fontWeight: 700 }}>
            DINING RESERVATIONS
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 500, margin: "6px 0", color: "#20242a" }}>
            Your booked tables
          </h2>
        </div>

        {diningError && <p style={{ color: "#c05d5d", fontSize: 12 }}>{diningError}</p>}
        {diningLoading ? (
          <p style={{ color: "#8892a0", fontSize: 13 }}>Loading dining reservations...</p>
        ) : diningReservations.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #eef0f3", borderRadius: 14, padding: "28px 24px" }}>
            <p style={{ color: "#8892a0", fontSize: 13, margin: "0 0 16px" }}>You have no dining reservations yet.</p>
            <Link to="/dining" className="btn btn-gold">Browse dining</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {diningReservations.map((reservation) => (
              <article key={reservation.id} style={{
                background: "#fff", border: "1px solid #eef0f3", borderRadius: 14,
                padding: "20px 22px", boxShadow: "0 2px 10px rgba(7,17,29,0.03)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#a17b36", fontWeight: 600, letterSpacing: 1 }}>
                      {reservation.confirmationNumber}
                    </div>
                    <h3 style={{ fontSize: 18, fontFamily: "'Playfair Display', serif", margin: "4px 0", color: "#20242a" }}>
                      {reservation.restaurantName}
                    </h3>
                  </div>
                  <span style={{
                    alignSelf: "flex-start", fontSize: 10, fontWeight: 600, padding: "5px 10px",
                    borderRadius: 20, background: reservation.status === "CANCELLED" ? "#fdecec" : "#e9f6ed",
                    color: reservation.status === "CANCELLED" ? "#c05d5d" : "#39845a",
                  }}>
                    {reservation.status.replace("_", " ")}
                  </span>
                </div>
                <div style={{ display: "grid", gap: 6, marginTop: 10, color: "#555b64", fontSize: 12 }}>
                  <span><b>Date and time:</b> {new Date(reservation.reservationStart).toLocaleString()}</span>
                  <span><b>Guests:</b> {reservation.guests}</span>
                  {reservation.tableNumber && <span><b>Table:</b> {reservation.tableNumber}</span>}
                  {reservation.specialRequests && <span><b>Requests:</b> {reservation.specialRequests}</span>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}