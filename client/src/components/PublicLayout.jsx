import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Crown, Menu, X } from "lucide-react";
import Footer from "./Footer.jsx";

const nav = [
  ["Home", "/", "home-hero"],
  ["About", "/about", "about-preview"],
  ["Rooms & Suites", "/rooms", "rooms-preview"],
  ["Dining", "/dining", "dining-preview"],
  ["Amenities", "/amenities", "amenities-preview"],
  ["Gallery", "/gallery", "gallery-preview"],
  ["Contact", "/contact", "contact-preview"],
];

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home-hero");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return undefined;
    }

    const sections = nav.map(([, , sectionId]) => document.getElementById(sectionId)).filter(Boolean);
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      const marker = window.scrollY + 110;
      const current = sections
        .filter((section) => section.offsetTop <= marker)
        .sort((a, b) => b.offsetTop - a.offsetTop)[0];
      setActiveSection(current?.id || "home-hero");
    };
    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };
    updateActiveSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  const handleNavigation = (event, path, sectionId) => {
    setOpen(false);
    if (location.pathname === "/" && sectionId) {
      event.preventDefault();
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (location.pathname !== path) {
      event.preventDefault();
      navigate(path);
    }
  };

  return <div className="public-shell">
    <header className={`public-nav${scrolled ? " is-scrolled" : ""}`}>
      <Link className="brand" to="/"><span className="brand-mark"><Crown size={24}/></span><span><b>ROYAL PALACE</b><small>HOTEL & RESORT</small></span></Link>
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>{open ? <X/> : <Menu/>}</button>
      <nav className={open ? "public-links open" : "public-links"} aria-label="Primary navigation">
        {nav.map(([label, path, sectionId]) => {
          const active = location.pathname === "/" ? activeSection === sectionId : location.pathname === path || (path !== "/" && location.pathname.startsWith(`${path}/`));
          return <Link key={path} className={active ? "active" : ""} to={path} aria-current={active ? "page" : undefined} onClick={(event) => handleNavigation(event, path, sectionId)}>{label}</Link>;
        })}
      </nav>
      <Link className="btn btn-gold nav-book" to="/booking">Book Now</Link>
    </header>
    <main><Outlet /></main>
    <Footer />
  </div>;
}
