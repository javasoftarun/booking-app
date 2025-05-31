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

// Add this skeleton component
const ProfileSkeleton = () => (
  <div>
    <div className="row align-items-center mb-3 g-3">
      <div className="col-12 col-md-8 d-flex align-items-center gap-3 flex-wrap">
        <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#eee", border: "2px solid #FFD600" }} />
        <div>
          <div style={{ width: 120, height: 22, background: "#eee", borderRadius: 6, marginBottom: 8 }} />
          <div style={{ width: 180, height: 16, background: "#eee", borderRadius: 6, marginBottom: 8 }} />
          <div style={{ width: 70, height: 20, background: "#fffbe7", borderRadius: 12 }} />
        </div>
      </div>
    </div>
    <div className="d-flex gap-2 mb-4 pb-1 justify-content-start flex-wrap">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ width: 120, height: 38, background: "#eee", borderRadius: 10 }} />
      ))}
    </div>
    <div>
      <div style={{ width: "100%", height: 180, background: "#f8f9fa", borderRadius: 16 }} />
    </div>
  </div>
);

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
  const [profileLoading, setProfileLoading] = useState(true); // Change from [, setProfileLoading] to [profileLoading, setProfileLoading]
  const [saving, setSaving] = useState(false);
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
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, []);

  // Fetch bookings after user is loaded
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    setBookingsLoading(true);
    fetch(API_ENDPOINTS.GET_BOOKINGS_BY_USER_ID(userId))
      .then((res) => res.json())
      .then((data) => {
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
  }, [activeTab]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    try {
      setAvatarUploading(true);
      setMessage("");
      setMessageType("");
      let base64Image = await toBase64(file);
      const base64PrefixMatch = base64Image.match(/^data:(image\/\w+);base64,/);
      if (base64PrefixMatch) {
        base64Image = base64Image.replace(/^data:(image\/\w+);base64,/, "");
      }
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
      setAvatarUploading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
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
          setTimeout(() => setMessage(""), 2500); // Auto-hide after 2.5s
        } else {
          setMessage(data.responseMessage);
          setMessageType("error");
        }
      })
      .catch(() => {
        setMessage("Failed to update profile.");
        setMessageType("error");
      })
      .finally(() => setSaving(false));
  };

  const handleDeactivate = () => {
    localStorage.clear();
    window.location.href = "/";
  };

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
    .sort((a, b) => new Date(a.pickupDateTime) - new Date(b.pickupDateTime));

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

  useEffect(() => {
    if (printBooking) {
      const timeout = setTimeout(() => {
        if (printRef.current) {
          handlePrint();
        }
      }, 100);
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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #e3f6ff 60%, #fffbe7 100%)",
        padding: "0",
        marginTop: 32, 
        marginBottom: -50,
      }}
    >
      <div
        className="container-fluid px-1 px-md-3"
        style={{
          maxWidth: 1100,
          paddingTop: 24,
          paddingBottom: 8,
        }}
      >
        <div
          className="bg-white rounded-4 shadow p-2 p-md-4"
          style={{
            border: "1.5px solid #e3e6ed",
            boxShadow: "0 8px 40px #00b8ff22, 0 2px 8px #FFD60033",
            minHeight: 600,
          }}
        >
          {/* Show skeleton while loading */}
          {profileLoading ? (
            <ProfileSkeleton />
          ) : (
            <>
              {/* Header */}
              <div className="row align-items-center mb-3 g-3">
                <div className="col-12 col-md-8 d-flex align-items-center gap-3 flex-wrap">
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
                        width: 70,
                        height: 70,
                        objectFit: "cover",
                        background: "#eee",
                        opacity: avatarUploading ? 0.7 : 1,
                        border: "2px solid #FFD600",
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
                        width: 28,
                        height: 28,
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
                  <div>
                    <div className="fw-bold" style={{ fontSize: 20, color: "#e57368" }}>
                      {profile.name}
                    </div>
                    <div className="text-muted" style={{ fontSize: 14 }}>
                      {profile.email}
                    </div>
                    <div className="badge rounded-pill bg-warning text-dark mt-2" style={{ fontWeight: 600 }}>
                      {profile.role ? profile.role.toUpperCase() : "USER"}
                    </div>
                  </div>
                </div>
              </div>
              {/* Tabs */}
              <div className="d-flex gap-2 mb-4 pb-1 justify-content-start flex-wrap">
                {sidebarItems.map((item) => (
                  <button
                    key={item.key}
                    className={`btn px-3 py-2 fw-semibold d-flex align-items-center gap-2 ${activeTab === item.key ? "shadow" : ""}`}
                    style={{
                      background: activeTab === item.key ? "#FFD600" : "#f8fafc",
                      color: activeTab === item.key ? "#23272f" : "#e57368",
                      border: activeTab === item.key ? "2px solid #FFD600" : "1.5px solid #e3e6ed",
                      borderRadius: 10,
                      fontSize: 15,
                      minWidth: 120,
                      whiteSpace: "nowrap",
                      transition: "all 0.2s",
                      boxShadow: activeTab === item.key ? "0 2px 8px #ffd60040" : "none"
                    }}
                    onClick={() => setActiveTab(item.key)}
                  >
                    <span style={{ fontSize: 17 }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
              {/* Main Content */}
              <div>
                {message && (
                  <div
                    className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} mb-4 d-flex justify-content-between align-items-center`}
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
                  <form onSubmit={handleSave}>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
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
                      <div className="col-12 col-md-6">
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
                      <div className="col-12 col-md-6">
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
                      <div className="col-12 col-md-6">
                        <label className="form-label">Mobile Number</label>
                        <div className="input-group">
                          <span className="input-group-text" style={{ background: "#fffbe7" }}>+91</span>
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
                      <div className="col-12 col-md-6">
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
                          <label className="form-check-label" htmlFor="emailNotification">
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
                          <label className="form-check-label" htmlFor="mobileNotification">
                            Enable Mobile Notifications
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center text-md-end">
                      <button
                        type="submit"
                        className="btn"
                        disabled={saving}
                        style={{
                          background: "#FFD600",
                          color: "#23272f",
                          borderRadius: 14,
                          fontWeight: 700,
                          fontSize: 17,
                          padding: "10px 40px",
                          boxShadow: "0 2px 8px #ffd60040",
                          border: "2px solid #FFD600"
                        }}
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </form>
                )}
                {activeTab === "ratings" && (
                  <>
                    <h4 className="fw-bold mb-4" style={{ color: "#e57368" }}>
                      My Ratings
                    </h4>
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
                    <h4 className="fw-bold mb-4" style={{ color: "#e57368" }}>
                      My Bookings
                    </h4>
                    <div className="mb-4">
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          <button
                            className={`nav-link ${bookingsTab === "upcoming" ? "active" : ""}`}
                            onClick={() => setBookingsTab("upcoming")}
                            type="button"
                          >
                            Upcoming
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            className={`nav-link ${bookingsTab === "past" ? "active" : ""}`}
                            onClick={() => setBookingsTab("past")}
                            type="button"
                          >
                            Past
                          </button>
                        </li>
                        <li className="nav-item">
                          <button
                            className={`nav-link ${bookingsTab === "cancelled" ? "active" : ""}`}
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
                              style={{
                                border: "1.5px solid #e3e6ed",
                                borderRadius: 16,
                                background: "#f8fafc",
                                boxShadow: "0 2px 8px #00b8ff11",
                              }}
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
                                    border: "1px solid #FFD600",
                                    background: "#fff",
                                  }}
                                />
                                <div style={{ flex: 1 }}>
                                  <div className="fw-bold" style={{ color: "#1976d2" }}>
                                    {booking.cabName} ({booking.cabType})
                                  </div>
                                  <div className="small text-muted">
                                    {booking.cabNumber} | {booking.cabModel} | {booking.cabColor}
                                  </div>
                                  <div>
                                    <span className="fw-semibold">Pickup:</span> {booking.pickupLocation}
                                  </div>
                                  <div>
                                    <span className="fw-semibold">Drop:</span> {booking.dropLocation}
                                  </div>
                                  <div>
                                    <span className="fw-semibold">Date:</span> {new Date(booking.pickupDateTime).toLocaleString()}
                                  </div>
                                  <div>
                                    <span className="fw-semibold">Status:</span> {booking.bookingStatus}
                                  </div>
                                  <div>
                                    <span className="fw-semibold">Fare:</span> ₹{booking.fare}
                                  </div>
                                  <div>
                                    <span className="fw-semibold">Driver:</span> {booking.driverName} ({booking.driverContact})
                                  </div>
                                </div>
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
                    <h4 className="fw-bold mb-4 text-danger">
                      Deactivate Account
                    </h4>
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
            </>
          )}
        </div>
      </div>
      {/* Print Receipt Modal (hidden, just for printing) */}
      {printBooking && (
        <div style={{ display: "none" }}>
          <BookingReceipt ref={printRef} booking={printBooking} />
        </div>
      )}
      {/* Responsive tweaks */}
      <style>
        {`
          @media (max-width: 767px) {
            .rounded-4 { border-radius: 1.2rem !important; }
            .shadow { box-shadow: 0 2px 12px #00b8ff22 !important; }
            .p-md-4 { padding: 1.2rem !important; }
            .p-md-5 { padding: 1.2rem !important; }
            .gap-3 { gap: 1rem !important; }
            .gap-2 { gap: 0.5rem !important; }
            .mb-4 { margin-bottom: 1.2rem !important; }
            .mb-3 { margin-bottom: 1rem !important; }
            .fw-bold { font-size: 1.1rem !important; }
          }
        `}
      </style>
    </div>
  );
};

export default UserProfile;