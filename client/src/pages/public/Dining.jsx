import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SectionHeading from "../../components/SectionHeading.jsx";
import { useSiteContent, contentImage } from "../../hooks/useSiteContent.js";
import { diningReservationsApi } from "../../api/diningReservationsApi.js";
import { useAuth } from "../../context/useAuth.js";

const tables = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8"];

export default function Dining() {
  const { content, loading } = useSiteContent();
  const { user } = useAuth();
  const navigate = useNavigate();
  const dining = content.dining;
  const [form, setForm] = useState({ restaurantName: "", date: "", time: "", guests: "2", tableNumber: "", specialRequests: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [availableTables, setAvailableTables] = useState([]);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    if (dining.length && !form.restaurantName) {
      setForm((current) => ({ ...current, restaurantName: dining[0].name }));
    }
  }, [dining, form.restaurantName]);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submitReservation = async (event) => {
    event.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: "/dining" } });
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const response = await diningReservationsApi.create({ ...form, guests: Number(form.guests) });
      setConfirmation(response.data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const checkAvailability = async () => {
    setError("");
    if (!form.restaurantName || !form.date || !form.time) {
      setError("Choose a restaurant, date, and time first.");
      return;
    }
    setCheckingAvailability(true);
    setAvailabilityChecked(false);
    try {
      const response = await diningReservationsApi.availability({
        restaurantName: form.restaurantName,
        date: form.date,
        time: form.time,
      });
      setAvailableTables(response.data || []);
      setAvailabilityChecked(true);
      setForm((current) => ({ ...current, tableNumber: current.tableNumber && response.data.includes(current.tableNumber) ? current.tableNumber : "" }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCheckingAvailability(false);
    }
  };

  return (
    <>
      <section className="page-hero small-hero">
        <div className="internal-page-container">
          <SectionHeading title="Dining at Royal Palace" text="Distinctive flavours, gracious service and spaces made for lingering." />
        </div>
      </section>
      <section className="section internal-section">
        {loading ? <p className="empty-state">Loading dining...</p> : dining.length === 0 ? <p className="empty-state">No dining experiences are available.</p> : (
          <>
            <div className="feature-banner">
              <img src={contentImage(dining[0].image, 1500)} alt={dining[0].name} />
              <div>
                <span className="eyebrow">SIGNATURE RESTAURANT</span>
                <h2>Gather around<br /><em>something exceptional.</em></h2>
                <p>{dining[0].description}</p>
                <a className="btn btn-gold" href="#dining-reservation">Reserve a table</a>
              </div>
            </div>
            <div className="feature-grid">
              {dining.map((item) => (
                <article className="feature-card" key={item.id || item.name}>
                  <img src={contentImage(item.image, 900)} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    {Array.isArray(item.menu) && item.menu.length > 0 && (
                      <div><strong>Menu</strong><ul>{item.menu.map((dish) => <li key={dish}>{dish}</li>)}</ul></div>
                    )}
                    <a className="text-link" href="#dining-reservation">Reserve here</a>
                  </div>
                </article>
              ))}
            </div>
            <div id="dining-reservation" className="form-card" style={{ maxWidth: 760, margin: "64px auto 0" }}>
              {confirmation ? (
                <>
                  <SectionHeading title="Dining reservation confirmed!" text="Your table has been reserved successfully." />
                  <p><b>Confirmation:</b> {confirmation.confirmationNumber}</p>
                  <p><b>Restaurant:</b> {confirmation.restaurantName}</p>
                  <p><b>Date and time:</b> {new Date(confirmation.reservationStart).toLocaleString()}</p>
                  <p><b>Guests:</b> {confirmation.guests}</p>
                  {confirmation.tableNumber && <p><b>Table:</b> {confirmation.tableNumber}</p>}
                  <Link className="btn btn-gold" to="/dining">Make another reservation</Link>
                </>
              ) : (
                <form onSubmit={submitReservation}>
                  <h2>Reserve your table</h2>
                  <p>Choose your restaurant, preferred time, party size, and table preference.</p>
                  {error && <p style={{ color: "#c05d5d" }}>{error}</p>}
                  <div className="form-two">
                    <label>Restaurant
                      <select required value={form.restaurantName} onChange={update("restaurantName")}>
                        {dining.map((item) => <option key={item.id || item.name} value={item.name}>{item.name}</option>)}
                      </select>
                    </label>
                    <label>Guests
                      <select value={form.guests} onChange={update("guests")}>
                        {Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {index === 0 ? "guest" : "guests"}</option>)}
                      </select>
                    </label>
                    <label>Date
                      <input type="date" required min={today} value={form.date} onChange={update("date")} />
                    </label>
                    <label>Time
                      <input type="time" required value={form.time} onChange={update("time")} />
                    </label>
                    <label>Preferred table
                      <select value={form.tableNumber} onChange={update("tableNumber")}>
                        <option value="">Any available table</option>
                        {(availableTables.length ? availableTables : tables).map((table) => <option key={table} value={table}>{table}</option>)}
                      </select>
                    </label>
                  </div>
                  <button type="button" className="btn btn-light" onClick={checkAvailability} disabled={checkingAvailability}>
                    {checkingAvailability ? "Checking tables..." : "Check available tables"}
                  </button>
                  {availabilityChecked && availableTables.length === 0 && <p style={{ color: "#c05d5d", fontSize: 12 }}>No tables are currently available for this time.</p>}
                  {availabilityChecked && availableTables.length > 0 && <p style={{ color: "#39845a", fontSize: 12 }}>{availableTables.length} table(s) available.</p>}
                  <label>Special requests (optional)
                    <textarea rows="3" value={form.specialRequests} onChange={update("specialRequests")} placeholder="Dietary needs, celebration, or seating requests" />
                  </label>
                  <button className="btn btn-gold full-width" disabled={submitting}>{submitting ? "Reserving..." : user ? "Confirm dining reservation" : "Sign in to reserve"}</button>
                </form>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}
