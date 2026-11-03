import React from "react";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import RoomCard from "./RoomCard.jsx";
import AboutSection from "./AboutSection.jsx";
import { rooms } from "../data.js";
import Reveal from "./Reveal.jsx";
import { useSiteContent, contentImage } from "../hooks/useSiteContent.js";

export default function HomePreviews() {
  const { content, loading } = useSiteContent();
  const dining = content.dining[0];
  return (
    <>
      <AboutSection id="about-preview" compact />
      <section id="rooms-preview" className="section public-section home-preview-section">
        <Reveal className="preview-heading">
          <div>
            <span className="eyebrow">ROOMS & SUITES</span>
            <h2>Stay somewhere <em>extraordinary.</em></h2>
          </div>
          <p>Thoughtfully designed spaces where refined comfort meets warm Ethiopian hospitality.</p>
        </Reveal>
        <div className="room-grid">{rooms.slice(0, 3).map((room) => <RoomCard key={room.id} room={room} />)}</div>
        <Reveal className="center-action" delay={300}><Link className="btn btn-dark" to="/rooms">View All Rooms <ArrowRight size={16} /></Link></Reveal>
      </section>

      <section id="dining-preview" className="home-preview-band">
        <Reveal className="home-preview-band-image">
          {dining && <img src={contentImage(dining.image, 1400)} alt={dining.name} loading="lazy" />}
        </Reveal>
        <Reveal className="home-preview-band-copy" delay={120}>
          <span className="eyebrow">DINING AT ROYAL PALACE</span>
          <h2>Gather around <em>something exceptional.</em></h2>
          <p>{dining?.description || "Discover memorable dining experiences at Royal Palace."}</p>
          <Link className="btn btn-gold" to="/dining">Explore Dining <ArrowRight size={16} /></Link>
        </Reveal>
      </section>

      <section id="amenities-preview" className="section public-section home-preview-section">
        <Reveal className="preview-heading">
          <div><span className="eyebrow">AMENITIES</span><h2>Every detail, <em>considered.</em></h2></div>
          <p>Everything you need for restorative days, productive stays, and effortless comfort.</p>
        </Reveal>
        <div className="home-amenity-grid">
          {content.amenities.map(({ name, description, image }, index) => (
            <Reveal
              as="article"
              className="home-amenity-card"
              key={name}
              delay={index * 80}
            >
              <img
                className="home-amenity-image"
                src={contentImage(image)}
                alt={name}
                aria-hidden="true"
                loading="lazy"
              />
              <div className="home-amenity-content">
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="center-action" delay={300}><Link className="text-link" to="/amenities">Explore all amenities <ArrowRight size={16} /></Link></Reveal>
      </section>

      <section id="gallery-preview" className="section public-section home-preview-section gallery-preview">
        <Reveal className="preview-heading">
          <div><span className="eyebrow">GALLERY</span><h2>A glimpse of the <em>experience.</em></h2></div>
          <Link className="text-link" to="/gallery">View full gallery <ArrowRight size={16} /></Link>
        </Reveal>
        <div className="home-gallery-grid">
          {content.gallery.map((item, index) => (
            <Reveal as={Link} className="home-gallery-item" to="/gallery" key={item.id || item.name} delay={index * 70}>
              <img src={contentImage(item.image)} alt={item.name} loading="lazy" />
              <span>{item.name}</span>
            </Reveal>
          ))}
        </div>
        {!loading && content.gallery.length === 0 && <p className="empty-state">No gallery items are available.</p>}
      </section>

      <section id="offers-preview" className="home-offers-section">
        <div className="home-offers-inner">
          <Reveal>
            <span className="eyebrow">SPECIAL OFFERS</span>
            <h2>Make your stay <em>even more memorable.</em></h2>
            <p>Enjoy considered extras and exclusive value when you plan your next Royal Palace escape.</p>
          </Reveal>
          <Reveal className="home-offer-list" delay={120}>
            <article><span>01</span><div><h3>Stay longer, enjoy more</h3><p>Receive a complimentary night on selected extended stays.</p></div></article>
            <article><span>02</span><div><h3>Royal dining escape</h3><p>Pair your stay with a signature dinner for two.</p></div></article>
          </Reveal>
          <Reveal delay={240}><Link className="btn btn-gold" to="/booking">Plan Your Stay <ArrowRight size={16} /></Link></Reveal>
        </div>
      </section>

      <section id="contact-preview" className="section public-section home-contact-preview">
        <div className="home-contact-card">
          <Reveal>
            <span className="eyebrow">CONTACT ROYAL PALACE</span>
            <h2>We would love to <em>hear from you.</em></h2>
            <p>Questions, special requests, or planning a visit? Our guest services team is here to help.</p>
            <Link className="btn btn-dark" to="/contact">Contact Us <ArrowRight size={16} /></Link>
          </Reveal>
          <Reveal className="home-contact-details" delay={140}>
            <span><MapPin size={17} /> Royal Palace Hotel, Addis Ababa</span>
            <span><Phone size={17} /> +251 900 123 456</span>
            <span><Mail size={17} /> hello@royalpalace.example</span>
          </Reveal>
        </div>
      </section>
    </>
  );
}
