import React, { useEffect, useState } from "react";
import SectionHeading from "../../components/SectionHeading.jsx";
import RoomCard from "../../components/RoomCard.jsx";
import { roomsApi } from "../../api/roomsApi.js";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [type, setType] = useState("All rooms");
  const [search, setSearch] = useState({ checkIn: "", checkOut: "", guests: "2" });
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRooms = (query = { limit: 50 }) => {
    setLoading(true);
    roomsApi.list(query)
      .then(r => setRooms(r.data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRooms(); }, []);

  const updateSearch = (key) => (event) => {
    setSearch({ ...search, [key]: event.target.value });
  };

  const searchAvailability = async (event) => {
    event.preventDefault();
    setError("");
    if (!search.checkIn || !search.checkOut) {
      setError("Choose check-in and check-out dates to search availability.");
      return;
    }
    setLoading(true);
    try {
      const response = await roomsApi.availability(search.checkIn, search.checkOut, search.guests);
      setRooms(response.data || []);
      setSearched(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearch({ checkIn: "", checkOut: "", guests: "2" });
    setSearched(false);
    setError("");
    loadRooms();
  };

  const filtered = type === "All rooms" ? rooms : rooms.filter(r => r.type === type);
  const bookingQuery = searched
    ? `&checkIn=${encodeURIComponent(search.checkIn)}&checkOut=${encodeURIComponent(search.checkOut)}&guests=${encodeURIComponent(search.guests)}`
    : "";

  return (
    <>
      <section className="page-hero small-hero">
        <div className="internal-page-container">
          <SectionHeading title="Rooms & Suites" text="Find your personal sanctuary, designed for rest, renewal and refined comfort."/>
        </div>
      </section>
      <section className="section internal-section">
        <form className="form-card" onSubmit={searchAvailability} style={{ marginBottom: 28 }}>
          <h2 style={{ marginTop: 0 }}>Search available rooms</h2>
          <div className="form-two">
            <label>Check-in
              <input type="date" required value={search.checkIn} onChange={updateSearch("checkIn")} />
            </label>
            <label>Check-out
              <input type="date" required value={search.checkOut} onChange={updateSearch("checkOut")} />
            </label>
            <label>Guests
              <select value={search.guests} onChange={updateSearch("guests")}>
                {[1, 2, 3, 4, 5].map(count => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}
              </select>
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "end" }}>
              <button className="btn btn-gold" type="submit" disabled={loading}>Search availability</button>
              {searched && <button className="btn btn-light" type="button" onClick={resetSearch}>Clear</button>}
            </div>
          </div>
        </form>
        <div className="filter-row">
          <span>{filtered.length} {searched ? "rooms available for your stay" : "thoughtfully designed rooms"}</span>
          <div className="filter-chips">
            {["All rooms","Deluxe","Suite","Luxury","Family","Twin"].map(t =>
              <button key={t} className={type===t?"chip active":"chip"} onClick={()=>setType(t)}>{t}</button>
            )}
          </div>
        </div>
        {error && <p style={{ color: "#c05d5d" }}>{error}</p>}
        {loading ? <p className="empty-state">Loading rooms…</p> : (
          <div className="room-grid">
            {filtered.map(r => <RoomCard key={r.id} room={r} bookingQuery={bookingQuery}/>)}
          </div>
        )}
      </section>
    </>
  );
}
