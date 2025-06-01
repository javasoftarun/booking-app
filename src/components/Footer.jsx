import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NeedHelpModal from "../modal/NeedHelpModal";
import CancellationPolicyModal from "../modal/CancellationPolicyModal";
import RefundPolicyModal from "../modal/RefundPolicyModal";
import TermsAndConditionsModal from "../modal/TermsAndConditionsModal";
import PrivacyPolicyModal from "../modal/PrivacyPolicyModal";

const Footer = () => {
  const location = useLocation();
  const [showHelp, setShowHelp] = useState(false);
  const [showCancelPolicy, setShowCancelPolicy] = useState(false);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false); // <-- Add this state

  // Detect mobile view
  const isMobile = window.innerWidth < 992;

  return (
    <>
      {/* Desktop Footer */}
      <footer
        className="bg-white border-top d-none d-lg-block"
        style={{
          boxShadow: "0 -2px 16px #00b8ff11",
          padding: "0",
          marginTop: 40,
        }}
      >
        <div
          className="container py-5"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1.5fr 2fr",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* Brand and tagline */}
          <div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <span style={{ color: "#FFD600", fontSize: 34 }}>🚕</span>
              <span className="fw-bold" style={{ color: "#e57368", fontSize: 26, letterSpacing: 1 }}>
                Yatra<span style={{ color: "#FFD600" }}>Now</span>
              </span>
            </div>
            <div className="text-muted mb-3" style={{ fontSize: 15, maxWidth: 260 }}>
              Your trusted partner for safe, fast, and affordable travel bookings across India.
            </div>
            <div className="d-flex align-items-center gap-2 mt-3">
              <a href="https://facebook.com/yatranow" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook" style={{ fontSize: 22, color: "#4267B2" }} />
              </a>
              <a href="https://twitter.com/yatranow" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="bi bi-twitter" style={{ fontSize: 22, color: "#1DA1F2" }} />
              </a>
              <a href="https://instagram.com/yatranow" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="bi bi-instagram" style={{ fontSize: 22, color: "#C13584" }} />
              </a>
              <a href="https://linkedin.com/company/yatranow" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="bi bi-linkedin" style={{ fontSize: 22, color: "#0077B5" }} />
              </a>
            </div>
          </div>
          {/* Useful Links */}
          <div>
            <div className="fw-semibold mb-3" style={{ color: "#e57368", fontSize: 17 }}>Useful Links</div>
            <ul className="list-unstyled mb-2" style={{ fontSize: 15, lineHeight: 2 }}>
              <li>
                <Link to="/" className="text-decoration-none text-muted">Home</Link>
              </li>
              <li>
                <button
                  className="btn btn-link text-decoration-none text-muted p-0"
                  style={{ color: "#888" }}
                  onClick={() => setShowHelp(true)}
                >
                  Contact
                </button>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-decoration-none text-muted"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          {/* Quick Help */}
          <div>
            <div className="fw-semibold mb-3" style={{ color: "#e57368", fontSize: 17 }}>Quick Help</div>
            <ul className="list-unstyled mb-2" style={{ fontSize: 15, lineHeight: 2 }}>
              <li>
                <button
                  className="btn btn-link text-decoration-none text-muted p-0"
                  style={{ color: "#888" }}
                  onClick={() => setShowCancelPolicy(true)}
                >
                  Cancellation Policy
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link text-decoration-none text-muted p-0"
                  style={{ color: "#888" }}
                  onClick={() => setShowRefundPolicy(true)}
                >
                  Refund Policy
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link text-decoration-none text-muted p-0"
                  style={{ color: "#888" }}
                  onClick={() => setShowTerms(true)}
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link text-decoration-none text-muted p-0"
                  style={{ color: "#888" }}
                  onClick={() => setShowPrivacy(true)}
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <div className="fw-semibold mb-3" style={{ color: "#e57368", fontSize: 17 }}>Contact Us</div>
            <div style={{ fontSize: 15 }}>
              <div className="mb-2">
                <i className="bi bi-envelope-fill me-2" style={{ color: "#FFD600" }} />
                <a href="mailto:support@yatranow.com" className="text-decoration-none text-muted">
                  support@yatranow.com
                </a>
              </div>
              <div className="mb-2">
                <i className="bi bi-telephone-fill me-2" style={{ color: "#FFD600" }} />
                <a href="tel:+919140251119" className="text-decoration-none text-muted">
                  +91-9140251119
                </a>
              </div>
              <div className="mb-2">
                <i className="bi bi-geo-alt-fill me-2" style={{ color: "#FFD600" }} />
                Varanasi, Uttar Pradesh, India
              </div>
              <div className="mt-3">
                <span className="fw-semibold" style={{ color: "#e57368", fontSize: 15 }}>Business Hours:</span>
                <div style={{ fontSize: 14, color: "#888" }}>Mon - Sat: 8:00am - 10:00pm</div>
                <div style={{ fontSize: 14, color: "#888" }}>Sunday: 9:00am - 6:00pm</div>
              </div>
            </div>
          </div>
        </div>
        <div className="container text-center text-muted small py-3 border-top" style={{ fontSize: 13 }}>
          &copy; {new Date().getFullYear()} YatraNow. All rights reserved. | Designed with <span style={{ color: "#e57368" }}>♥</span> in India
        </div>
      </footer>

      {/* Mobile Footer */}
      <footer
        className="d-lg-none position-fixed bottom-0 start-0 w-100 bg-white border-top"
        style={{
          boxShadow: "0 -2px 16px #00b8ff11",
          zIndex: 1200,
          padding: "0",
        }}
      >
        <nav className="d-flex justify-content-around align-items-center py-2">
          <Link
            to="/"
            className={`d-flex flex-column align-items-center text-decoration-none ${
              location.pathname === "/" ? "fw-bold" : "text-muted"
            }`}
            style={{ color: location.pathname === "/" ? "#e57368" : "#888" }}
          >
            <i className="bi bi-house-door-fill" style={{ fontSize: 22 }} />
            <span style={{ fontSize: 12 }}>Home</span>
          </Link>
          <Link
            to="/profile"
            className={`d-flex flex-column align-items-center text-decoration-none ${
              location.pathname === "/profile" ? "fw-bold" : "text-muted"
            }`}
            style={{ color: location.pathname === "/profile" ? "#e57368" : "#888" }}
          >
            <i className="bi bi-person-circle" style={{ fontSize: 22 }} />
            <span style={{ fontSize: 12 }}>Profile</span>
          </Link>
          <button
            className="d-flex flex-column align-items-center text-decoration-none text-muted btn btn-link p-0"
            style={{ color: "#888" }}
            onClick={() => setShowHelp(true)}
          >
            <i className="bi bi-envelope-fill" style={{ fontSize: 22 }} />
            <span style={{ fontSize: 12 }}>Contact</span>
          </button>
        </nav>
      </footer>
      {/* NeedHelpModal with mobile-friendly width */}
      <NeedHelpModal
        show={showHelp}
        onClose={() => setShowHelp(false)}
        style={
          isMobile
            ? {
                maxWidth: 340,
                width: "95vw",
                margin: "1.5rem auto",
                borderRadius: 16,
              }
            : {}
        }
      />
      {/* Cancellation Policy Modal */}
      <CancellationPolicyModal show={showCancelPolicy} onClose={() => setShowCancelPolicy(false)} />
      <RefundPolicyModal show={showRefundPolicy} onClose={() => setShowRefundPolicy(false)} />
      <TermsAndConditionsModal show={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyPolicyModal show={showPrivacy} onClose={() => setShowPrivacy(false)} /> {/* <-- Add this */}
    </>
  );
};

export default Footer;