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
    bookingId,
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
        background: "#fff",
        padding: "6px 0",
      }}
    >
      <div
        className="cablist-main-container py-4"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          borderRadius: 22,
          background: "#fff",
          padding: "24px 8px 8px 8px",
          boxShadow: "none",
        }}
      >
        <div
          ref={printRef}
          className="bg-white rounded-4 p-3 p-md-4 mb-4"
          style={{
            maxWidth: 750,
            margin: "0 auto",
            fontFamily: "Segoe UI, Arial, sans-serif",
            boxShadow: "0 2px 16px #e5736812",
            border: "1.5px solid #f3f3f3",
          }}
        >
          {/* Receipt Header */}
          <div className="text-center mb-4">
            <div style={{ fontSize: 18, fontWeight: 600, color: "#23272f", marginTop: 8 }}>
              Booking Receipt
            </div>
            <div style={{ fontSize: 14, color: "#888", marginTop: 2 }}>
              {new Date().toLocaleString()}
            </div>
            {bookingId && (
              <div style={{ fontSize: 15, color: "#1976d2", marginTop: 4 }}>
                <b>Booking ID:</b> {bookingId}
              </div>
            )}
            <div className="mt-3 mb-2">
              <span className="badge bg-warning text-dark" style={{ fontSize: 16, padding: "8px 18px", borderRadius: 12 }}>
                <i className="bi bi-hourglass-split me-2"></i>
                Booking Status: Pending
              </span>
            </div>
            <div style={{ color: "#e57368", fontWeight: 500, fontSize: 15, marginBottom: 4 }}>
              Awaiting driver confirmation
            </div>
            <div style={{ color: "#888", fontSize: 14, marginBottom: 0 }}>
              Your booking is received. You will get a confirmation SMS/call once a driver accepts your ride.<br />
              If driver cancels, we will asign different driver with similar cab.
            </div>
            <hr className="my-3" />
          </div>

          {/* Passenger Details */}
          <div className="mb-3 p-3 rounded-3" style={{ background: "#f8fafc" }}>
            <div style={{ fontWeight: 600, color: "#e57368", fontSize: 17, marginBottom: 8 }}>
              Passenger Details
            </div>
            <div className="row">
              <div className="col-6" style={{ fontSize: 15 }}>
                <div style={{ color: "#888" }}>Name</div>
                <div style={{ fontWeight: 500 }}>{user.name}</div>
              </div>
              <div className="col-6" style={{ fontSize: 15 }}>
                <div style={{ color: "#888" }}>Contact</div>
                <div style={{ fontWeight: 500 }}>+91 {user.contact || user.phone}</div>
              </div>
              <div className="col-12 mt-2" style={{ fontSize: 15 }}>
                <div style={{ color: "#888" }}>Email</div>
                <div style={{ fontWeight: 500 }}>{user.email || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* Trip & Cab Details */}
          <div className="mb-3 p-3 rounded-3" style={{ background: "#f8fafc" }}>
            <div style={{ fontWeight: 600, color: "#e57368", fontSize: 17, marginBottom: 8 }}>
              Trip & Cab Details
            </div>
            <div className="row">
              <div className="col-6" style={{ fontSize: 15 }}>
                <div style={{ color: "#888" }}>From</div>
                <div>
                  <i className="bi bi-geo-alt-fill me-1" style={{ color: "#e57368" }} />
                  {pickup}
                </div>
              </div>
              <div className="col-6" style={{ fontSize: 15 }}>
                <div style={{ color: "#888" }}>To</div>
                <div>
                  <i className="bi bi-geo-alt me-1" style={{ color: "#1976d2" }} />
                  {drop}
                </div>
              </div>
              <div className="col-12 mt-2" style={{ fontSize: 15 }}>
                <div style={{ color: "#888" }}>Pickup</div>
                <div>
                  <i className="bi bi-calendar-event me-1" style={{ color: "#e57368" }} />
                  {datetime}
                </div>
              </div>
              <div className="col-12 mt-2" style={{ fontSize: 15 }}>
                <div style={{ color: "#888" }}>Cab</div>
                <div>
                  <img
                    src={cab.cabImageUrl}
                    alt={cab.cabName}
                    style={{
                      width: 40,
                      height: 28,
                      objectFit: "contain",
                      borderRadius: 6,
                      background: "#f8fafc",
                      border: "1px solid #eee",
                      marginRight: 8,
                      verticalAlign: "middle",
                    }}
                  />
                  <span className="fw-semibold">{cab.cabName}</span>
                  <span className="text-secondary ms-2">
                    {cab.cabType} • {cab.cabCapacity} Seats • Fuel: {cab.cabFuelType || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-3 p-3 rounded-3" style={{ background: "#f8fafc" }}>
            <div style={{ fontWeight: 600, color: "#e57368", fontSize: 17, marginBottom: 8 }}>
              Payment Details
            </div>
            <div style={{ fontSize: 15 }}>
              <div className="row">
                <div className="col-6">
                  <div style={{ color: "#888" }}>Payment ID</div>
                  <div style={{ fontWeight: 500 }}>{razorpay_payment_id || "N/A"}</div>
                </div>
                <div className="col-6">
                  <div style={{ color: "#888" }}>Status</div>
                  <div style={{ fontWeight: 500 }}>
                    {razorpay_payment_id ? (
                      <span className="text-success">Paid</span>
                    ) : (
                      <span className="text-danger">Pending</span>
                    )}
                  </div>
                </div>
                <div className="col-12 mt-2">
                  <div style={{ color: "#888" }}>Amount Paid</div>
                  <div style={{ fontWeight: 500 }}>
                    ₹{payFull ? finalFare : tokenAmount}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fare Summary */}
          <div className="mb-3 p-3 rounded-3" style={{ background: "#f8fafc" }}>
            <div style={{ fontWeight: 600, color: "#e57368", fontSize: 17, marginBottom: 8 }}>
              Fare Summary
            </div>
            <div style={{ fontSize: 15 }}>
              <div className="d-flex justify-content-between">
                <span>Base Fare</span>
                <span>₹{cab.fare}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Promo Discount</span>
                <span className={couponDiscount ? "text-success" : "text-secondary"}>
                  -₹{couponDiscount || 0}
                </span>
              </div>
              <div className="d-flex justify-content-between fw-bold" style={{ color: "#23272f" }}>
                <span>Final Fare</span>
                <span>₹{finalFare}</span>
              </div>
              {!payFull && (
                <>
                  <div className="d-flex justify-content-between">
                    <span>Token Paid (10%)</span>
                    <span>₹{tokenAmount}</span>
                  </div>
                  <div className="d-flex justify-content-between" style={{ color: "#1976d2" }}>
                    <span>To Pay Driver During Trip</span>
                    <span>₹{finalFare - tokenAmount}</span>
                  </div>
                  <div className="alert alert-info py-2 px-3 mt-2 mb-0" style={{ fontSize: 13, background: "#e3f6ff", color: "#1976d2", border: "1px solid #b6e3fa" }}>
                    <i className="bi bi-info-circle me-1"></i>
                    <b>Note:</b> Token amount is just 10% of the total fare. The remaining amount is payable directly to the driver at the time of pickup or drop.
                  </div>
                </>
              )}
              {payFull && (
                <div className="d-flex justify-content-between">
                  <span>Paid Amount</span>
                  <span>₹{finalFare}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="alert alert-info mt-4 mb-0" style={{ fontSize: 14 }}>
            <i className="bi bi-info-circle me-1" />
            Cab and driver details will be shared up to a few hours before your pickup time.<br />
            For help, contact our support.
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-center gap-3 d-print-none mt-2">
          <button
            className="btn btn-outline-primary"
            style={{ minWidth: 160, fontSize: 15, padding: "6px 18px", borderRadius: 8 }}
            onClick={handlePrint}
          >
            <i className="bi bi-printer me-1" /> Print / Download
          </button>
          <button
            className="btn btn-outline-secondary"
            style={{ minWidth: 160, fontSize: 15, padding: "6px 18px", borderRadius: 8 }}
            onClick={() => navigate("/")}
          >
            Book Another Cab
          </button>
        </div>
      </div>
      <style>
        {`
          @media (max-width: 767px) {
            .cablist-main-container {
              padding: 0 !important;
              border-radius: 0 !important;
              box-shadow: none !important;
            }
            .bg-white.rounded-4.shadow {
              padding: 1.1rem 0.4rem !important;
              border-radius: 10px !important;
              max-width: 99vw !important;
            }
            .d-flex.flex-md-row {
              flex-direction: column !important;
            }
            .row > [class*='col-'] {
              margin-bottom: 1.2rem !important;
            }
          }
          @media (max-width: 600px) {
            .responsive-table {
              width: 100%;
              display: block;
            }
            .responsive-table thead {
              display: none;
            }
            .responsive-table tr {
              display: block;
              margin-bottom: 18px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            }
            .responsive-table td, .responsive-table th {
              display: block;
              width: 100%;
              text-align: left !important;
              padding: 6px 0 !important;
            }
            .responsive-table td:before {
              content: attr(data-label);
              font-weight: 600;
              color: #888;
              display: block;
              margin-bottom: 2px;
            }
            .responsive-table td.text-end {
              text-align: left !important;
            }
          }
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