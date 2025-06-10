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
        padding: "16px 0",
      }}
    >
      <div
        className="cablist-main-container py-4"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          borderRadius: 22,
          background: "#fff",
          padding: "24px 8px",
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
            boxShadow: "none",
            border: "1.5px solid #f3f3f3",
          }}
        >
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#fffbe7",
                  borderRadius: "50%",
                  width: 48,
                  height: 48,
                  marginRight: 8,
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFD600">
                  <circle cx="12" cy="12" r="12" fill="#FFD600" opacity="0.12" />
                  <path d="M12 7v5l3 3" stroke="#FFD600" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </span>

              <div>
                <h3 className="fw-bold mb-1" style={{ color: "#e57368", fontSize: 22 }}>
                  Booking Request Received
                </h3>
                <div style={{ fontSize: 14, color: "#888" }}>
                  Your booking request has been sent. You will receive a confirmation once a driver accepts your booking.
                </div>
                {bookingId && (
                  <div style={{ fontSize: 15, color: "#1976d2", marginTop: 4 }}>
                    <b>Booking ID:</b> {bookingId}
                  </div>
                )}
                <div style={{ fontSize: 13, color: "#aaa" }}>
                  Request Date: {new Date().toLocaleString()}
                </div>
              </div>
            </div>

          </div>

          <hr />
          <div className="row mb-4 g-3">
            {/* Passenger Details Card/Table */}
            <div className="col-12">
              <div className="card shadow-sm border-0 rounded-4 h-100">
                <div className="card-body p-3">
                  <h5 className="fw-semibold mb-3" style={{ color: "#23272f" }}>
                    Passenger Details
                  </h5>
                  <div className="table-responsive">
                    <table className="table table-borderless mb-0" style={{ fontSize: 15 }}>
                      <tbody>
                        <tr>
                          <th style={{ width: 120, color: "#888" }}>Name</th>
                          <td>{user.name}</td>
                          <th style={{ width: 120, color: "#888" }}>Contact</th>
                          <td>+91 {user.contact || user.phone}</td>
                        </tr>
                        <tr>
                          <th style={{ width: 120, color: "#888" }}>Email</th>
                          <td colSpan={3}>{user.email || "N/A"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Trip & Cab Details Card/Table */}
          <div className="mb-4">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-3">
                <h5 className="fw-semibold mb-3" style={{ color: "#23272f" }}>
                  Trip & Cab Details
                </h5>
                <div className="table-responsive">
                  <table className="table table-borderless mb-0" style={{ fontSize: 15 }}>
                    <tbody>
                      <tr>
                        <th style={{ width: 120, color: "#888" }}>From</th>
                        <td>
                          <i className="bi bi-geo-alt-fill me-1" style={{ color: "#e57368" }} />
                          {pickup}
                        </td>
                        <th style={{ width: 120, color: "#888" }}>To</th>
                        <td>
                          <i className="bi bi-geo-alt me-1" style={{ color: "#1976d2" }} />
                          {drop}
                        </td>
                      </tr>
                      <tr>
                        <th style={{ color: "#888" }}>Pickup</th>
                        <td colSpan={3}>
                          <i className="bi bi-calendar-event me-1" style={{ color: "#e57368" }} />
                          {datetime}
                        </td>
                      </tr>
                      <tr>
                        <th style={{ color: "#888" }}>Cab</th>
                        <td colSpan={3}>
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
                            }}
                          />
                          <span className="fw-semibold">{cab.cabName}</span>
                          <span className="text-secondary ms-2">
                            {cab.cabType} • {cab.cabCapacity} Seats • Fuel: {cab.cabFuelType || "N/A"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <hr />
          {/* Payment Details Card/Table */}
          <div className="mb-4">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-3">
                <h5 className="fw-semibold mb-3" style={{ color: "#23272f" }}>
                  Payment Details
                </h5>
                <div className="table-responsive">
                  <table className="table table-borderless mb-0" style={{ fontSize: 14 }}>
                    <tbody>
                      <tr>
                        <th style={{ width: 140, color: "#888" }}>Payment ID</th>
                        <td className="text-end text-break" style={{ fontWeight: 500 }}>{razorpay_payment_id || "N/A"}</td>
                      </tr>
                      <tr>
                        <th style={{ width: 140, color: "#888" }}>Status</th>
                        <td className="text-end">
                          {razorpay_payment_id ? (
                            <span className="text-success fw-semibold">Paid</span>
                          ) : (
                            <span className="text-danger fw-semibold">Pending</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th style={{ width: 140, color: "#888" }}>Amount Paid</th>
                        <td className="text-end" style={{ fontWeight: 500 }}>
                          ₹{payFull ? finalFare : tokenAmount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* Fare Summary Card/Table */}
          <div className="mb-4">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body p-3">
                <h5 className="fw-semibold mb-3" style={{ color: "#23272f" }}>
                  Fare Summary
                </h5>
                <div className="table-responsive">
                  <table className="table table-borderless mb-0" style={{ fontSize: 15 }}>
                    <tbody>
                      <tr>
                        <th style={{ width: 180, color: "#888" }}>Base Fare</th>
                        <td className="text-end">₹{cab.fare}</td>
                      </tr>
                      <tr>
                        <th style={{ width: 180, color: "#888" }}>Promo Discount</th>
                        <td className={`text-end ${couponDiscount ? "text-success" : "text-secondary"}`}>
                          -₹{couponDiscount || 0}
                        </td>
                      </tr>
                      <tr className="fw-bold">
                        <th style={{ width: 180, color: "#23272f" }}>Final Fare</th>
                        <td className="text-end" style={{ color: "#23272f" }}>₹{finalFare}</td>
                      </tr>
                      {!payFull && (
                        <>
                          <tr>
                            <th style={{ width: 180, color: "#888" }}>Token Paid (10%)</th>
                            <td className="text-end">₹{tokenAmount}</td>
                          </tr>
                          <tr>
                            <th style={{ width: 180, color: "#1976d2" }}>To Pay Driver During Trip</th>
                            <td className="text-end" style={{ color: "#1976d2" }}>₹{finalFare - tokenAmount}</td>
                          </tr>
                          <tr>
                            <td colSpan={2}>
                              <div className="alert alert-info py-2 px-3 mt-2 mb-0" style={{ fontSize: 13, background: "#e3f6ff", color: "#1976d2", border: "1px solid #b6e3fa" }}>
                                <i className="bi bi-info-circle me-1"></i>
                                <b>Note:</b> Token amount is just 10% of the total fare. The remaining amount (shown above) is payable directly to the driver at the time of pickup or drop.
                              </div>
                            </td>
                          </tr>
                        </>
                      )}
                      {payFull && (
                        <tr>
                          <th style={{ width: 180, color: "#888" }}>Paid Amount</th>
                          <td className="text-end">₹{finalFare}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info mt-4 mb-0" style={{ fontSize: 14 }}>
            <i className="bi bi-info-circle me-1" />
            Cab and driver details will be shared up to 1 day before your pickup time.<br />
            For help, contact our support.
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row justify-content-center gap-3 d-print-none mt-2">
          <button className="btn btn-outline-primary flex-fill" onClick={handlePrint}>
            <i className="bi bi-printer me-1" /> Print / Download
          </button>
          <button className="btn btn-outline-secondary flex-fill" onClick={() => navigate("/")}>
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