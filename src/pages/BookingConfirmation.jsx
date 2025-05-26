import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const printRef = useRef();

  const {
    cab,
    pickup,
    drop,
    datetime,
    tokenAmount,
    payFull,
    couponDiscount,
    finalFare,
    user,
    razorpay_payment_id,
  } = location.state || {};

  if (!cab || !user) {
    return (
      <div className="container py-5 text-center">
        <h3>Booking details not found.</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #e3f6ff 60%, #fffbe7 100%)",
      }}
    >
      <div
        className="cablist-main-container py-5"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          borderRadius: 28,
          boxShadow: "0 8px 40px #00b8ff22, 0 2px 8px #FFD60033",
          padding: "40px 18px",
        }}
      >
        <div
          ref={printRef}
          className="bg-white rounded-4 shadow p-4 p-md-5 mb-4"
          style={{
            border: "1px solid #e3e6ed",
            maxWidth: 750,
            margin: "0 auto",
            fontFamily: "Segoe UI, Arial, sans-serif",
          }}
        >
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h3 className="fw-bold mb-1" style={{ color: "#1976d2" }}>
                <i className="bi bi-check-circle-fill text-success me-2" />
                Booking Confirmed!
              </h3>
              <div style={{ fontSize: 15, color: "#888" }}>
                Booking Date: {new Date().toLocaleString()}
              </div>
            </div>
            <div>
              <span style={{
                fontWeight: 700,
                fontSize: 32,
                fontFamily: "Segoe UI, Arial, sans-serif",
                letterSpacing: 1
              }}>
                <span style={{ color: "#e57368" }}>Yatra</span>
                <span style={{ color: "#FFD600" }}>Now</span>
              </span>
            </div>
          </div>
          {/* Trip Summary Tags */}
          <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
            <span
              className="badge rounded-pill bg-primary-subtle text-primary px-3 py-2"
              style={{ fontSize: 15 }}
            >
              <i className="bi bi-geo-alt-fill me-1"></i> {pickup}
            </span>
            <i className="bi bi-arrow-right mx-2" />
            <span
              className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2"
              style={{ fontSize: 15 }}
            >
              <i className="bi bi-geo-alt-fill me-1"></i> {drop}
            </span>
            <span
              className="badge rounded-pill bg-info-subtle text-info px-3 py-2 ms-2"
              style={{ fontSize: 15 }}
            >
              <i className="bi bi-calendar-event me-1"></i> {datetime}
            </span>
          </div>
          <hr />
          <div className="row mb-4">
            {/* Passenger Details */}
            <div className="col-md-6 mb-3 mb-md-0">
              <h5 className="fw-semibold mb-2" style={{ color: "#23272f" }}>
                Passenger Details
              </h5>
              <div style={{ fontSize: 16 }}>
                <div>
                  <b>Name:</b> {user.name}
                </div>
                <div>
                  <b>Contact:</b> +91 {user.contact || user.phone}
                </div>
                <div>
                  <b>Email:</b> {user.email || "N/A"}
                </div>
              </div>
            </div>
            {/* Payment Details */}
            <div className="col-md-6">
              <h5 className="fw-semibold mb-2" style={{ color: "#23272f" }}>
                Payment Details
              </h5>
              <div style={{ fontSize: 16 }}>
                <div>
                  <b>Payment ID:</b>{" "}
                  <span className="text-break">{razorpay_payment_id}</span>
                </div>
                <div>
                  <b>Status:</b> <span className="text-success">Paid</span>
                </div>
                <div>
                  <b>Amount Paid:</b> ₹{tokenAmount}
                  {!payFull && (
                    <span className="text-secondary ms-2">
                      (Balance: ₹{finalFare - tokenAmount})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-4">
            {/* Trip Details */}
            <div className="col-md-6 mb-3 mb-md-0">
              <h5 className="fw-semibold mb-2" style={{ color: "#23272f" }}>
                Trip Details
              </h5>
              <div style={{ fontSize: 16 }}>
                <div>
                  <i
                    className="bi bi-geo-alt-fill me-1"
                    style={{ color: "#e57368" }}
                  />
                  <b>From:</b> {pickup}
                </div>
                <div>
                  <i className="bi bi-geo-alt me-1" style={{ color: "#1976d2" }} />
                  <b>To:</b> {drop}
                </div>
                <div>
                  <i
                    className="bi bi-calendar-event me-1"
                    style={{ color: "#e57368" }}
                  />
                  <b>Pickup:</b> {datetime}
                </div>
              </div>
            </div>
            {/* Cab Details */}
            <div className="col-md-6">
              <h5 className="fw-semibold mb-2" style={{ color: "#23272f" }}>
                Cab Details
              </h5>
              <div className="d-flex align-items-center gap-3 mb-2">
                <img
                  src={cab.cabImageUrl}
                  alt={cab.cabName}
                  style={{
                    width: 60,
                    height: 40,
                    objectFit: "contain",
                    borderRadius: 8,
                    background: "#f8fafc",
                    border: "1px solid #eee",
                  }}
                />
                <div>
                  <div className="fw-semibold" style={{ fontSize: 17 }}>
                    {cab.cabName}
                  </div>
                  <div className="text-secondary" style={{ fontSize: 15 }}>
                    {cab.cabType} • {cab.cabCapacity} Seats
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 15 }}>
                <b>Fuel:</b> {cab.cabFuelType || "N/A"}
              </div>
            </div>
          </div>
          <hr />
          {/* Fare Summary */}
          <div className="mb-3">
            <h5 className="fw-semibold mb-2" style={{ color: "#23272f" }}>
              Fare Summary
            </h5>
            <div className="d-flex justify-content-between" style={{ fontSize: 16 }}>
              <span>Base Fare</span>
              <span>₹{cab.fare}</span>
            </div>
            <div className="d-flex justify-content-between" style={{ fontSize: 16 }}>
              <span>Promo Discount</span>
              <span className={couponDiscount ? "text-success" : "text-secondary"}>
                -₹{couponDiscount || 0}
              </span>
            </div>
            <div className="d-flex justify-content-between fw-bold" style={{ fontSize: 17 }}>
              <span>Final Fare</span>
              <span>₹{finalFare}</span>
            </div>
            {!payFull && (
              <>
                <div className="d-flex justify-content-between" style={{ fontSize: 16 }}>
                  <span>Token Paid (10%)</span>
                  <span>₹{tokenAmount}</span>
                </div>
                <div className="d-flex justify-content-between" style={{ fontSize: 16, color: "#1976d2" }}>
                  <span>To Pay Driver During Trip</span>
                  <span>₹{finalFare - tokenAmount}</span>
                </div>
                <div className="alert alert-info py-2 px-3 mt-2" style={{ fontSize: 14, background: "#e3f6ff", color: "#1976d2", border: "1px solid #b6e3fa" }}>
                  <i className="bi bi-info-circle me-1"></i>
                  <b>Note:</b> Token amount is just 10% of the total fare. The remaining amount (shown above) is payable directly to the driver at the time of pickup or drop.
                </div>
              </>
            )}
            {payFull && (
              <div className="d-flex justify-content-between" style={{ fontSize: 16 }}>
                <span>Paid Amount</span>
                <span>₹{finalFare}</span>
              </div>
            )}
          </div>
          <div className="alert alert-info mt-4 mb-0" style={{ fontSize: 15 }}>
            <i className="bi bi-info-circle me-1" />
            Cab and driver details will be shared up to 1 day before your pickup time.<br />
            For help, contact our support.
          </div>
        </div>
        <div className="d-flex justify-content-center gap-3 d-print-none">
          <button className="btn btn-outline-primary" onClick={handlePrint}>
            <i className="bi bi-printer me-1" /> Print / Download
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
            Book Another Cab
          </button>
        </div>
      </div>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden !important;
            }
            .cablist-main-container, .cablist-main-container * {
              visibility: visible !important;
            }
            .d-print-none {
              display: none !important;
            }
            .cablist-main-container {
              margin: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              padding: 0 !important;
            }
            .bg-white {
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BookingConfirmation;