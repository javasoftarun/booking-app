import React, { useState } from "react";
import { Link } from "react-router-dom";
import NeedHelpModal from "../modal/NeedHelpModal";
import CancellationPolicyModal from "../modal/CancellationPolicyModal";
import RefundPolicyModal from "../modal/RefundPolicyModal";
import TermsAndConditionsModal from "../modal/TermsAndConditionsModal";
import PrivacyPolicyModal from "../modal/PrivacyPolicyModal";
import logo from "../assets/images/logo.png"; // Add this import

const Footer = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showCancelPolicy, setShowCancelPolicy] = useState(false);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Detect mobile view
  const isMobile = window.innerWidth < 992;

  return (
    <>
      {/* Desktop Footer */}
      <footer className="bg-white border-top">
        <div className="container py-5">
          <div className="row gy-4 gx-5 flex-column flex-md-row">
            {/* Brand and tagline */}
            <div className="col-12 col-md-4 mb-4 mb-md-0 text-center text-md-start">
              <div className="d-flex align-items-center gap-2 mb-3 justify-content-center justify-content-md-start">
                <img
                  src={logo}
                  alt="Bhada24 Logo"
                  style={{ height: 56, width: "auto", marginRight: 8 }}
                />
              </div>
              <div className="text-muted mb-3 mx-auto mx-md-0" style={{ fontSize: 15, maxWidth: 320 }}>
                Your trusted partner for safe, fast, and affordable travel bookings across India.
              </div>
              <div className="d-flex align-items-center gap-3 mt-3 justify-content-center justify-content-md-start">
                <a href="https://facebook.com/bhada24" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i className="bi bi-facebook" style={{ fontSize: 22, color: "#4267B2" }} />
                </a>
                <a href="https://twitter.com/bhada24" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <i className="bi bi-twitter" style={{ fontSize: 22, color: "#1DA1F2" }} />
                </a>
                <a href="https://instagram.com/bhada24" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="bi bi-instagram" style={{ fontSize: 22, color: "#C13584" }} />
                </a>
                <a href="https://linkedin.com/company/bhada24" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <i className="bi bi-linkedin" style={{ fontSize: 22, color: "#0077B5" }} />
                </a>
              </div>
            </div>
            {/* Useful Links */}
            <div className="col-12 col-md-2 mb-4 mb-md-0 text-center text-md-start">
              <div className="fw-semibold mb-3" style={{ color: "#e57368", fontSize: 17 }}>Useful Links</div>
              <ul className="list-unstyled mb-2" style={{ fontSize: 15, lineHeight: 2 }}>
                <li>
                  <Link
                    to="/"
                    className="text-decoration-none text-muted"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <button
                    className="btn btn-link text-decoration-none text-muted p-0"
                    style={{ color: "#888" }}
                    onClick={() => {
                      setShowHelp(true);
                    }}
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-decoration-none text-muted"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            {/* Quick Help */}
            <div className="col-12 col-md-3 mb-4 mb-md-0 text-center text-md-start">
              <div className="fw-semibold mb-3" style={{ color: "#e57368", fontSize: 17 }}>Quick Help</div>
              <ul className="list-unstyled mb-2" style={{ fontSize: 15, lineHeight: 2 }}>
                <li>
                  <button
                    className="btn btn-link text-decoration-none text-muted p-0"
                    style={{ color: "#888" }}
                    onClick={() => {
                      setShowCancelPolicy(true);
                    }}
                  >
                    Cancellation Policy
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-link text-decoration-none text-muted p-0"
                    style={{ color: "#888" }}
                    onClick={() => {
                      setShowRefundPolicy(true);
                    }}
                  >
                    Refund Policy
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-link text-decoration-none text-muted p-0"
                    style={{ color: "#888" }}
                    onClick={() => {
                      setShowTerms(true);
                    }}
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-link text-decoration-none text-muted p-0"
                    style={{ color: "#888" }}
                    onClick={() => {
                      setShowPrivacy(true);
                    }}
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>
            {/* Contact Info */}
            <div className="col-12 col-md-3 text-center text-md-start">
              <div className="fw-semibold mb-3" style={{ color: "#e57368", fontSize: 17 }}>Contact Us</div>
              <div style={{ fontSize: 15 }}>
                <div className="mb-2 d-flex align-items-center justify-content-center justify-content-md-start">
                  <i className="bi bi-envelope-fill me-2" style={{ color: "#FFD600" }} />
                  <a href="mailto:support@bhada24.com" className="text-decoration-none text-muted">
                    support@bhada24.com
                  </a>
                </div>
                <div className="mb-2 d-flex align-items-center justify-content-center justify-content-md-start">
                  <i className="bi bi-telephone-fill me-2" style={{ color: "#FFD600" }} />
                  <a href="tel:+919140251119" className="text-decoration-none text-muted">
                    +91-9140251119
                  </a>
                </div>
                <div className="mb-2 d-flex align-items-center justify-content-center justify-content-md-start">
                  <i className="bi bi-geo-alt-fill me-2" style={{ color: "#FFD600" }} />
                  <span>Varanasi, Uttar Pradesh, India</span>
                </div>
                <div className="mt-3">
                  <span className="fw-semibold" style={{ color: "#e57368", fontSize: 15 }}>Business Hours:</span>
                  <div style={{ fontSize: 14, color: "#888" }}>Mon - Sat: 9:00am - 06:00pm</div>
                  <div style={{ fontSize: 14, color: "#888" }}>Sunday: 9:00am - 2:00pm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container text-center text-muted small py-3 border-top" style={{ fontSize: 13 }}>
          &copy; {new Date().getFullYear()} Bhada24. All rights reserved. | Designed with <span style={{ color: "#e57368" }}>♥</span> in India
        </div>
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
      <PrivacyPolicyModal show={showPrivacy} onClose={() => setShowPrivacy(false)} />

      <style>
        {`
          @media (max-width: 991px) {
            .row.flex-column {
              flex-direction: column !important;
            }
            .row.flex-column > [class^="col-"] {
              max-width: 100% !important;
              flex: 0 0 100% !important;
            }
            footer .mb-4 {
              margin-bottom: 2rem !important;
            }
          }
          @media (max-width: 575px) {
            footer .container {
              padding-left: 8px !important;
              padding-right: 8px !important;
              width: 100vw !important;
              max-width: 100vw !important;
              overflow-x: hidden !important;
            }
            footer .row {
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            footer [class^="col-"] {
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            body, html {
              overflow-x: hidden !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Footer;