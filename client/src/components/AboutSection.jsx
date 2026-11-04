import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal.jsx";

const highlights = [
  "Exceptional Hospitality",
  "Elegant Accommodation",
  "Comfort & Guest Satisfaction",
];

export default function AboutSection({ id = "about-home", compact = false }) {
  return (
    <section id={id} className={`about-home-section${compact ? " about-home-section-compact" : ""}`} aria-labelledby="about-home-title">
      <Reveal className="about-home-image">
        <img
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85"
          alt="Grand Royal Palace Hotel lobby with elegant furniture and warm lighting"
          loading="lazy"
        />
      </Reveal>
      <Reveal className="about-home-content" delay={120}>
        <span className="eyebrow">ABOUT ROYAL PALACE</span>
        <h2 id="about-home-title">
          Where Luxury Meets <em>Exceptional Hospitality</em>
        </h2>
        <p>
          Welcome to Royal Palace Hotel, where elegance, comfort, and exceptional
          hospitality come together. Our hotel is designed to offer a relaxing
          and welcoming environment, combining sophisticated surroundings with
          thoughtful service to make every guest&apos;s stay special.
        </p>
        <p>
          From our beautifully designed interiors to our comfortable
          accommodation and dining experiences, we aim to create memorable
          moments for every visitor. Whether you are travelling for business,
          enjoying a holiday, or celebrating a special occasion, our team is
          committed to making your experience comfortable and enjoyable.
        </p>
        <div className="about-home-values">
          <div>
            <span className="about-home-value-label">OUR MISSION</span>
            <p>To make every stay feel personal through thoughtful service.</p>
          </div>
          <div>
            <span className="about-home-value-label">OUR VISION</span>
            <p>To set the standard for timeless luxury and warm hospitality.</p>
          </div>
        </div>
        <ul className="about-home-highlights" aria-label="Royal Palace benefits">
          {highlights.map((highlight) => (
            <li key={highlight}>
              <span className="about-home-check">
                <Check size={13} strokeWidth={2.5} />
              </span>
              {highlight}
            </li>
          ))}
        </ul>
        <div className="about-home-actions">
          {compact && <Link className="btn btn-dark" to="/about">Learn More <ArrowRight size={16} /></Link>}
          <Link className="btn btn-gold" to="/rooms">
            Explore Our Rooms <ArrowRight size={16} />
          </Link>
          <Link className="btn btn-light" to="/contact">
            Contact Us
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
