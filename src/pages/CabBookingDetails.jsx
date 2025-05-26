import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../config/apiConfig";
import { COUPONS, USER_DEFAULT_IMAGE, USER_DEFAULT_ROLE, DEFAULT_BOOKING_STATUS } from "../constants/appConstants";

// Helper to add minutes to a datetime string
function addMinutesToDatetime(datetimeStr, minutes) {
  const date = new Date(datetimeStr);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

function formatLocalDateTime(dt) {
  const d = new Date(dt);
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0") +
    "T" +
    String(d.getHours()).padStart(2, "0") +
    ":" +
    String(d.getMinutes()).padStart(2, "0") +
    ":" +
    String(d.getSeconds()).padStart(2, "0")
  );
}

const CabBookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cab, pickup, drop, datetime } = location.state || {};

  const [payFull, setPayFull] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [showBookingError, setShowBookingError] = useState(false);

  // New: State for user details
  const [userDetails, setUserDetails] = useState({
    name: "",
    gender: "",
    email: "",
    contact: ""
  });

  // On mount, if userId in localStorage, fetch user details and prefill form
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(API_ENDPOINTS.GET_USER_BY_ID(userId))
        .then(res => res.json())
        .then(data => {
          if (
            data &&
            data.responseMessage === "success" &&
            data.responseData &&
            data.responseData.length > 0
          ) {
            const user = data.responseData[0];
            setUserDetails({
              name: user.name || "",
              gender: user.gender || "",
              email: user.email || "",
              contact: user.phone || ""
            });
          }
        });
    }
  }, []);

  if (!cab) {
    return (
      <div className="container py-5 text-center">
        <h3>No cab details found.</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  // Calculate dropDateTime by adding travelTime (in minutes) to pickup datetime
  // Make sure cab.travelTime is available and is a number (in minutes)
  const dropDateTime = cab.travelTime
    ? addMinutesToDatetime(datetime, Number(cab.travelTime))
    : datetime;

  // Coupon logic
  const eligibleCoupons = COUPONS.filter(coupon => cab.fare >= (coupon.minFare || 0));
  let couponDiscount = 0;
  if (selectedCoupon) {
    if (selectedCoupon.discount) {
      couponDiscount = selectedCoupon.discount;
    } else if (selectedCoupon.discountPercent) {
      couponDiscount = Math.floor((cab.fare * selectedCoupon.discountPercent) / 100);
      if (selectedCoupon.maxDiscount) {
        couponDiscount = Math.min(couponDiscount, selectedCoupon.maxDiscount);
      }
    }
  }
  const finalFare = Math.max(0, cab.fare - couponDiscount);
  const finalToken = Math.ceil(finalFare * 0.1);

  // Coupon handlers
  const handleApplyCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setCouponError("");
  };
  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    setCouponError("");
  };

  // Replace handlePay with Razorpay integration
  const handlePay = () => {
    // Use state if available, else fallback to form values
    const name = userDetails.name || document.getElementById("name")?.value.trim();
    const gender = userDetails.gender || document.querySelector('input[name="gender"]:checked')?.value;
    const email = userDetails.email || document.getElementById("email")?.value.trim();
    const contact = userDetails.contact || document.getElementById("contact")?.value.trim();

    if (!name) {
      alert("Please enter your name.");
      return;
    }
    if (!gender) {
      alert("Please select your gender.");
      return;
    }
    if (!contact || !/^\d{10}$/.test(contact)) {
      alert("Please enter a valid 10-digit contact number.");
      return;
    }

    // Amount in paise
    const amount = (payFull ? finalFare : finalToken) * 100;

    const options = {
      key: "rzp_test_ZXILcDrwDtBqkg",
      amount: amount,
      currency: "INR",
      name: "YatraNow Cab Booking",
      description: "Cab Booking Payment",
      handler: async function (response) {
        // Get userId from localStorage if available, else from registration response
        let userId = localStorage.getItem("userId");
        if (!userId) {
          try {
            const userRes = await fetch(API_ENDPOINTS.ADD_USER, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: 0,
                name: name,
                email: email || "",
                password: "",
                phone: contact,
                role: USER_DEFAULT_ROLE,
                verified: true,
                imageUrl: USER_DEFAULT_IMAGE,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }),
            });
            const userData = await userRes.json();
            userId =
              (userData.responseData &&
                Array.isArray(userData.responseData) &&
                userData.responseData[0]?.id) ||
              0;
            // Optionally store userId in localStorage for future use
            if (userId) {
              localStorage.setItem("userId", userId);
            }
          } catch (err) {
            console.error("User registration failed", err);
          }
        }

        // Insert booking details
        try {
          const bookingRes = await fetch(API_ENDPOINTS.ADD_BOOKING, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bookingId: 0,
              userId: Number(userId),
              cabRegistrationId: Number(cab.cabRegistrationId),
              pickupLocation: pickup,
              dropLocation: drop,
              pickupDateTime: formattedPickupDateTime,
              dropDateTime: formattedDropDateTime,
              fare: finalFare + couponDiscount,
              promoDiscount: selectedCoupon ? couponDiscount : 0,
              tokenAmount: payFull ? finalFare : finalToken,
              balanceAmount: payFull ? 0 : finalFare - finalToken - couponDiscount,
              bookingStatus: DEFAULT_BOOKING_STATUS,
              bookingStatusUpdatedBy: USER_DEFAULT_ROLE,
              paymentStatus: payFull ? "FULL" : "PARTIAL",
              paymentDetails: {
                paymentMethod: "RAZORPAY",
                transactionId: response.razorpay_payment_id,
                transactionDate: formatLocalDateTime(new Date()),
                amount: payFull ? finalFare : finalToken,
                status: "SUCCESS"
              },
            }),
          });
          const bookingData = await bookingRes.json();
          if (bookingData && bookingData.responseMessage === "success") {
            // Navigate to confirmation page only on success
            navigate("/confirmation", {
              state: {
                ...location.state,
                cab,
                tokenAmount: payFull ? finalFare : finalToken,
                payFull,
                coupon: selectedCoupon,
                couponDiscount,
                finalFare,
                user: { name, gender, email, contact },
                razorpay_payment_id: response.razorpay_payment_id,
              },
            });
          } else {
            setShowBookingError(true); // Show popup on failure
          }
        } catch (err) {
          console.error("Booking insertion failed", err);
          setShowBookingError(true); // Show popup on error
        }
      },
      prefill: {
        name: name,
        email: email,
        contact: "+91" + contact,
      },
      theme: {
        color: "#e57368",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const formattedPickupDateTime = formatLocalDateTime(datetime);
  const formattedDropDateTime = formatLocalDateTime(dropDateTime);

  return (
    <div className="cablist-bg" style={{ minHeight: "100vh", background: "linear-gradient(120deg, #e3f6ff 60%, #fffbe7 100%)" }}>
      <div className="cablist-main-container" style={{ maxWidth: 1200, margin: "0 auto", borderRadius: 28, boxShadow: "0 8px 40px #00b8ff22, 0 2px 8px #FFD60033", padding: "40px 28px" }}>
        {/* Header */}
        <div className="mb-4">
          <h2 className="fw-bold" style={{ color: "#23272f" }}>Review Booking</h2>
          <div className="d-flex flex-wrap align-items-center gap-2" style={{ fontSize: 16, color: "#6b7280" }}>
            <span className="badge rounded-pill bg-primary-subtle text-primary px-3 py-2" style={{ fontSize: 15 }}>
              <i className="bi bi-geo-alt-fill me-1"></i> {pickup}
            </span>
            <i className="bi bi-arrow-right mx-2" />
            <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2" style={{ fontSize: 15 }}>
              <i className="bi bi-geo-alt-fill me-1"></i> {drop}
            </span>
            <span className="badge rounded-pill bg-info-subtle text-info px-3 py-2 ms-2" style={{ fontSize: 15 }}>
              <i className="bi bi-calendar-event me-1"></i> {datetime}
            </span>
          </div>
        </div>
        <div className="row g-4">
          {/* Left: Cab & Trip Details */}
          <div className="col-12 col-lg-8">
            {/* Cab Card */}
            <div className="bg-white rounded-4 shadow-sm p-4 mb-4" style={{ border: "1px solid #e3e6ed" }}>
              <div className="d-flex align-items-center gap-4 mb-3">
                <img
                  src={cab.cabImageUrl}
                  alt={cab.cabName}
                  style={{
                    width: 90,
                    height: 60,
                    objectFit: "contain",
                    borderRadius: 10,
                    background: "#f8fafc",
                    border: "1px solid #eee",
                  }}
                />
                <div>
                  <div className="fw-bold" style={{ fontSize: 20, color: "#23272f" }}>{cab.cabName}</div>
                  <div className="text-secondary" style={{ fontSize: 15 }}>
                    {cab.cabType} • AC • {cab.cabCapacity} Seats
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3 mb-2">
                <span className="badge bg-danger text-white fw-semibold" style={{ fontSize: 15 }}>
                  4.0/5
                </span>
                <span className="text-muted" style={{ fontSize: 14 }}>(3k ratings)</span>
                <span className="ms-3 text-success" style={{ fontSize: 14 }}>
                  <i className="bi bi-check-circle-fill me-1" />
                  Free Cancellation until pickup time
                </span>
              </div>
              <div className="mb-2" style={{ color: "#FFD600", fontWeight: 600, fontSize: 16 }}>
                Value + Fare
              </div>
              <div className="mb-2" style={{ color: "#6b7280", fontSize: 15 }}>
                Value for money
              </div>
              <div className="mb-2" style={{ fontSize: 15 }}>
                <i className="bi bi-currency-rupee me-1" />
                <b>Extra km fare:</b> INR {cab.perKmRate} per kilometer
              </div>
              <div className="mb-2" style={{ fontSize: 15 }}>
                <i className="bi bi-fuel-pump me-1" />
                <b>Fuel Type:</b> {cab.cabFuelType || "Petrol, CNG"}
              </div>
              <div className="mb-2" style={{ fontSize: 15 }}>
                <i className="bi bi-x-circle me-1" />
                <b>Cancellation:</b> Free cancellation until pickup time
              </div>
            </div>
            {/* Driver & Cab Details */}
            <div className="bg-white rounded-4 shadow-sm p-4 mb-4" style={{ border: "1px solid #e3e6ed" }}>
              <div className="fw-bold mb-2" style={{ color: "#1976d2", fontSize: 18 }}>Driver & Cab details</div>
              <div style={{ color: "#23272f", fontSize: 15 }}>
                Cab operator will be assigned on booking completion. Cab and driver details will be shared up to 30 mins prior to departure.
              </div>
            </div>
            {/* Confirm Booking Form */}
            <div className="bg-white rounded-4 shadow-sm p-4 mb-4" style={{ border: "1px solid #e3e6ed" }}>
              <div className="fw-bold mb-3" style={{ color: "#1976d2", fontSize: 18 }}>Trip Details</div>
              <form>
                <div className="row g-3 align-items-end">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="name">Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      required
                      value={userDetails.name}
                      onChange={e => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!!userDetails.name}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label d-block">Gender <span className="text-danger">*</span></label>
                    <div>
                      {["Male", "Female", "Other"].map(option => (
                        <div className="form-check form-check-inline" key={option}>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            id={option.toLowerCase()}
                            value={option}
                            checked={userDetails.gender === option}
                            onChange={e => setUserDetails(prev => ({ ...prev, gender: e.target.value }))}
                            disabled={!!userDetails.gender}
                            required
                          />
                          <label className="form-check-label" htmlFor={option.toLowerCase()}>{option}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="email">Email Id</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={userDetails.email}
                      onChange={e => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!!userDetails.email}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="contact">Contact Number <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ background: "#fffbe7" }}>+91</span>
                      <input
                        type="tel"
                        className="form-control"
                        id="contact"
                        required
                        maxLength={10}
                        pattern="[0-9]{10}"
                        value={userDetails.contact}
                        onChange={e => setUserDetails(prev => ({ ...prev, contact: e.target.value }))}
                        disabled={!!userDetails.contact}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-text mt-3">
                  By proceeding to book, I agree to Bookairportcab's
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>, and
                  <a href="/terms-of-service" target="_blank" rel="noopener noreferrer"> Terms of Service</a>.
                </div>
              </form>
            </div>
          </div>
          {/* Right: Payment Summary */}
          <div className="col-12 col-lg-4">
            {/* Coupon Section */}
            <div className="mb-3">
              <div className="bg-white shadow-sm rounded-4 p-3 mb-3" style={{ border: "1px solid #e3e6ed" }}>
                <div className="fw-bold mb-2" style={{ color: "#FFD600", fontSize: 17 }}>Available Coupons</div>
                {eligibleCoupons.length === 0 && (
                  <div className="text-secondary">No coupons available for this fare.</div>
                )}
                {eligibleCoupons.map(coupon => (
                  <div
                    key={coupon.code}
                    className={`d-flex align-items-center justify-content-between mb-2 p-2 rounded ${selectedCoupon && selectedCoupon.code === coupon.code ? "bg-light border border-primary" : ""}`}
                  >
                    <div>
                      <span className="fw-semibold" style={{ color: "#1976d2" }}>{coupon.code}</span>
                      <span className="ms-2 text-secondary">{coupon.desc}</span>
                    </div>
                    {selectedCoupon && selectedCoupon.code === coupon.code ? (
                      <button className="btn btn-sm btn-outline-danger ms-2" onClick={handleRemoveCoupon}>Remove</button>
                    ) : (
                      <button className="btn btn-sm btn-outline-success ms-2" onClick={() => handleApplyCoupon(coupon)}>Apply</button>
                    )}
                  </div>
                ))}
                {/* Show promo discount 0 if not applied */}
                {!selectedCoupon && (
                  <div className="text-secondary mt-2">
                    Promo Discount: ₹0
                  </div>
                )}
                {selectedCoupon && (
                  <div className="text-success mt-2">
                    Coupon <b>{selectedCoupon.code}</b> applied! You save ₹{couponDiscount}.
                  </div>
                )}
                {couponError && (
                  <div className="text-danger mt-2">{couponError}</div>
                )}
              </div>
              <div className="bg-info text-white text-center fw-semibold rounded-top-4 py-2" style={{ fontSize: 15 }}>
                <i className="bi bi-check-circle-fill me-1" />
                Free Cancellation until pickup time <i className="bi bi-info-circle ms-1" />
              </div>
              <div className="bg-white shadow-sm rounded-bottom-4 p-4" style={{ border: "1px solid #e3e6ed" }}>
                {/* Fare Breakdown */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: 16 }}>
                    <span>Base Fare</span>
                    <span>₹{cab.fare}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: 16, color: selectedCoupon ? "#43a047" : "#888" }}>
                    <span>Coupon Discount {selectedCoupon ? `(${selectedCoupon.code})` : ""}</span>
                    <span>-₹{selectedCoupon ? couponDiscount : 0}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1 fw-bold" style={{ fontSize: 17 }}>
                    <span>Final Fare</span>
                    <span>₹{finalFare}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: 16 }}>
                    <span>Token Amount (10%)</span>
                    <span>₹{finalToken}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1" style={{ fontSize: 16, color: "#1976d2" }}>
                    <span>To Pay Driver During Trip</span>
                    <span>₹{finalFare - finalToken}</span>
                  </div>
                  <div className="alert alert-info py-2 px-3 mt-2" style={{ fontSize: 14, background: "#e3f6ff", color: "#1976d2", border: "1px solid #b6e3fa" }}>
                    <i className="bi bi-info-circle me-1"></i>
                    <b>Note:</b> Token amount is just 10% of the total fare. The remaining amount (shown above) is payable directly to the driver at the time of pickup or drop.
                  </div>
                </div>
                {/* Pay Button and Payment Options */}
                <button
                  className="btn fw-bold w-100 mb-3"
                  style={{
                    background: "#FFD600",
                    color: "#23272f",
                    fontSize: 20,
                    borderRadius: 8,
                    boxShadow: "0 2px 8px #ffd60040",
                    border: "2px solid #FFD600"
                  }}
                  onClick={handlePay}
                >
                  PAY ₹{payFull ? finalFare : finalToken}
                </button>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentOption"
                      id="payToken"
                      checked={!payFull}
                      onChange={() => setPayFull(false)}
                    />
                    <label className="form-check-label d-flex justify-content-between w-100" htmlFor="payToken" style={{ fontSize: 16 }}>
                      <span>Make part payment now</span>
                      <span style={{ color: "#e57368", fontWeight: 600 }}>₹{finalToken}</span>
                    </label>
                    <div className="text-secondary ms-4" style={{ fontSize: 13 }}>
                      Pay the rest to the driver
                    </div>
                  </div>
                  <div className="form-check mt-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentOption"
                      id="payFull"
                      checked={payFull}
                      onChange={() => setPayFull(true)}
                    />
                    <label className="form-check-label d-flex justify-content-between w-100" htmlFor="payFull" style={{ fontSize: 16 }}>
                      <span>Total Amount</span>
                      <span style={{ color: "#e57368", fontWeight: 600 }}>₹{finalFare}</span>
                    </label>
                  </div>
                </div>
                <div className="border-top pt-3">
                  <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontSize: 16 }}>
                    <span>Make full payment now</span>
                    <span className="fw-bold" style={{ fontSize: 22, color: "#23272f" }}>₹{finalFare}</span>
                  </div>
                  <div className="text-secondary" style={{ fontSize: 13 }}>
                    (inclusive of GST)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showBookingError && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            background: "rgba(0,0,0,0.4)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1050,
          }}
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">Booking Failed</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowBookingError(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Booking failed. Please try again.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowBookingError(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CabBookingDetails;