import React from "react";

const NeedHelpModal = ({ show, onClose, style = {} }) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      tabIndex={-1}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        position: "fixed",
        inset: 0,
        pointerEvents: "auto",
        padding: 0,
      }}
      onClick={onClose}
    >
      {/* Blur overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          background: "rgba(0,0,0,0.25)",
        }}
      />
      {/* Modal content */}
      <div
        className="modal-dialog"
        style={{
          maxWidth: 600,
          width: "98vw",
          margin: 0,
          borderRadius: 24,
          boxShadow: "0 8px 32px #e5736822, 0 2px 8px #FFD60033",
          background: "transparent",
          zIndex: 2,
          ...style,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-content"
          style={{
            borderRadius: 24,
            border: "none",
            boxShadow: "0 2px 16px #00b8ff22",
            padding: 0,
            overflow: "hidden",
          }}
        >
          <div
            className="modal-header"
            style={{
              background: "linear-gradient(90deg, #fff 60%, #e3f6ff 100%)",
              borderBottom: "none",
              padding: "1.5rem 2.2rem 1rem 2.2rem",
              alignItems: "center",
              display: "flex",
            }}
          >
            <span
              style={{
                fontSize: 32,
                marginRight: 14,
                color: "#e57368", // red highlight
                verticalAlign: "middle",
              }}
              role="img"
              aria-label="help"
            >
              💬
            </span>
            <h5
              className="modal-title"
              style={{
                color: "#e57368",
                fontWeight: 800,
                fontSize: 24,
                margin: 0,
                flex: 1,
                letterSpacing: 0.5,
              }}
            >
              Need Help?
            </h5>
            <button
              type="button"
              className="btn-close"
              style={{ marginLeft: 8 }}
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div
            className="modal-body"
            style={{
              padding: "2rem 2.2rem 2rem 2.2rem",
              background: "#fff",
              color: "#23272f",
              fontSize: 17,
            }}
          >
            <div className="row g-4">
              <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <span
                  style={{
                    display: "inline-block",
                    background: "#e3f6ff",
                    borderRadius: "50%",
                    width: 70,
                    height: 70,
                    lineHeight: "70px",
                    fontSize: 34,
                    color: "#e57368", // red icon
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <div style={{ fontWeight: 700, color: "#e57368", fontSize: 19, marginBottom: 6 }}>
                  Contact Support
                </div>
                <div className="mb-2">
                  <span style={{ fontWeight: 600 }}>Email:</span>{" "}
                  <a
                    href="mailto:support@yatranow.com"
                    style={{ color: "#1976d2", textDecoration: "underline" }}
                  >
                    support@yatranow.com
                  </a>
                </div>
                <div className="mb-2">
                  <span style={{ fontWeight: 600 }}>Phone:</span>{" "}
                  <a
                    href="tel:+919140251119"
                    style={{ color: "#1976d2", textDecoration: "underline" }}
                  >
                    +91-9140251119
                  </a>
                </div>
                <div className="mb-2">
                  <span style={{ fontWeight: 600 }}>WhatsApp:</span>{" "}
                  <a
                    href="https://wa.me/919140251119"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#43a047", textDecoration: "underline" }}
                  >
                    Chat Now
                  </a>
                </div>
                <div className="mb-2">
                  <span style={{ fontWeight: 600 }}>Live Chat:</span>{" "}
                  <span style={{ color: "#1976d2" }}>Coming Soon</span>
                </div>
              </div>
              <div className="col-12 col-md-6 d-flex flex-column justify-content-center">
                <div
                  className="alert alert-info py-2 px-3 mb-3"
                  style={{
                    background: "#e3f6ff",
                    color: "#e57368", // red text
                    border: "none",
                    borderRadius: 10,
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  Our support team is available <b>24/7</b> to assist you!
                </div>
                <div
                  className="mb-3"
                  style={{
                    background: "#fff",
                    border: "1.5px solid #e57368", // red border
                    borderRadius: 10,
                    padding: "1rem 1.2rem",
                    color: "#e57368",
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                >
                  <i className="bi bi-info-circle-fill me-2" style={{ color: "#e57368" }} />
                  For urgent issues, please call or WhatsApp us directly.
                </div>
                <div
                  className="mb-2"
                  style={{
                    color: "#23272f",
                    fontSize: 15,
                  }}
                >
                  <b>Office Hours:</b> 9:00 AM – 8:00 PM (Mon-Sat)
                  <br />
                  <b>Address:</b> 2nd Floor, YatraNow HQ, Hyderabad, India
                </div>
                <div
                  className="mb-0"
                  style={{
                    color: "#888",
                    fontSize: 14,
                  }}
                >
                  For feedback or suggestions, write to us at{" "}
                  <a
                    href="mailto:feedback@yatranow.com"
                    style={{ color: "#1976d2", textDecoration: "underline" }}
                  >
                    feedback@yatranow.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeedHelpModal;