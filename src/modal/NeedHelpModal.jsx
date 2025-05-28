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
          maxWidth: 360,
          width: "95vw",
          margin: 0,
          borderRadius: 18,
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
            borderRadius: 18,
            border: "none",
            boxShadow: "0 2px 16px #00b8ff22",
            padding: 0,
            overflow: "hidden",
          }}
        >
          <div
            className="modal-header"
            style={{
              background: "linear-gradient(90deg, #e3f6ff 60%, #fffbe7 100%)",
              borderBottom: "none",
              padding: "1.2rem 1.5rem 0.7rem 1.5rem",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 28,
                marginRight: 10,
                color: "#FFD600",
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
                fontSize: 20,
                margin: 0,
                flex: 1,
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
              padding: "1.2rem 1.5rem 1.2rem 1.5rem",
              background: "#fff",
              color: "#23272f",
              fontSize: 16,
            }}
          >
            <div className="mb-3 text-center">
              <span
                style={{
                  display: "inline-block",
                  background: "#e3f6ff",
                  borderRadius: "50%",
                  width: 54,
                  height: 54,
                  lineHeight: "54px",
                  fontSize: 28,
                  color: "#1976d2",
                  marginBottom: 8,
                }}
              >
                <i className="bi bi-envelope-fill"></i>
              </span>
              <div style={{ fontWeight: 700, color: "#e57368", fontSize: 17 }}>
                Contact Support
              </div>
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
            <div className="mb-3">
              <span style={{ fontWeight: 600 }}>Phone:</span>{" "}
              <a
                href="tel:+919140251119"
                style={{ color: "#1976d2", textDecoration: "underline" }}
              >
                +91-9140251119
              </a>
            </div>
            <div
              className="alert alert-info py-2 px-3 mb-0"
              style={{
                background: "#e3f6ff",
                color: "#1976d2",
                border: "none",
                borderRadius: 10,
                fontSize: 15,
                textAlign: "center",
              }}
            >
              Our support team is available 24/7 to assist you!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeedHelpModal;