import React from "react";

const Footer = () => (
  <footer
    style={{
      background: "#f5f6fa",
      color: "#23272f",
      padding: "0",
      marginTop: 64,
      borderTop: "4px solid #e57368",
      boxShadow: "0 -2px 24px #e5736840",
      letterSpacing: 0.5,
    }}
  >
    <div className="container py-4">
      <div className="row align-items-center">
        <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
          <span style={{
            fontSize: 28,
            fontWeight: 900,
            color: "#e57368",
            letterSpacing: 2,
            textShadow: "0 2px 8px #0001"
          }}>
            <i className="bi bi-taxi-front-fill me-2" style={{ color: "#23272f", fontSize: 28, verticalAlign: "middle" }} />
            YatraNow
          </span>
        </div>
        <div className="col-md-4 text-center mb-3 mb-md-0">
          <div style={{ fontSize: 15 }}>
            All rights reserved &copy; {new Date().getFullYear()}
          </div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>
            Designed with <span style={{ color: "#e57368" }}>♥</span> for your travel needs.
          </div>
        </div>
        <div className="col-md-4 text-center text-md-end">
          <div style={{ fontSize: 15 }}>
            Need help?{" "}
            <a
              href="mailto:support@yatranow.com"
              style={{
                color: "#e57368",
                textDecoration: "underline",
                fontWeight: 600,
              }}
            >
              support@yatranow.com
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;