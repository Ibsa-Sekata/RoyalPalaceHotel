import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Users, BedDouble, Ruler, Wifi, Coffee, ArrowLeft } from "lucide-react";
import { roomsApi } from "../../api/roomsApi.js";

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    roomsApi.get(id)
      .then(r => setRoom(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="empty-state" style={{ padding: 40 }}>Loading room…</p>;
  if (error || !room) return <p className="empty-state" style={{ padding: 40 }}>{error || "Room not found"}</p>;

  const price = Number(room.pricePerNight ?? 0);

  return (
    <section className="section internal-section detail-layout">
      <div>
        <Link className="text-link" to="/rooms"><ArrowLeft size={16}/> Back to rooms</Link>
        <img
          className="detail-image"
          src={`https://images.unsplash.com/${room.image}?auto=format&fit=crop&w=1400&q=90`}
          alt={room.name}
        />
        <div className="detail-thumbs">
          <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&q=80" alt="Room interior"/>
          <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80" alt="Suite lounge"/>
          <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80" alt="Hotel bedroom"/>
        </div>
      </div>
      <aside className="detail-info">
        <span className="eyebrow">{room.type} COLLECTION</span>
        <h1>{room.name}</h1>
        <div className="room-meta">
          <span><Users size={15}/> {room.maxGuests} guests</span>
          <span><BedDouble size={15}/> {room.beds}</span>
          <span><Ruler size={15}/> {room.size}</span>
        </div>
        <h2>ETB {price.toLocaleString()} <small>/ night</small></h2>
        <p>{room.description}</p>
        <h3>Room amenities</h3>
        <ul className="amenity-list">
          <li><Wifi/> Complimentary high-speed Wi-Fi</li>
          <li><Coffee/> Coffee and tea facilities</li>
          <li><span>✦</span> Premium toiletries</li>
          <li><span>✦</span> 24-hour room service</li>
        </ul>
        <div className="availability-box">
          <b>Check availability</b>
          <Link className="btn btn-gold full-width" to={`/booking?roomId=${room.id}`}>Book this room</Link>
        </div>
      </aside>
    </section>
  );
}
