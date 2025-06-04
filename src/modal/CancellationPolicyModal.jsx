import React from "react";
import CancellationPolicyContent from "../components/CancellationPolicyContent";

const CancellationPolicyModal = ({ show, onClose }) => {
  const isMobile = window.innerWidth < 600;
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      tabIndex={-1}
      style={{
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        zIndex: 3000,
        position: "fixed",
        inset: 0,
        background: "rgba(36, 41, 46, 0.18)",
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
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />
      <div
        className="modal-dialog"
        style={{
          maxWidth: isMobile ? 420 : 540, 
          width: "98vw",
          margin: isMobile ? "0 0 1.5rem 0" : "2.5rem auto",
          borderRadius: isMobile ? 16 : 22,
          background: "transparent",
          zIndex: 2,
          boxShadow: isMobile
            ? "0 -2px 24px #e5736822"
            : "0 8px 32px #e5736822, 0 2px 8px #e5736822",
          overflow: "visible",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="modal-content"
          style={{
            border: "none",
            boxShadow: isMobile
              ? "0 2px 12px #e5736811"
              : "0 8px 32px #e5736822, 0 2px 8px #e5736822",
            padding: 0,
            overflow: "visible",
            background: "#fff",
            fontFamily: "Inter, Arial, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "auto",
              maxHeight: isMobile ? "80vh" : "80vh",
            }}
          >
            <div
              className="modal-header"
              style={{
                background: "linear-gradient(90deg, #e3f6ff 60%, #fff 100%)", // removed yellow, kept blue and white
                borderBottom: "1px solid #f3e9e7",
                padding: isMobile
                  ? "0.8rem 1rem 0.8rem 1rem"
                  : "1.1rem 1.5rem",
                alignItems: "center",
                boxShadow: "0 2px 12px #00b8ff08",
                position: isMobile ? "sticky" : "static",
                top: 0,
                zIndex: 10,
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? 20 : 24,
                  marginRight: 10,
                  color: "#e57368",
                  verticalAlign: "middle",
                  display: "flex",
                  alignItems: "center",
                }}
                role="img"
                aria-label="cancel"
              >
                <i
                  className="bi bi-x-octagon-fill"
                  style={{ color: "#e57368" }}
                />
              </span>
              <h5
                className="modal-title"
                style={{
                  color: "#e57368",
                  fontWeight: 700,
                  fontSize: isMobile ? 15 : 18,
                  margin: 0,
                  flex: 1,
                  letterSpacing: 0.5,
                  fontFamily: "inherit",
                }}
              >
                Cancellation Policy
              </h5>
              <button
                type="button"
                className="btn-close"
                style={{
                  marginLeft: 8,
                  scale: isMobile ? "0.9" : "1",
                }}
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div
              className="modal-body"
              style={{
                padding: isMobile ? "0.8rem 1rem" : "1.2rem 1.3rem",
                background: "transparent",
                fontSize: isMobile ? 13 : 15,
                fontFamily: "inherit",
                color: "#23272f",
              }}
            >
              <CancellationPolicyContent small />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationPolicyModal;