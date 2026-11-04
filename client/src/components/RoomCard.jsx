import React from "react";
import { Link } from "react-router-dom";
import { Users, BedDouble, ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal.jsx";

export default function RoomCard({ room, bookingQuery = "" }) {
  const price = Number(room.pricePerNight ?? room.price ?? 0);
  const guests = Number(room.maxGuests ?? room.guests ?? 0);

  return (
    <Reveal as="article" className="room-card" delay={(room.id || 0) * 80}>
      <Link to={`/rooms/${room.id}`} className="room-image">
        <img
          src={`https://images.unsplash.com/${room.image}?auto=format&fit=crop&w=900&q=85`}
          alt={room.name}
        />
        <span className="image-tag">{room.type}</span>
      </Link>
      <div className="room-card-body">
        <div className="room-title-line">
          <h3>{room.name}</h3>
          <span className="rating">★ 4.9</span>
        </div>
        <div className="room-meta">
          <span><Users size={14}/> {guests} Guests</span>
          <span><BedDouble size={14}/> {room.beds}</span>
        </div>
        <div className="room-price">
          <span>From <b>ETB {price.toLocaleString()}</b> <small>/ night</small></span>
          <Link to={`/booking?roomId=${room.id}${bookingQuery}`} aria-label={`Book ${room.name}`}>
            <ArrowUpRight size={18}/>
          </Link>
        </div>
      </div>
    </Reveal>
  );
}