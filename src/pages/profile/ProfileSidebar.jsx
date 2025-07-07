import React from "react";
import { NavLink } from "react-router-dom";
import { FaUser, FaBook, FaStar, FaCog, FaPowerOff } from "react-icons/fa";

const links = [
  { to: "/profile/info", label: "Profile", icon: <FaUser /> },
  { to: "/profile/bookings", label: "Bookings", icon: <FaBook /> },
  { to: "/profile/ratings", label: "Ratings", icon: <FaStar /> },
  { to: "/profile/settings", label: "Settings", icon: <FaCog /> },
  { to: "/profile/deactivate", label: "Deactivate", icon: <FaPowerOff />, danger: true },
];

const ProfileSidebar = () => (
  <>
    {/* Desktop sidebar */}
    <aside
      className="profile-sidebar d-none d-md-flex"
      style={{
        minWidth: 220,
        background: "#fffbe7",
        borderRadius: 18,
        boxShadow: "0 2px 12px #ffd60022",
        padding: "32px 0",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        height: "fit-content",
      }}
    >
      <nav>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `d-flex align-items-center gap-3 px-4 py-3 fw-semibold ${isActive ? "bg-warning shadow-sm" : ""} ${link.danger ? "text-danger" : "text-dark"}`
            }
            style={{
              borderRadius: 12,
              fontSize: 17,
              textDecoration: "none",
              transition: "background 0.2s"
            }}
          >
            <span style={{ fontSize: 20 }}>{link.icon}</span>
            <span className="sidebar-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>

    {/* Mobile: Bottom navigation bar */}
    <nav
      className="profile-mobile-bottom-nav d-flex d-md-none"
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100vw",
        background: "#fff",
        borderTop: "1.5px solid #ffd600",
        boxShadow: "0 -2px 12px #ffd60022",
        zIndex: 1200,
        minHeight: 56,
        alignItems: "center",
        justifyContent: "space-between",
        overflowX: "auto",
      }}
    >
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `profile-mobile-bottom-tab d-flex flex-column align-items-center justify-content-center px-1 py-1 fw-semibold ${isActive ? "active" : ""} ${link.danger ? "text-danger" : "text-dark"}`
          }
          style={{
            borderRadius: 0,
            fontSize: 13,
            textDecoration: "none",
            minWidth: 55,
            flex: 1,
            margin: "0 1px",
            transition: "color 0.2s, border-top 0.2s",
            background: "none",
            border: "none",
            height: 56,
            boxShadow: "none",
            position: "relative"
          }}
        >
          <span style={{ fontSize: 20, marginBottom: 0 }}>{link.icon}</span>
          <span style={{ fontSize: 11, marginTop: 0 }}>{link.label}</span>
        </NavLink>
      ))}
      <style>
        {`
          .profile-mobile-bottom-nav::-webkit-scrollbar {
            display: none;
          }
          .profile-mobile-bottom-tab {
            color: #23272f;
            border-top: 2px solid transparent;
            background: none;
            font-weight: 500;
            position: relative;
            padding: 2px 0 0 0;
          }
          .profile-mobile-bottom-tab.active {
            color: #e57368 !important;
            border-top: 2.5px solid #ffd600;
            background: none;
          }
          .profile-mobile-bottom-tab.text-danger.active {
            color: #dc3545 !important;
            border-top: 2.5px solid #dc3545;
            background: none;
          }
        `}
      </style>
    </nav>
  </>
);

export default ProfileSidebar;