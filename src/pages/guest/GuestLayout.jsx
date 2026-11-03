import React from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { Crown, CalendarDays, CircleUserRound, LogOut, BedDouble, Utensils } from "lucide-react";
import { useAuth } from "../../context/useAuth.js";

export default function GuestLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f7f5f0" }}>
      <header style={{
        background: "#fff",
        borderBottom: "1px solid #e9e5dc",
        padding: "16px 5%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, color: "#9c762e", textDecoration: "none" }}>
          <Crown size={24} />
          <span>
            <b style={{ display: "block", fontFamily: "'Playfair Display', serif", letterSpacing: 1.2, fontSize: 14 }}>ROYAL PALACE</b>
            <small style={{ display: "block", fontSize: 8, letterSpacing: 2.4, marginTop: 3 }}>HOTEL & RESORT</small>
          </span>
        </Link>
        <nav style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <NavLink to="/my-bookings" style={({ isActive }) => ({
            fontSize: 12,
            color: isActive ? "#9c762e" : "#3e4146",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: isActive ? 600 : 400,
          })}>
            <CalendarDays size={15}/> My Bookings
          </NavLink>
          <NavLink to="/my-profile" style={({ isActive }) => ({
            fontSize: 12,
            color: isActive ? "#9c762e" : "#3e4146",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: isActive ? 600 : 400,
          })}>
            <CircleUserRound size={15}/> My Profile
          </NavLink>
          <Link to="/rooms" style={{
            fontSize: 12, color: "#3e4146", textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <BedDouble size={15}/> Browse rooms
          </Link>
          <Link to="/dining" style={{
            fontSize: 12, color: "#3e4146", textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Utensils size={15}/> Browse dining
          </Link>
          <span style={{ fontSize: 11, color: "#8892a0", marginLeft: 8 }}>
            {user?.fullName}
          </span>
          <button
            onClick={handleLogout}
            className="btn btn-small btn-light"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <LogOut size={13}/> Sign out
          </button>
        </nav>
      </header>
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 5%" }}>
        <Outlet />
      </main>
    </div>
  );
}