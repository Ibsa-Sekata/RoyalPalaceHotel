import React, { useEffect, useState } from "react";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { settingsApi } from "../../api/settingsApi.js";

export default function Settings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("General");

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await settingsApi.list();
      const map = {};
      (res.data || []).forEach(s => { map[s.key] = s.value; });
      setSettings(map);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Promise.all(Object.entries(settings).map(([k, v]) => settingsApi.update(k, v)));
      alert("Settings saved");
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const update = (k) => (e) => setSettings({ ...settings, [k]: e.target.value });

  return (
    <>
      <AdminPageHeader title="Settings" description="Hotel configuration stored in your database."/>
      {error && <p style={{ color: "#c05d5d" }}>{error}</p>}
      <section className="panel settings-panel">
        <div className="settings-tabs">
          {["General","Hotel info","Policies"].map(t => (
            <button className={tab===t?"settings-tab active":"settings-tab"} key={t} onClick={()=>setTab(t)}>{t}</button>
          ))}
        </div>
        {loading ? <p className="empty-state">Loading…</p> : (
          <form className="settings-form" onSubmit={save}>
            <h2>{tab} settings</h2>
            <div className="form-two">
              <label>Hotel name<input value={settings.hotel_name || ""} onChange={update("hotel_name")}/></label>
              <label>Currency<input value={settings.currency || ""} onChange={update("currency")}/></label>
              <label>Check-in time<input type="time" value={settings.checkin_time || ""} onChange={update("checkin_time")}/></label>
              <label>Check-out time<input type="time" value={settings.checkout_time || ""} onChange={update("checkout_time")}/></label>
              <label>Contact email<input type="email" value={settings.contact_email || ""} onChange={update("contact_email")}/></label>
              <label>Phone number<input value={settings.contact_phone || ""} onChange={update("contact_phone")}/></label>
            </div>
            <button className="btn btn-gold" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
          </form>
        )}
      </section>
    </>
  );
}
