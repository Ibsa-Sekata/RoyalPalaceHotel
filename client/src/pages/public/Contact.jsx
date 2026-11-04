import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import SectionHeading from "../../components/SectionHeading.jsx";
import { contactApi } from "../../api/contactApi.js";

export default function Contact() {
  const [form, setForm] = useState({ fullName: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSent(false);
    try {
      await contactApi.send(form);
      setSent(true);
      setForm({ fullName: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="page-hero small-hero">
        <div className="internal-page-container">
          <SectionHeading title="We would love to hear from you" text="Questions, special requests or planning a visit? Our team is here to help."/>
        </div>
      </section>

      <section className="section internal-section contact-layout">
        <div className="contact-details">
          <div className="contact-item"><MapPin/><div><b>Visit us</b><p>Royal Palace Hotel, Addis Ababa, Ethiopia</p></div></div>
          <div className="contact-item"><Phone/><div><b>Call our team</b><p>+251 900 123 456</p></div></div>
          <div className="contact-item"><Mail/><div><b>Email</b><p>hello@royalpalace.example</p></div></div>
          <div className="contact-item"><Clock/><div><b>Guest support</b><p>Available 24 hours a day</p></div></div>
        </div>

        <form className="form-card" onSubmit={submit}>
          <h2>Send us a message</h2>

          {error && <p style={{ color: "#c05d5d" }}>{error}</p>}
          {sent && <p style={{ color: "#39845a" }}>✅ Message received. We'll reply soon.</p>}

          <div className="form-two">
            <label>Full name
              <input required value={form.fullName} onChange={update("fullName")} placeholder="Your name"/>
            </label>
            <label>Email
              <input required type="email" value={form.email} onChange={update("email")} placeholder="you@example.com"/>
            </label>
          </div>

          <label>Subject
            <input required value={form.subject} onChange={update("subject")} placeholder="How can we help?"/>
          </label>

          <label>Message
            <textarea rows="5" required value={form.message} onChange={update("message")} placeholder="Write your message here..."/>
          </label>

          <button className="btn btn-gold" disabled={loading}>
            {loading ? "Sending…" : "Send message"}
          </button>
        </form>
      </section>
    </>
  );
}
