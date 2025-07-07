import React from "react";

const ProfileLoader = ({ text = "Loading..." }) => (
  <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
    <div className="spinner-border text-primary mb-3" style={{ width: 48, height: 48 }} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <div style={{ fontSize: 18, color: "#156491", fontWeight: 500, letterSpacing: 0.5 }}>
      {text}
    </div>
  </div>
);

export default ProfileLoader;