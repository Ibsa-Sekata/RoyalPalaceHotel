import React from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarDays, BedDouble, Users, ArrowLeftRight, Sparkles, CreditCard, ChartNoAxesCombined, Settings, UserRound, Crown, Search, Bell, Mail, LogOut, CircleUserRound, Images, ChefHat } from "lucide-react";
import { useAuth } from "../context/useAuth.js";

const nav = [
  ["Dashboard","/admin",LayoutDashboard],
  ["Bookings","/admin/bookings",CalendarDays],
  ["Rooms","/admin/rooms",BedDouble],
  ["Guests","/admin/guests",Users],
  ["Check-in / Check-out","/admin/check-in-out",ArrowLeftRight],
  ["Housekeeping","/admin/housekeeping",Sparkles],
  ["Payments","/admin/payments",CreditCard],
  ["Reports","/admin/reports",ChartNoAxesCombined],
  ["Messages","/admin/messages",Mail],
  ["Users","/admin/users",UserRound],
  ["Settings","/admin/settings",Settings],
  ["Website content","/admin/content",Images],
  ["Kitchen","/admin/kitchen",ChefHat],
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabel = user?.role
    ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
    : "Guest";

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <Crown size={27}/>
          <span><b>ROYAL PALACE</b><small>HOTEL MANAGEMENT</small></span>
        </Link>
        <div className="side-label">WORKSPACE</div>
        <nav>
          {nav.map(([label, path, Icon]) => (
            <NavLink
              end={path === "/admin"}
              key={path}
              to={path}
              className={({isActive}) => isActive ? "side-link active" : "side-link"}
            >
              <Icon size={17}/><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-help">
          <span className="help-icon">Help</span>
          <b>Need assistance?</b>
          <small>Contact hotel support</small>
          <Link to="/contact">Get help</Link>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid #263747",
            color: "#d9b96f",
            padding: "10px 14px",
            marginTop: 18,
            marginBottom: 8,
            cursor: "pointer",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
          }}
        >
          <LogOut size={14}/> Sign out
        </button>
        <Link className="back-site" to="/">View hotel website</Link>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-search">
            <Search size={17}/>
            <input placeholder="Search anything..." />
          </div>
          <div className="topbar-right">
            <button className="icon-button" aria-label="Notifications"><Bell size={18}/><i/></button>
            <div className="admin-user">
              <span className="avatar"><CircleUserRound size={23}/></span>
              <span>
                <b>{user?.fullName || "Guest"}</b>
                <small>{roleLabel}</small>
              </span>
            </div>
            <button
              className="admin-topbar-logout"
              onClick={handleLogout}
              type="button"
            >
              <LogOut size={14}/> Sign out
            </button>
          </div>
        </header>
        <div className="admin-content"><Outlet/></div>
      </section>
    </div>
  );
}
