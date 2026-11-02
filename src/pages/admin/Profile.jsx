import React, { useState } from "react";
import { CircleUserRound, Lock } from "lucide-react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { useAuth } from "../../context/useAuth.js";
import { apiRequest } from "../../api/client.js";

export default function Profile() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [message, setMessage] = useState("");
  const [pwMessage, setPwMessage] = useState("");

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

  const changePassword = async (e) => {
    e.preventDefault();
    setChangingPw(true); setPwMessage("");
    try {
      await apiRequest("/auth/change-password", { method: "POST", body: pwForm });
      setPwMessage("Password changed successfully");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (e) {
      setPwMessage(e.message);
    } finally { setChangingPw(false); }
  };

  const roleLabel = user?.role
    ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
    : "Admin";

  return (
    <>
      <AdminPageHeader title="My profile" description="Manage your personal admin account."/>
      <section className="panel profile-panel">
        <div className="profile-avatar"><CircleUserRound size={52}/></div>
        <div>
          <h2>{user?.fullName || "Admin"}</h2>
          <p>{roleLabel} · Royal Palace Hotel</p>
        </div>
        <form className="settings-form" onSubmit={save}>
          {message && (
            <p style={{ color: message.startsWith("Profile updated") ? "#39845a" : "#c05d5d" }}>
              {message}
            </p>
          )}
          <div className="form-two">
            <label>Full name
              <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}/>
            </label>
            <label>Email address
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}/>
            </label>
            <label>Phone number
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/>
            </label>
            <label>Role
              <input value={roleLabel} disabled/>
            </label>
          </div>
          <button className="btn btn-gold" disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </button>
        </form>

        <hr style={{ margin: "32px 0", border: "none", borderTop: "1px solid #eef0f3" }}/>

        <form className="settings-form" onSubmit={changePassword}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Lock size={16} color="#a17b36"/>
            <h3 style={{ fontSize: 14, margin: 0, color: "#20242a" }}>Change password</h3>
          </div>
          {pwMessage && (
            <p style={{ color: pwMessage.startsWith("Password changed") ? "#39845a" : "#c05d5d" }}>
              {pwMessage}
            </p>
          )}
          <div className="form-two">
            <label>Current password
              <input type="password" required value={pwForm.currentPassword}
                onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}/>
            </label>
            <label>New password
              <input type="password" required minLength="8" value={pwForm.newPassword}
                onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}/>
            </label>
          </div>
          <button className="btn btn-gold" disabled={changingPw}>
            {changingPw ? "Changing..." : "Change password"}
          </button>
        </form>
      </section>
    </>
  );
}