import React from "react";
import { Crown, Facebook, Instagram, Mail, MapPin, Music2, Phone, Youtube, ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Rooms & Suites", "/rooms"],
  ["Dining", "/dining"],
  ["Amenities", "/amenities"],
  ["Gallery", "/gallery"],
];

function UnavailableLink({ children }) {
  return <span className="footer-link footer-link-unavailable" title="This page is not available yet">{children}</span>;
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="public-footer">
      <div className="footer-main">
        <div className="footer-brand-column">
          <Link className="footer-brand" to="/">
            <span className="footer-brand-mark"><Crown size={28} /></span>
            <span><b>ROYAL PALACE</b><small>HOTEL & RESORT</small></span>
          </Link>
          <p>Experience exceptional luxury, comfort, and personalized hospitality at Royal Palace Hotel.</p>
          <div className="footer-socials" aria-label="Royal Palace social media">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={16} /></a>
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
            <a href="https://www.tiktok.com/" target="_blank" rel="noreferrer" aria-label="TikTok"><Music2 size={16} /></a>
            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="YouTube"><Youtube size={16} /></a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <nav aria-label="Footer quick links">{quickLinks.map(([label, path]) => <Link className="footer-link" to={path} key={path}>{label}</Link>)}</nav>
        </div>

        <div className="footer-column">
          <h3>Guest Services</h3>
          <nav aria-label="Footer guest services">
            <Link className="footer-link" to="/booking">Book a Room</Link>
            <Link className="footer-link" to="/#offers-preview">Special Offers</Link>
            <UnavailableLink>My Bookings</UnavailableLink>
            <Link className="footer-link" to="/contact">Contact Us</Link>
            <UnavailableLink>Frequently Asked Questions</UnavailableLink>
            <UnavailableLink>Privacy Policy</UnavailableLink>
            <UnavailableLink>Terms &amp; Conditions</UnavailableLink>
          </nav>
        </div>

        <div className="footer-column footer-contact-column">
          <h3>Contact Information</h3>
          <div className="footer-contact-list">
            <span><MapPin size={16} /><span>Royal Palace Hotel, Addis Ababa, Ethiopia</span></span>
            <a href="tel:+251900123456"><Phone size={16} /><span>+251 900 123 456</span></a>
            <a href="mailto:hello@royalpalace.example"><Mail size={16} /><span>hello@royalpalace.example</span></a>
            <span><span className="footer-contact-icon">◷</span><span>Reception open 24 hours a day</span></span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} Royal Palace Hotel. All rights reserved.</span>
        <div className="footer-legal">
          <UnavailableLink>Privacy Policy</UnavailableLink>
          <UnavailableLink>Terms &amp; Conditions</UnavailableLink>
        </div>
        <button className="back-to-top" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Back to top <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
}
