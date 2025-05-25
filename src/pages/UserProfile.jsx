import React, { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaBook,
  FaWallet,
  FaGift,
  FaCamera,
  FaStar,
  FaPowerOff,
  FaEdit,
  FaTrash,
  FaPrint,
} from "react-icons/fa";
import API_ENDPOINTS from "../config/apiConfig";
import BookingReceipt from "../components/BookingReceipt";
import { useReactToPrint } from "react-to-print";
import { USER_DEFAULT_ROLE } from "../constants/appConstants";


const sidebarItems = [
  { key: "profile", label: "Profile", icon: <FaUser /> },
  { key: "bookings", label: "My Bookings", icon: <FaBook /> },
  { key: "wallet", label: "Wallet", icon: <FaWallet /> },
  { key: "refer", label: "Refer", icon: <FaGift /> },
  // Removed Notification tab
  { key: "ratings", label: "My Ratings", icon: <FaStar /> },
  { key: "deactivate", label: "Deactivate Account", icon: <FaPowerOff /> },
];

const initialProfile = {
  id: "",
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "",
  verified: false,
  imageUrl: "",
};

const dummyRatings = [
  { id: 1, date: "2024-05-01", rating: 5, comment: "Great ride!" },
  { id: 2, date: "2024-04-15", rating: 4, comment: "Comfortable and on time." },
];

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(initialProfile);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [bookingsTab, setBookingsTab] = useState("upcoming");
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [printBooking, setPrintBooking] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const printRef = useRef();

  // Fetch user details on mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    fetch(API_ENDPOINTS.GET_USER_BY_ID(userId))
      .then((res) => res.json())
      .then((data) => {
        if (
          data &&
          data.responseMessage === "success" &&
          data.responseData &&
          data.responseData.length > 0
        ) {
          const user = data.responseData[0];
          setProfile((prev) => ({
            ...prev,
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            role: user.role || "",
            gender: user.gender || "",
            dateOfBirth: user.dateOfBirth || "",
            verified: user.verified || false,
            imageUrl: user.imageUrl || "",
            createdAt: user.createdAt || "",
            updatedAt: user.updatedAt || "",
          }));
        }
      })
      .catch(() => {});
  }, []);

  // Fetch bookings after user is loaded
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    setBookingsLoading(true);
    fetch(API_ENDPOINTS.GET_BOOKINGS_BY_USER_ID(userId))
      .then((res) => res.json())
      .then((data) => {
        // The responseData is an array of arrays, so flatten it
        if (
          data &&
          data.responseMessage === "success" &&
          Array.isArray(data.responseData) &&
          Array.isArray(data.responseData[0])
        ) {
          setBookings(data.responseData[0]);
        } else {
          setBookings([]);
        }
      })
      .catch(() => setBookings([]))
      .finally(() => setBookingsLoading(false));
  }, [activeTab]); // Optionally refetch when switching to bookings tab

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert image to base64
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    try {
      setAvatarUploading(true); // Start spinner
      setMessage("");
      setMessageType("");
      let base64Image = await toBase64(file);

      // Remove 'data:image/*;base64,' prefix if present
      const base64PrefixMatch = base64Image.match(/^data:(image\/\w+);base64,/);
      if (base64PrefixMatch) {
        base64Image = base64Image.replace(/^data:(image\/\w+);base64,/, "");
      }

      // 1. Upload base64 image to server with userId and base64Image
      const uploadRes = await fetch(API_ENDPOINTS.UPLOAD_BASE64_IMAGE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile.id,
          base64Image: base64Image,
        }),
      });
      const uploadData = await uploadRes.json();

      if (
        uploadData &&
        uploadData.responseMessage === "success" &&
        uploadData.responseData
      ) {
        // 2. Update user profile with new image URL and all required fields
        const updatedProfile = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          password: profile.password,
          phone: profile.phone,
          role: profile.role,
          verified: profile.verified,
          imageUrl: uploadData.responseData,
          gender: profile.gender || "",
          dateOfBirth: profile.dateOfBirth || "",
          createdAt: profile.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updateRes = await fetch(API_ENDPOINTS.UPDATE_USER, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile),
        });
        const updateData = await updateRes.json();

        if (updateData && updateData.responseMessage === "success") {
          setProfile(updatedProfile);
          localStorage.setItem("userImage", uploadData.responseData);
          localStorage.setItem("userName", profile.name);
          window.dispatchEvent(new Event("userLogin"));
          setMessageType("success");
        } else {
          setMessage(updateData.responseMessage || "Failed to update profile photo.");
          setMessageType("error");
        }
      } else {
        setMessage(uploadData.responseMessage || "Failed to upload image.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Failed to update profile photo.");
      setMessageType("error");
    } finally {
      setAvatarUploading(false); // Stop spinner
    }
  };

  // Update user details on Save
  const handleSave = (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    const updatedProfile = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    fetch(API_ENDPOINTS.UPDATE_USER, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProfile),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.responseMessage === "success") {
          setMessage("Profile updated successfully!");
          setMessageType("success");
        } else {
          setMessage(data.responseMessage);
          setMessageType("error");
        }
      })
      .catch(() => {
        setMessage("Failed to update profile.");
        setMessageType("error");
      });
  };

  const handleDeactivate = () => {
    // Add your deactivate logic here (API call)
    localStorage.clear();
    window.location.href = "/";
  };

  // Helper to filter and sort bookings by tab
  const filteredBookings = bookings
    .filter((b) => {
      if (bookingsTab === "upcoming")
        return (
          b.bookingStatus &&
          ["Pending", "Confirmed", "UPCOMING"].includes(b.bookingStatus)
        );
      if (bookingsTab === "past")
        return (
          b.bookingStatus &&
          ["Completed", "PAST"].includes(b.bookingStatus)
        );
      if (bookingsTab === "cancelled")
        return (
          b.bookingStatus &&
          ["Canceled", "Cancelled", "CANCELLED"].includes(b.bookingStatus)
        );
      return false;
    })
    .sort((a, b) => new Date(a.pickupDateTime) - new Date(b.pickupDateTime)); // Ascending order

  // Action handlers for booking actions
  const handleModifyBooking = (booking) => {
    setMessage("Modify booking feature coming soon!");
    setMessageType("error");
  };

  const handleCancelBooking = async (booking) => {
    setMessage("");
    setMessageType("");
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
        // Optionally, refresh bookings list
        setBookings((prev) =>
          prev.map((b) =>
            b.bookingId === booking.bookingId
              ? { ...b, bookingStatus: "Cancelled" }
              : b
          )
        );
      } else {
        setMessage(data.responseMessage || "Failed to cancel booking.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Failed to cancel booking.");
      setMessageType("error");
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "YatraNow Booking Receipt",
    removeAfterPrint: true,
    onAfterPrint: () => setPrintBooking(null),
  });

  // Only call handlePrint after printBooking is set and printRef is attached
  useEffect(() => {
    if (printBooking) {
      // Wait for the DOM to update and ref to attach
      const timeout = setTimeout(() => {
        if (printRef.current) {
          handlePrint();
        }
      }, 100); // 100ms is usually enough

      return () => clearTimeout(timeout);
    }
  }, [printBooking, handlePrint]);

  const handlePrintBooking = (booking) => {
    setPrintBooking({
      ...booking,
      name: profile.name,
      contact: profile.phone,
      email: profile.email,
      paymentId: booking.paymentDetails?.transactionId || booking.paymentId || "N/A",
      baseFare: booking.fare,
      promoDiscount: booking.promoDiscount || 0,
      finalFare: booking.fare - (booking.promoDiscount || 0),
      tokenAmount: booking.tokenAmount,
      balanceAmount: booking.balanceAmount,
      cabFuel: booking.cabFuel,
      cabCapacity: booking.cabCapacity,
    });
  };

  return (
    <>
      <div style={{ background: "#f6f7fb", minHeight: "100vh", padding: "2rem 0" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div
                className="bg-white rounded-4 shadow-sm py-4 px-3 d-flex flex-column align-items-start"
                style={{ minHeight: 500 }}
              >
                <div className="mb-4 w-100">
                  <div className="d-flex flex-column align-items-center">
                    <div style={{ position: "relative" }}>
                      <img
                        src={
                          avatarUploading
                            ? "https://i.gifer.com/ZZ5H.gif"
                            : profile.imageUrl ||
                              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="avatar"
                        className="rounded-circle border"
                        style={{
                          width: 90,
                          height: 90,
                          objectFit: "cover",
                          background: "#eee",
                          opacity: avatarUploading ? 0.7 : 1,
                          transition: "opacity 0.2s",
                        }}
                      />
                      <label
                        htmlFor="avatar-upload"
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          background: "#e57368",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          border: "2px solid #fff",
                        }}
                      >
                        <FaCamera color="#fff" />
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </div>
                    <div className="mt-3 text-center">
                      <div className="fw-bold" style={{ fontSize: 18 }}>
                        {profile.name}
                      </div>
                      <div className="text-muted small">{profile.email}</div>
                    </div>
                  </div>
                </div>
                <div className="w-100">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.key}
                      className={`d-flex align-items-center w-100 mb-2 btn ${
                        activeTab === item.key
                          ? "btn-danger text-white shadow-sm"
                          : "btn-light text-start"
                      }`}
                      style={{
                        borderRadius: 10,
                        fontWeight: 500,
                        fontSize: 16,
                        gap: 14,
                        transition: "background 0.2s",
                      }}
                      onClick={() => setActiveTab(item.key)}
                    >
                      <span style={{ fontSize: 19 }}>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Main Content */}
            <div className="col-lg-9">
              <div className="bg-white rounded-4 shadow-sm p-5">
                {/* Show message on top */}
                {message && (
                  <div
                    className={`alert ${
                      messageType === "success"
                        ? "alert-success"
                        : "alert-danger"
                    } mb-4 d-flex justify-content-between align-items-center`}
                    role="alert"
                  >
                    <span>{message}</span>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => setMessage("")}
                      style={{ marginLeft: 16 }}
                    ></button>
                  </div>
                )}
                {activeTab === "profile" && (
                  <>
                    <h3 className="fw-bold mb-4" style={{ color: "#e57368" }}>
                      Profile Information
                    </h3>
                    <form onSubmit={handleSave}>
                      <div className="row g-4">
                        <div className="col-md-6">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            required
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Gender</label>
                          <select
                            className="form-select"
                            name="gender"
                            value={profile.gender}
                            onChange={handleChange}
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Mobile Number</label>
                          <div className="input-group">
                            <span className="input-group-text">+91</span>
                            <input
                              type="text"
                              className="form-control"
                              name="phone"
                              value={profile.phone}
                              onChange={handleChange}
                              maxLength={10}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Date of Birth</label>
                          <input
                            type="date"
                            className="form-control"
                            name="dateOfBirth"
                            value={profile.dateOfBirth}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-12">
                          <div className="form-check mt-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="emailNotification"
                              name="emailNotification"
                              checked={profile.emailNotification || false}
                              onChange={(e) =>
                                setProfile((prev) => ({
                                  ...prev,
                                  emailNotification: e.target.checked,
                                }))
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="emailNotification"
                            >
                              Enable Email Notifications
                            </label>
                          </div>
                          <div className="form-check mt-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="mobileNotification"
                              name="mobileNotification"
                              checked={profile.mobileNotification || false}
                              onChange={(e) =>
                                setProfile((prev) => ({
                                  ...prev,
                                  mobileNotification: e.target.checked,
                                }))
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="mobileNotification"
                            >
                              Enable Mobile Notifications
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5">
                        <button
                          type="submit"
                          className="btn"
                          style={{
                            background: "#e57368",
                            color: "#fff",
                            borderRadius: 14,
                            fontWeight: 600,
                            fontSize: 18,
                            padding: "10px 48px",
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </>
                )}
                {activeTab === "ratings" && (
                  <>
                    <h3 className="fw-bold mb-4" style={{ color: "#e57368" }}>
                      My Ratings
                    </h3>
                    {dummyRatings.length === 0 ? (
                      <div className="text-muted">No ratings yet.</div>
                    ) : (
                      <div>
                        {dummyRatings.map((rating) => (
                          <div
                            key={rating.id}
                            className="mb-3 p-3 border rounded-3 d-flex align-items-center"
                            style={{ background: "#f8f9fa" }}
                          >
                            <span
                              className="me-3"
                              style={{ color: "#FFD600", fontSize: 22 }}
                            >
                              {Array.from({ length: rating.rating }).map((_, i) => (
                                <FaStar key={i} />
                              ))}
                            </span>
                            <div>
                              <div className="fw-semibold">{rating.comment}</div>
                              <div className="text-muted small">{rating.date}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
                {activeTab === "bookings" && (
                  <>
                    <h3 className="fw-bold mb-4" style={{ color: "#e57368" }}>
                      My Bookings
                    </h3>
                    <div className="mb-4">
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          <button
                            className={`nav-link ${
                              bookingsTab === "upcoming" ? "active" : ""
                            }`}
                            onClick={() => setBookingsTab("upcoming")}
                            type="button"
                          >
                            Upcoming
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            className={`nav-link ${
                              bookingsTab === "past" ? "active" : ""
                            }`}
                            onClick={() => setBookingsTab("past")}
                            type="button"
                          >
                            Past
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            className={`nav-link ${
                              bookingsTab === "cancelled" ? "active" : ""
                            }`}
                            onClick={() => setBookingsTab("cancelled")}
                            type="button"
                          >
                            Cancelled
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div>
                      {bookingsLoading ? (
                        <div>Loading bookings...</div>
                      ) : filteredBookings.length === 0 ? (
                        <div>No {bookingsTab} bookings.</div>
                      ) : (
                        <div className="list-group">
                          {filteredBookings.map((booking) => (
                            <div
                              key={booking.bookingId}
                              className="list-group-item mb-3"
                            >
                              <div className="d-flex align-items-center">
                                <img
                                  src={booking.cabImageUrl}
                                  alt={booking.cabName}
                                  style={{
                                    width: 80,
                                    height: 50,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    marginRight: 16,
                                  }}
                                />
                                <div style={{ flex: 1 }}>
                                  <div className="fw-bold">
                                    {booking.cabName} ({booking.cabType})
                                  </div>
                                  <div className="small text-muted">
                                    {booking.cabNumber} | {booking.cabModel} |{" "}
                                    {booking.cabColor}
                                  </div>
                                  <div>
                                    <span className="fw-semibold">Pickup:</span>{" "}
                                    {booking.pickupLocation}
                                  </div>
                                  <div>
                                    <span className="fw-semibold">Drop:</span>{" "}
                                    {booking.dropLocation}
                                  </div>
                                  <div>
                                    <span className="fw-semibold">Date:</span>{" "}
                                    {new Date(
                                      booking.pickupDateTime
                                    ).toLocaleString()}
                                  </div>
                                  <div>
                                    <span className="fw-semibold">Status:</span>{" "}
                                    {booking.bookingStatus}
                                  </div>
                                  <div>
                                    <span className="fw-semibold">Fare:</span> ₹
                                    {booking.fare}
                                  </div>
                                  <div>
                                    <span className="fw-semibold">Driver:</span>{" "}
                                    {booking.driverName} ({booking.driverContact})
                                  </div>
                                </div>
                                {/* Action buttons */}
                                <div className="ms-3 d-flex flex-column gap-2">
                                  <button
                                    className="btn btn-light btn-sm d-flex align-items-center gap-2 border"
                                    title="Modify Booking"
                                    onClick={() => handleModifyBooking(booking)}
                                    style={{ borderRadius: 8 }}
                                  >
                                    <FaEdit style={{ color: "#e57368" }} /> Modify
                                  </button>
                                  <button
                                    className="btn btn-light btn-sm d-flex align-items-center gap-2 border"
                                    title="Cancel Booking"
                                    onClick={() => handleCancelBooking(booking)}
                                    style={{ borderRadius: 8 }}
                                  >
                                    <FaTrash style={{ color: "#dc3545" }} /> Cancel
                                  </button>
                                  <button
                                    className="btn btn-light btn-sm d-flex align-items-center gap-2 border"
                                    title="Print Booking"
                                    onClick={() => handlePrintBooking(booking)}
                                    style={{ borderRadius: 8 }}
                                  >
                                    <FaPrint style={{ color: "#6c757d" }} /> Print
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
                {activeTab === "deactivate" && (
                  <>
                    <h3 className="fw-bold mb-4 text-danger">
                      Deactivate Account
                    </h3>
                    <div className="alert alert-warning">
                      <strong>Warning:</strong> This action will permanently
                      remove your account and all your bookings. This cannot be
                      undone.
                    </div>
                    <button
                      className="btn btn-danger"
                      onClick={() => setShowDeactivate(true)}
                    >
                      Deactivate My Account
                    </button>
                    {/* Confirmation Modal */}
                    {showDeactivate && (
                      <div
                        className="modal fade show"
                        style={{ display: "block" }}
                        tabIndex={-1}
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title text-danger">
                                Confirm Deactivation
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowDeactivate(false)}
                              ></button>
                            </div>
                            <div className="modal-body">
                              Are you sure you want to deactivate your account?
                              This action cannot be undone.
                            </div>
                            <div className="modal-footer">
                              <button
                                className="btn btn-secondary"
                                onClick={() => setShowDeactivate(false)}
                              >
                                Cancel
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={handleDeactivate}
                              >
                                Yes, Deactivate
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {/* Placeholder for other tabs */}
                {activeTab !== "profile" &&
                  activeTab !== "ratings" &&
                  activeTab !== "deactivate" &&
                  activeTab !== "bookings" && (
                    <div
                      className="text-center py-5 text-muted"
                      style={{ fontSize: 22 }}
                    >
                      {
                        sidebarItems.find((i) => i.key === activeTab)?.label
                      }{" "}
                      section coming soon!
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
        {/* Modal backdrop for deactivate */}
        {showDeactivate && <div className="modal-backdrop fade show"></div>}
      </div>
      {/* Print Receipt Modal (hidden, just for printing) */}
      {printBooking && (
        <div style={{ display: "none" }}>
          <BookingReceipt ref={printRef} booking={printBooking} />
        </div>
      )}
    </>
  );
};

export default UserProfile;