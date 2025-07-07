import React from "react";

const ProfileDeactivate = () => {
  const handleDeactivate = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="p-4 rounded-4 shadow-sm bg-white" style={{ maxWidth: 600, margin: "0 auto" }}>
      <h4 className="fw-bold mb-4 text-danger">Deactivate Account</h4>
      <div className="alert alert-warning">
        <strong>Warning:</strong> This action will permanently remove your account and all your bookings. This cannot be undone.
      </div>
      <button className="btn btn-danger" onClick={handleDeactivate}>
        Deactivate My Account
      </button>
    </div>
  );
};

export default ProfileDeactivate;