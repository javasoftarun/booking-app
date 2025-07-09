import React, { useState } from "react";
import API_ENDPOINTS from "../../config/apiConfig";

const UPCOMING_STATUSES = ["Pending", "Accepted", "Running"];

const ProfileDeactivate = () => {
  const [hasUpcoming, setHasUpcoming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const checkUpcomingBookings = async () => {
    setLoading(true);
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};
    if (!user.id) {
      setLoading(false);
      setHasUpcoming(false);
      return;
    }
    const res = await fetch(API_ENDPOINTS.GET_BOOKINGS_BY_USER_ID(user.id));
    const data = await res.json();
    if (
      data &&
      data.responseMessage === "success" &&
      Array.isArray(data.responseData) &&
      Array.isArray(data.responseData[0])
    ) {
      const upcoming = data.responseData[0].some(
        b => UPCOMING_STATUSES.includes(b.bookingStatus)
      );
      setHasUpcoming(upcoming);
    } else {
      setHasUpcoming(false);
    }
    setLoading(false);
  };

  const handleDeactivate = async () => {
    await checkUpcomingBookings();
    setShowPopup(true);
  };

  const confirmDeactivate = () => {
    // Here you would call your API to delete/deactivate the user account
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="p-4 rounded-4 shadow-sm bg-white" style={{ maxWidth: 600, margin: "0 auto" }}>
      <h4 className="fw-bold mb-4 text-danger">Deactivate Account</h4>
      <div className="alert alert-warning">
        <strong>Warning:</strong> This action will permanently remove your account and all your bookings. This cannot be undone.
      </div>
      <button
        className="btn btn-danger"
        onClick={handleDeactivate}
        disabled={loading}
      >
        {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
        Deactivate My Account
      </button>

      {/* Popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(30,32,38,0.25)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            className="shadow bg-white p-4"
            style={{
              borderRadius: 12,
              minWidth: 320,
              maxWidth: "90vw",
              textAlign: "center"
            }}
          >
            {hasUpcoming ? (
              <>
                <div className="mb-3 fw-bold text-danger" style={{ fontSize: 18 }}>
                  Cannot Deactivate Account
                </div>
                <div className="mb-4 text-muted">
                  You have upcoming bookings (Pending, Accepted, or Running).<br />
                  Please complete or cancel them before deactivating your account.
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowPopup(false)}
                >
                  OK
                </button>
              </>
            ) : (
              <>
                <div className="mb-3 fw-bold" style={{ fontSize: 18 }}>
                  Are you sure you want to deactivate your account?
                </div>
                <div className="mb-4 text-muted">
                  This action cannot be undone.
                </div>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-danger"
                    onClick={confirmDeactivate}
                  >
                    Yes, Deactivate
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDeactivate;