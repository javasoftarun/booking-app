import React from "react";

const iconStyle = {
  width: 28,
  height: 28,
  verticalAlign: "middle",
  marginRight: 14,
  opacity: 0.85,
};

const NeedHelpModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 3000,
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(40,40,40,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 22,
          boxShadow: "0 12px 48px #0003",
          width: "98vw",
          maxWidth: 600, // <-- Increased width
          padding: "48px 40px", // <-- Increased padding
          border: "1.5px solid #f2eaea",
          position: "relative",
          textAlign: "center",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "none",
            border: "none",
            fontSize: 32,
            color: "#888",
            cursor: "pointer",
            zIndex: 1,
          }}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 style={{ color: "#e57368", fontWeight: 800, marginBottom: 16, fontSize: 36 }}>
          <span role="img" aria-label="help">❓</span> Need Help?
        </h2>
        <p style={{ fontSize: 20, color: "#444", marginBottom: 36 }}>
          We're here for you! Reach out to our support team for any booking or service queries.
        </p>
        <div style={{ textAlign: "left", margin: "0 auto", maxWidth: 420 }}>
          <div style={{ marginBottom: 24, display: "flex", alignItems: "center" }}>
            <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" alt="Email" style={iconStyle} />
            <span style={{ fontWeight: 500, fontSize: 18 }}>Email:</span>
            <a href="mailto:support@yatranow.com" style={{ color: "#e57368", marginLeft: 12, fontSize: 17 }}>support@yatranow.com</a>
          </div>
          <div style={{ marginBottom: 24, display: "flex", alignItems: "center" }}>
            <img src="https://cdn-icons-png.flaticon.com/512/724/724664.png" alt="Phone" style={iconStyle} />
            <span style={{ fontWeight: 500, fontSize: 18 }}>Call:</span>
            <a href="tel:+919140251119" style={{ color: "#e57368", marginLeft: 12, fontSize: 17 }}>+91 91402 51119</a>
          </div>
          <div style={{ marginBottom: 24, display: "flex", alignItems: "center" }}>
            <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" style={iconStyle} />
            <span style={{ fontWeight: 500, fontSize: 18 }}>WhatsApp:</span>
            <a href="https://wa.me/919140251119" target="_blank" rel="noopener noreferrer" style={{ color: "#e57368", marginLeft: 12, fontSize: 17 }}>Chat Now</a>
          </div>
        </div>
        <div style={{ fontSize: 15, color: "#888", marginTop: 36 }}>
          Support available: <b>9am–9pm, 7 days a week</b>
        </div>
      </div>
    </div>
  );
};

export default NeedHelpModal;