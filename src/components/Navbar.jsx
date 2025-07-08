import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import AuthModal from '../modal/AuthModal';
import NeedHelpModal from '../modal/NeedHelpModal';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [user, setUser] = useState(() => {
    // Get user from localStorage on mount
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileProfile, setShowMobileProfile] = useState(false);
  const dropdownRef = useRef();
  const location = useLocation();

  const loadUserInfo = useCallback(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const userObj = JSON.parse(stored);
      setUser({
        name: userObj.name,
        imageUrl: userObj.imageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        email: userObj.email,
        phone: userObj.phone,
      });
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadUserInfo();
    const handleUserLogin = () => loadUserInfo();
    const handleUserProfileUpdated = () => loadUserInfo();
    window.addEventListener("userLogin", handleUserLogin);
    window.addEventListener("userProfileUpdated", handleUserProfileUpdated);
    return () => {
      window.removeEventListener("userLogin", handleUserLogin);
      window.removeEventListener("userProfileUpdated", handleUserProfileUpdated);
    };
  }, [loadUserInfo]);

  useEffect(() => {
    const handleUserChange = () => {
      window.location.reload();
    };
    window.addEventListener("userLogin", handleUserChange);
    window.addEventListener("userLogout", handleUserChange);
    return () => {
      window.removeEventListener("userLogin", handleUserChange);
      window.removeEventListener("userLogout", handleUserChange);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close mobile menu on route change or overlay click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleResize() {
      if (window.innerWidth > 991) setMobileMenuOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // Helper to check if on profile page
  const isProfilePage = location.pathname.startsWith("/profile/");

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setShowMobileProfile(false);
    window.dispatchEvent(new Event("userLogout"));
    // If on profile page, redirect to home. Otherwise, do NOT refresh the page.
    if (location.pathname.startsWith("/profile")) {
      window.location.href = "/";
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{
        background: "#fff",
        borderBottom: "2px solid #e57368",
        minHeight: 72,
        zIndex: 100,
        padding: 0,
        position: "relative"
      }}
    >
      <div className="container-fluid px-4 d-flex align-items-center justify-content-between">
        {/* Logo */}
        <div className="d-flex align-items-center">
          <Link
            className="navbar-brand d-flex align-items-center fw-bold fs-2 me-4"
            to="/"
            style={{
              color: "#e57368",
              letterSpacing: 1,
              fontWeight: 900,
              fontSize: 32,
              textShadow: "0 2px 8px #e5736810"
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src={logo}
              alt="Bhada24 Logo"
              style={{ height: 60, width: "auto", marginRight: 8 }}
            />
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <button
          className="d-lg-none btn"
          style={{
            fontSize: 28,
            color: "#e57368",
            background: "none",
            border: "none",
            outline: "none",
            boxShadow: "none",
          }}
          aria-label="Toggle navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon" style={{ fontSize: 28 }} />
        </button>

        {/* Desktop Menu */}
        <ul className="navbar-nav flex-row align-items-center gap-4 mb-0 d-none d-lg-flex">
          {/* Home link */}
          <li className="nav-item">
            <Link
              className="nav-link d-flex align-items-center fw-semibold px-2"
              to="/"
              style={{
                color: "#23272f",
                fontSize: 18,
                borderRadius: 8,
                transition: "background 0.2s",
                textDecoration: "none",
              }}
            >
              <i className="bi bi-house-door-fill me-1" style={{ fontSize: 20, color: "#e57368" }} />
              Home
            </Link>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className="nav-link d-flex align-items-center fw-semibold px-2 btn btn-link"
              style={{
                color: "#23272f",
                fontSize: 18,
                borderRadius: 8,
                transition: "background 0.2s",
                textDecoration: "none",
              }}
              onClick={() => setShowHelp(true)}
            >
              <i className="bi bi-headset me-1" style={{ fontSize: 20, color: "#e57368" }} />
              Need Help?
            </button>
          </li>
          {!user && (
            <li className="nav-item">
              <button
                type="button"
                className="nav-link d-flex align-items-center fw-semibold px-2 btn btn-link"
                style={{
                  color: "#23272f",
                  fontSize: 18,
                  borderRadius: 8,
                  transition: "background 0.2s",
                  textDecoration: "none",
                }}
                onClick={() => setShowAuth(true)}
              >
                <i className="bi bi-person-fill me-1" style={{ fontSize: 20, color: "#e57368" }} />
                Login/SignUp
              </button>
            </li>
          )}
          {user ? (
            <li className="nav-item" ref={dropdownRef} style={{ position: "relative" }}>
              <button
                className="nav-link d-flex align-items-center fw-semibold px-2 btn btn-link"
                style={{
                  color: "#23272f",
                  fontSize: 18,
                  borderRadius: 8,
                  transition: "background 0.2s",
                  textDecoration: "none",
                }}
                onClick={() => setDropdownOpen((open) => !open)}
              >
                <img
                  src={user.imageUrl}
                  alt={user.name}
                  className="rounded-circle"
                  style={{ width: 36, height: 36, objectFit: "cover", background: "#eee" }}
                  onError={e => { e.target.onerror = null; e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
                />
                {user.name.split(" ")[0]}
                <span style={{ marginLeft: 6, fontSize: 14 }}>&#9662;</span>
              </button>
              {dropdownOpen && (
                <ul
                  className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "110%",
                    minWidth: 160,
                    boxShadow: "0 4px 16px #0001",
                    zIndex: 1000,
                  }}
                >
                  {!isProfilePage && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/profile/info"
                        onClick={() => setDropdownOpen(false)}
                      >
                        View Profile
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          ) : null}
        </ul>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{
              background: "rgba(30,32,38,0.25)",
              backdropFilter: "blur(2px)",
              zIndex: 1050,
              transition: "background 0.3s",
            }}
            onClick={() => {
              setMobileMenuOpen(false);
              setShowMobileProfile(false);
            }}
          />
        )}

        {/* Mobile Menu Drawer */}
        <div
          className={`d-lg-none position-fixed top-0 end-0 bg-white shadow mobile-drawer`}
          style={{
            width: 240,
            maxWidth: "90vw",
            height: "100vh",
            zIndex: 1100,
            transform: mobileMenuOpen ? "translateX(0)" : "translateX(110%)",
            boxShadow: "0 8px 32px #0002",
            borderTopLeftRadius: 18,
            borderBottomLeftRadius: 18,
            padding: 0,
            overflowY: "auto",
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom" style={{ background: "#f8fafc", borderTopLeftRadius: 18 }}>
            <span style={{
              color: "#e57368",
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: 1,
              display: "flex",
              alignItems: "center"
            }}>
              <img
                src={logo}
                alt="Bhada24 Logo"
                style={{ height: 45, width: "auto", marginRight: 8 }}
              />
            </span>
            <button
              className="btn"
              style={{
                fontSize: 28,
                color: "#e57368",
                background: "none",
                border: "none",
                marginRight: -8,
                marginTop: -8,
                padding: 0,
                lineHeight: 1,
              }}
              onClick={() => {
                setMobileMenuOpen(false);
                setShowMobileProfile(false);
              }}
              aria-label="Close menu"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <ul className="navbar-nav flex-column gap-2 px-3 pt-3 pb-4">
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center fw-semibold px-2"
                to="/"
                style={{
                  color: "#23272f",
                  fontSize: 18,
                  borderRadius: 8,
                  transition: "background 0.2s",
                  textDecoration: "none",
                }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowMobileProfile(false);
                }}
              >
                <i className="bi bi-house-door-fill me-1" style={{ fontSize: 20, color: "#e57368" }} />
                Home
              </Link>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="nav-link d-flex align-items-center fw-semibold px-2 btn btn-link"
                style={{
                  color: "#23272f",
                  fontSize: 18,
                  borderRadius: 8,
                  transition: "background 0.2s",
                  textDecoration: "none",
                }}
                onClick={() => {
                  setShowHelp(true);
                  setMobileMenuOpen(false);
                  setShowMobileProfile(false);
                }}
              >
                <i className="bi bi-headset me-1" style={{ fontSize: 20, color: "#e57368" }} />
                Need Help?
              </button>
            </li>
            {!user && (
              <li className="nav-item">
                <button
                  type="button"
                  className="nav-link d-flex align-items-center fw-semibold px-2 btn btn-link"
                  style={{
                    color: "#23272f",
                    fontSize: 18,
                    borderRadius: 8,
                    transition: "background 0.2s",
                    textDecoration: "none",
                  }}
                  onClick={() => {
                    setShowAuth(true);
                    setMobileMenuOpen(false);
                    setShowMobileProfile(false);
                  }}
                >
                  <i className="bi bi-person-fill me-1" style={{ fontSize: 20, color: "#e57368" }} />
                  Login/SignUp
                </button>
              </li>
            )}
            {user && (
              <>
                <li className="nav-item d-flex align-items-center gap-2 px-2 mt-2 mb-1">
                  <button
                    className="btn w-100 d-flex align-items-center gap-2"
                    style={{
                      background: "#f8fafc",
                      border: "1.5px solid #FFD600",
                      borderRadius: 10,
                      padding: "8px 12px",
                      fontWeight: 600,
                      color: "#e57368",
                      fontSize: 17,
                    }}
                    onClick={() => setShowMobileProfile((v) => !v)}
                  >
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="rounded-circle"
                      style={{ width: 36, height: 36, objectFit: "cover", background: "#eee" }}
                      onError={e => { e.target.onerror = null; e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
                    />
                    <span>{user.name.split(" ")[0]}</span>
                    <span style={{ marginLeft: "auto", fontSize: 18 }}>
                      {showMobileProfile ? "▲" : "▼"}
                    </span>
                  </button>
                </li>
                {showMobileProfile && (
                  <li className="nav-item px-2 py-2" style={{ background: "#fffbe7", borderRadius: 10, marginBottom: 8 }}>
                    <div className="mb-2" style={{ fontWeight: 700, color: "#e57368", fontSize: 16 }}>
                      {user.name}
                    </div>
                    <div className="mb-1" style={{ color: "#23272f", fontSize: 15 }}>
                      <i className="bi bi-envelope me-2" style={{ color: "#e57368" }} />
                      {user.email || "No email"}
                    </div>
                    <div className="mb-2" style={{ color: "#23272f", fontSize: 15 }}>
                      <i className="bi bi-telephone me-2" style={{ color: "#e57368" }} />
                      {user.phone || "No phone"}
                    </div>
                    {!isProfilePage && (
                      <Link
                        className="btn btn-sm w-100 mb-2"
                        to="/profile/info"
                        style={{
                          background: "#FFD600",
                          color: "#23272f",
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: 15,
                          border: "none"
                        }}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setShowMobileProfile(false);
                        }}
                      >
                        View Profile
                      </Link>
                    )}
                    <button
                      className="btn btn-sm w-100"
                      style={{
                        background: "#fff",
                        color: "#dc3545",
                        border: "1px solid #dc3545",
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
      <AuthModal show={showAuth && !user} onClose={() => setShowAuth(false)} />
      <NeedHelpModal show={showHelp} onClose={() => setShowHelp(false)} />
      {/* Responsive styles */}
      <style>
        {`
        .mobile-drawer {
          box-shadow: 0 8px 32px #0002 !important;
          border-top-left-radius: 18px !important;
          border-bottom-left-radius: 18px !important;
          background: rgba(255,255,255,0.96) !important;
          backdrop-filter: blur(8px) !important;
        }
        @media (max-width: 991px) {
          .navbar-nav.d-none.d-lg-flex { display: none !important; }
          .d-lg-none { display: block !important; }
        }
        @media (min-width: 992px) {
          .d-lg-none { display: none !important; }
        }
      `}
      </style>
    </nav>
  );
};

export default Navbar;