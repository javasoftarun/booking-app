import { Link } from 'react-router-dom';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import AuthModal from '../modal/AuthModal';
import NeedHelpModal from '../modal/NeedHelpModal';

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const loadUserInfo = useCallback(() => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userImage = localStorage.getItem("userImage");
    if (userId && userName && userImage) {
      setUser({ name: userName, image: userImage });
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadUserInfo();
    const handleUserLogin = () => loadUserInfo();
    window.addEventListener("userLogin", handleUserLogin);
    return () => window.removeEventListener("userLogin", handleUserLogin);
  }, [loadUserInfo]);

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

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{
        background: "#fff",
        borderBottom: "2px solid #e57368",
        minHeight: 72,
        zIndex: 100,
        padding: 0,
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
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/854/854894.png"
              alt="YatraNow"
              width={40}
              className="me-2"
              style={{
                borderRadius: 10,
                background: "#fff",
                boxShadow: "0 2px 8px #e5736820"
              }}
            />
            <span>
              Yatra
              <span style={{ color: '#FFD600' }}>Now</span>
            </span>
          </Link>
        </div>

        {/* Right: Menu */}
        <ul className="navbar-nav flex-row align-items-center gap-4 mb-0">
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
                  src={user.image}
                  alt={user.name}
                  className="rounded-circle me-2"
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
                  <li>
                    <Link className="dropdown-item" to="/profile" onClick={() => setDropdownOpen(false)}>
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        localStorage.clear();
                        setDropdownOpen(false);
                        window.location.reload();
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          ) : null}
        </ul>
      </div>
      <AuthModal show={showAuth && !user} onClose={() => setShowAuth(false)} />
      <NeedHelpModal show={showHelp} onClose={() => setShowHelp(false)} />
    </nav>
  );
};

export default Navbar;