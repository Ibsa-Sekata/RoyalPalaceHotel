import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "../../components/SectionHeading.jsx";

const highlights = ["Exceptional Hospitality", "Elegant Accommodation", "Comfort & Guest Satisfaction"];

export default function About() {
  return <>
    <section className="page-hero small-hero">
      <div className="internal-page-container">
        <SectionHeading title="A tradition of thoughtful luxury" text="Rooted in warm hospitality, inspired by timeless design." />
      </div>
    </section>
    <section className="section internal-section about-page-section">
      <div className="about-home-image">
        <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85" alt="Grand Royal Palace Hotel lobby with elegant furniture and warm lighting" />
      </div>
      <div className="about-home-content">
        <span className="eyebrow">ABOUT ROYAL PALACE</span>
        <h2>Where Luxury Meets <em>Exceptional Hospitality</em></h2>
        <p>Welcome to Royal Palace Hotel, where elegance, comfort, and exceptional hospitality come together. Our hotel is designed to offer a relaxing and welcoming environment, combining sophisticated surroundings with thoughtful service to make every guest&apos;s stay special.</p>
        <p>Royal Palace was imagined as a place where graceful design and genuine care meet. Whether you are travelling for business, enjoying a holiday, or celebrating a special occasion, our team is committed to making your experience comfortable and enjoyable.</p>
        <div className="about-home-values">
          <div><span className="about-home-value-label">OUR MISSION</span><p>To make every stay feel personal through thoughtful service.</p></div>
          <div><span className="about-home-value-label">OUR VISION</span><p>To set the standard for timeless luxury and warm hospitality.</p></div>
        </div>
        <ul className="about-home-highlights" aria-label="Royal Palace benefits">
          {highlights.map((highlight) => <li key={highlight}><span className="about-home-check"><Check size={13} strokeWidth={2.5} /></span>{highlight}</li>)}
        </ul>
        <Link className="btn btn-gold" to="/rooms">Explore Our Rooms <ArrowRight size={16} /></Link>
      </div>
    </section>
  </>;
}
