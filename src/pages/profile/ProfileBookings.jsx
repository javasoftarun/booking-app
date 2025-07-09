import React, { useEffect, useState } from "react";
import API_ENDPOINTS from "../../config/apiConfig";
import ProfileLoader from "../../components/ProfileLoader";
import BookingReceipt from "../../components/BookingReceipt";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const STATUS_COLORS = {
  Confirmed: "#38c172",
  Pending: "#FFD600",
  Cancelled: "#dc3545",
  Completed: "#1976d2",
};

const UPCOMING_STATUSES = ["Pending", "Accepted", "Running"];
const HISTORY_STATUSES = ["Cancelled", "Completed"];
const USER_DEFAULT_ROLE = "user";

const ProfileBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [downloadBooking, setDownloadBooking] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [setMessage] = useState("");
  const [setMessageType] = useState("");
  const [cancelConfirm, setCancelConfirm] = useState({ show: false, booking: null });
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const userId = userStr ? JSON.parse(userStr).id || JSON.parse(userStr)._id || JSON.parse(userStr).userId : null;
    if (!userId) return;
    fetch(API_ENDPOINTS.GET_BOOKINGS_BY_USER_ID(userId))
      .then(res => res.json())
      .then(data => {
        let arr = [];
        if (
          data &&
          data.responseMessage === "success" &&
          Array.isArray(data.responseData) &&
          Array.isArray(data.responseData[0])
        ) {
          arr = data.responseData[0];
        }
        setBookings(arr);
      })
      .finally(() => setLoading(false));
  }, []);

  // Ask for confirmation before cancelling
  const handleCancelBooking = (booking) => {
    setCancelConfirm({ show: true, booking });
  };

  // Confirm and perform cancellation
  const confirmCancelBooking = async () => {
    setMessage("");
    setMessageType("");
    setCancelLoading(true);
    const booking = cancelConfirm.booking;
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_BOOKING_STATUS, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          cabRegistrationId: booking.cabRegistrationId,
          bookingStatus: "Cancelled",
          paymentStatus: null,
          role: USER_DEFAULT_ROLE
        }),
      });
      const data = await response.json();
      if (data && data.responseMessage === "success") {
        setMessage("Booking cancelled successfully!");
        setMessageType("success");
        setBookings((prev) =>
          prev.map((b) =>
            b.bookingId === booking.bookingId
              ? { ...b, bookingStatus: "Cancelled" }
              : b
          )
        );
        setSelectedBooking(null);
      } else {
        setMessage(data.responseMessage || "Failed to cancel booking.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Failed to cancel booking.");
      setMessageType("error");
    } finally {
      setCancelLoading(false);
      setCancelConfirm({ show: false, booking: null });
    }
  };

  const handleShareReceipt = (booking) => {
    alert("Share receipt for booking: " + booking.bookingId);
  };

  // PDF Download Handler (like UserProfile)
  const handleDownloadReceipt = async (booking) => {
    setDownloadBooking(booking);
    await new Promise((resolve) => setTimeout(resolve, 200)); // Wait for render

    const element = document.getElementById("pdf-receipt-container");
    if (!element) {
      setMessage("Receipt not ready. Please try again.");
      setMessageType("error");
      setDownloadBooking(null);
      return;
    }

    const canvas = await html2canvas(element, { useCORS: true, backgroundColor: "#fff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Bhada24-Booking-${booking.bookingId}.pdf`);
    setDownloadBooking(null);
  };

  // Categorize bookings
  const upcomingBookings = bookings.filter(
    (b) =>
      UPCOMING_STATUSES.includes(
        (b.bookingStatus || "").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
      )
  );
  const historyBookings = bookings.filter(
    (b) =>
      HISTORY_STATUSES.includes(
        (b.bookingStatus || "").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
      )
  );

  if (loading) return <ProfileLoader text="Fetching your bookings..." />;
  if (!bookings.length)
    return (
      <div className="text-center py-5">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
          alt="No bookings"
          style={{ width: 90, opacity: 0.7, marginBottom: 16 }}
        />
        <div className="fw-bold" style={{ color: "#e57368", fontSize: 22 }}>
          No bookings found.
        </div>
        <div className="text-muted mt-2">You haven't made any cab bookings yet.</div>
      </div>
    );

  return (
    <div>
      <h4 className="fw-bold mb-4" style={{ color: "#e57368" }}>My Bookings</h4>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => setActiveTab("upcoming")}
            style={{ cursor: "pointer" }}
          >
            Upcoming Bookings
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
            style={{ cursor: "pointer" }}
          >
            Booking History
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === "upcoming" && (
        <div className="mb-5">
          <div className="row g-4">
            {upcomingBookings.length === 0 && (
              <div className="text-muted px-3 pb-3 d-flex align-items-center justify-content-center" style={{ minHeight: 200 }}>
                <div>No upcoming bookings.</div>
              </div>
            )}
            {upcomingBookings.map((booking) => (
              <div key={booking.bookingId} className="col-12 col-md-6 col-lg-4">
                <div
                  className="shadow-sm bg-white h-100 booking-card"
                  style={{
                    border: "1.5px solid #f3f3f3",
                    borderRadius: 18,
                    padding: 0,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 320,
                    cursor: "pointer"
                  }}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div
                    style={{
                      background: "#f8fafc",
                      borderBottom: "1.5px solid #FFD600",
                      padding: "18px 20px 10px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/296/296216.png"
                      alt="Cab"
                      style={{ width: 38, height: 38, objectFit: "contain" }}
                    />
                    <div>
                      <div className="fw-bold" style={{ color: "#1976d2", fontSize: 18 }}>
                        {booking.cabName}
                      </div>
                      <div className="text-muted" style={{ fontSize: 14 }}>
                        {booking.pickupLocation} <span style={{ color: "#e57368" }}>→</span> {booking.dropLocation}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "18px 20px 10px 20px", flex: 1 }}>
                    <div className="mb-2">
                      <span className="fw-semibold" style={{ color: "#23272f" }}>Date:</span>{" "}
                      <span>{new Date(booking.pickupDateTime).toLocaleString()}</span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-semibold" style={{ color: "#23272f" }}>Status:</span>{" "}
                      <span
                        style={{
                          color: STATUS_COLORS[booking.bookingStatus] || "#23272f",
                          fontWeight: 600,
                        }}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-semibold" style={{ color: "#23272f" }}>Fare:</span>{" "}
                      <span style={{ color: "#e57368", fontWeight: 700 }}>₹{booking.fare}</span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-semibold" style={{ color: "#23272f" }}>Booking ID:</span>{" "}
                      <span style={{ fontSize: 13, color: "#888" }}>{booking.bookingId}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid #f3f3f3",
                      background: "#f8fafc",
                      padding: "12px 20px",
                      display: "flex",
                      gap: 10,
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className="btn btn-outline-info btn-sm"
                      style={{ minWidth: 80, fontWeight: 600 }}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <i className="bi bi-eye me-1" />
                      View
                    </button>
                    {booking.bookingStatus !== "Cancelled" && booking.bookingStatus !== "Completed" && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        style={{ minWidth: 80, fontWeight: 600 }}
                        disabled={actionLoading[booking.bookingId]}
                        onClick={() => handleCancelBooking(booking)}
                      >
                        {actionLoading[booking.bookingId] ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <>
                            <i className="bi bi-x-circle me-1" />
                            Cancel
                          </>
                        )}
                      </button>
                    )}
                    <button
                      className="btn btn-outline-primary btn-sm"
                      style={{ minWidth: 80, fontWeight: 600 }}
                      onClick={() => handleDownloadReceipt(booking)}
                    >
                      <i className="bi bi-download me-1" />
                      Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div>
          <div className="row g-4">
            {historyBookings.length === 0 && (
              <div className="text-muted px-3 pb-3">No booking history.</div>
            )}
            {historyBookings.map((booking) => (
              <div key={booking.bookingId} className="col-12 col-md-6 col-lg-4">
                <div
                  className="shadow-sm bg-white h-100 booking-card"
                  style={{
                    border: "1.5px solid #f3f3f3",
                    borderRadius: 18,
                    padding: 0,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 320,
                    cursor: "pointer"
                  }}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div
                    style={{
                      background: "#f8fafc",
                      borderBottom: "1.5px solid #FFD600",
                      padding: "18px 20px 10px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/296/296216.png"
                      alt="Cab"
                      style={{ width: 38, height: 38, objectFit: "contain" }}
                    />
                    <div>
                      <div className="fw-bold" style={{ color: "#1976d2", fontSize: 18 }}>
                        {booking.cabName}
                      </div>
                      <div className="text-muted" style={{ fontSize: 14 }}>
                        {booking.pickupLocation} <span style={{ color: "#e57368" }}>→</span> {booking.dropLocation}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "18px 20px 10px 20px", flex: 1 }}>
                    <div className="mb-2">
                      <span className="fw-semibold" style={{ color: "#23272f" }}>Date:</span>{" "}
                      <span>{new Date(booking.pickupDateTime).toLocaleString()}</span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-semibold" style={{ color: "#23272f" }}>Status:</span>{" "}
                      <span
                        style={{
                          color: STATUS_COLORS[booking.bookingStatus] || "#23272f",
                          fontWeight: 600,
                        }}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-semibold" style={{ color: "#23272f" }}>Fare:</span>{" "}
                      <span style={{ color: "#e57368", fontWeight: 700 }}>₹{booking.fare}</span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-semibold" style={{ color: "#23272f" }}>Booking ID:</span>{" "}
                      <span style={{ fontSize: 13, color: "#888" }}>{booking.bookingId}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid #f3f3f3",
                      background: "#f8fafc",
                      padding: "12px 20px",
                      display: "flex",
                      gap: 10,
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      className="btn btn-outline-info btn-sm"
                      style={{ minWidth: 80, fontWeight: 600 }}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <i className="bi bi-eye me-1" />
                      View
                    </button>
                    {booking.bookingStatus !== "Cancelled" && booking.bookingStatus !== "Completed" && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        style={{ minWidth: 80, fontWeight: 600 }}
                        disabled={actionLoading[booking.bookingId]}
                        onClick={() => handleCancelBooking(booking)}
                      >
                        {actionLoading[booking.bookingId] ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          <>
                            <i className="bi bi-x-circle me-1" />
                            Cancel
                          </>
                        )}
                      </button>
                    )}
                    <button
                      className="btn btn-outline-primary btn-sm"
                      style={{ minWidth: 80, fontWeight: 600 }}
                      onClick={() => handleDownloadReceipt(booking)}
                    >
                      <i className="bi bi-download me-1" />
                      Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Details Popup */}
      {selectedBooking && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(30,32,38,0.25)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
          }}
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="shadow bg-white"
            style={{
              position: "relative",
              minWidth: 0,
              width: "100%",
              maxWidth: 420,
              borderRadius: 16,
              padding: "32px 24px 24px 24px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxSizing: "border-box",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Booking ID in top right corner */}
            <span
              style={{
                position: "absolute",
                top: 18,
                right: 54,
                fontSize: 13,
                color: "#888",
                background: "#f8fafc",
                borderRadius: 8,
                padding: "2px 10px",
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              #{selectedBooking.bookingId}
            </span>
            <button
              className="btn btn-light"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                borderRadius: "50%",
                fontSize: 18,
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1.5px solid #e57368",
                color: "#e57368",
              }}
              onClick={() => setSelectedBooking(null)}
              aria-label="Close"
            >
              <i className="bi bi-x-lg"></i>
            </button>

            {/* Address Header */}
            <div className="mb-3 pb-2" style={{ borderBottom: "1px solid #FFD600" }}>
              <div className="fw-bold" style={{ color: "#1976d2", fontSize: 20 }}>
                {selectedBooking.cabName || "Cab"}
              </div>
              <div className="text-muted" style={{ fontSize: 15 }}>
                {selectedBooking.pickupLocation} <span style={{ color: "#e57368" }}>→</span> {selectedBooking.dropLocation}
              </div>
            </div>

            {/* Cab Details */}
            <div className="mb-4 d-flex align-items-center gap-3">
              <img
                src={
                  selectedBooking.cabImageUrl ||
                  "https://cdn-icons-png.flaticon.com/512/296/296216.png"
                }
                alt="Cab"
                style={{
                  width: 70,
                  height: 48,
                  objectFit: "cover",
                  borderRadius: 8,
                  background: "#f8fafc",
                  border: "1px solid #eee",
                }}
              />
              <div>
                <div className="fw-bold" style={{ color: "#23272f", fontSize: 17 }}>
                  {selectedBooking.cabModel || selectedBooking.cabName || "-"}
                </div>
                <div className="text-muted" style={{ fontSize: 15 }}>
                  {selectedBooking.cabType || "Cab"} • {selectedBooking.cabCapacity || "—"} Seats
                </div>
                <div className="text-muted" style={{ fontSize: 14 }}>
                  <b>Fuel:</b> {selectedBooking.fuelType || "N/A"}
                  {selectedBooking.ac !== undefined && (
                    <span className="ms-2">
                      <b>AC:</b> {selectedBooking.ac ? "Yes" : "No"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-semibold" style={{ color: "#23272f" }}>Date & Time</span>
                <span>{new Date(selectedBooking.pickupDateTime).toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-semibold" style={{ color: "#23272f" }}>Status</span>
                <span
                  style={{
                    color: STATUS_COLORS[selectedBooking.bookingStatus] || "#23272f",
                    fontWeight: 600,
                  }}
                >
                  {selectedBooking.bookingStatus}
                </span>
              </div>
            </div>

            {/* Fare Summary */}
            <div className="mb-4">
              <div className="fw-semibold mb-2" style={{ color: "#1976d2", fontSize: 16 }}>Fare Summary</div>
              <div className="d-flex justify-content-between">
                <span>Base Fare</span>
                <span>₹{selectedBooking.fare ?? "--"}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Promo Discount</span>
                <span>-₹{selectedBooking.promoDiscount ?? 0}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold" style={{ fontSize: 16 }}>
                <span>Final Fare</span>
                <span>
                  ₹
                  {selectedBooking.fare !== undefined && selectedBooking.promoDiscount !== undefined
                    ? (selectedBooking.fare - selectedBooking.promoDiscount).toFixed(2)
                    : "--"}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Token Paid</span>
                <span>₹{selectedBooking.tokenAmount ?? "--"}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Balance to Pay</span>
                <span>₹{selectedBooking.balanceAmount ?? "--"}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2 mt-2 justify-content-end">
              {selectedBooking.bookingStatus !== "Cancelled" && selectedBooking.bookingStatus !== "Completed" && (
                <button
                  className="btn btn-outline-danger btn-sm"
                  style={{ minWidth: 90, fontWeight: 600 }}
                  onClick={() => {
                    setSelectedBooking(null);
                    handleCancelBooking(selectedBooking);
                  }}
                >
                  <i className="bi bi-x-circle me-1" />
                  Cancel
                </button>
              )}
              <button
                className="btn btn-outline-primary btn-sm"
                style={{ minWidth: 90, fontWeight: 600 }}
                onClick={() => handleDownloadReceipt(selectedBooking)}
              >
                <i className="bi bi-download me-1" />
                Receipt
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                style={{ minWidth: 90, fontWeight: 600 }}
                onClick={() => handleShareReceipt(selectedBooking)}
              >
                <i className="bi bi-share me-1" />
                Share
              </button>
            </div>

            {/* Info Note */}
            <div className="alert alert-info mt-4 mb-0" style={{ fontSize: 15, padding: "10px 14px" }}>
              <i className="bi bi-info-circle me-2"></i>
              Cab and driver details will be shared up to few hours before your pickup time.<br />
              For help, contact our support.
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelConfirm.show && (
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
            <div className="mb-3 fw-bold" style={{ fontSize: 18 }}>
              Cancel Booking?
            </div>
            <div className="mb-4 text-muted">
              Are you sure you want to cancel this booking?
            </div>
            <div className="d-flex gap-2 justify-content-center">
              <button
                className="btn btn-danger"
                disabled={cancelLoading}
                onClick={confirmCancelBooking}
              >
                {cancelLoading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  "Yes, Cancel"
                )}
              </button>
              <button
                className="btn btn-secondary"
                disabled={cancelLoading}
                onClick={() => setCancelConfirm({ show: false, booking: null })}
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden PDF Receipt Container */}
      <div
        id="pdf-receipt-container"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: 800,
          background: "#fff",
          zIndex: -1,
        }}
      >
        {downloadBooking && <BookingReceipt booking={downloadBooking} />}
      </div>
    </div>
  );
};

export default ProfileBookings;