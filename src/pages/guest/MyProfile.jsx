import React, { useState } from "react";
import { CircleUserRound, Mail, Phone, Crown } from "lucide-react";
import { useAuth } from "../../context/useAuth.js";
import { apiRequest } from "../../api/client.js";

export default function MyProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage("");
    try {
      await apiRequest("/auth/profile", { method: "PATCH", body: form });
      setMessage("Ã¢Å“â€¦ Profile updated successfully");
    } catch (e) {
      setMessage("Ã¢ÂÅ’ " + e.message);
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
            background: message.startsWith("Ã¢Å“â€¦") ? "#e9f6ed" : "#fdecec",
            color: message.startsWith("Ã¢Å“â€¦") ? "#39845a" : "#c05d5d",
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
            {saving ? "SavingÃ¢â‚¬Â¦" : "Save changes"}
          </button>
        </form>
      </div>
    </>
  );
}