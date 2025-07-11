import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBook,
  FaWallet,
  FaGift,
  FaCamera,
  FaStar,
  FaPowerOff,
  FaTrash,
  FaPrint,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import API_ENDPOINTS from "../config/apiConfig";
import BookingReceipt from "../components/BookingReceipt";
import { useReactToPrint } from "react-to-print";
import { USER_DEFAULT_ROLE } from "../constants/appConstants";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  gender: "",
  dateOfBirth: "",
  createdAt: "",
  updatedAt: "",
};

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
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState({ show: false, booking: null });
  const [cancelLoading, setCancelLoading] = useState(false);
  const [downloadBooking, setDownloadBooking] = useState(null);
  const [ratingBookings, setRatingBookings] = useState([]);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingComment, setRatingComment] = useState({});
  const [ratingValue, setRatingValue] = useState({});
  const [submittingRating, setSubmittingRating] = useState({});
  const [givenRatings, setGivenRatings] = useState([]);
  const [givenRatingsLoading, setGivenRatingsLoading] = useState(false);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const printRef = useRef();
  const navigate = useNavigate();
  // Load user from localStorage on mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setProfileLoading(false);
      navigate("/", { replace: true });
    }
    try {
      const user = JSON.parse(userStr);
      setProfile({
        id: user.id || "",
        name: user.name || "",
        email: user.email || "",
        password: user.password || "",
        phone: user.phone || "",
        role: user.role || "",
        verified: user.verified || false,
        imageUrl: user.imageUrl || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        createdAt: user.createdAt || "",
        updatedAt: user.updatedAt || "",
        emailNotification: user.emailNotification || false,
        mobileNotification: user.mobileNotification || false,
      });
    } catch {
      setProfile(initialProfile);
    }
    setProfileLoading(false);
  }, [navigate]);

  // Fetch bookings after user is loaded
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    setBookingsLoading(true);
    fetch(API_ENDPOINTS.GET_BOOKINGS_BY_USER_ID(userId))
      .then((res) => res.json())
      .then((data) => {
        let bookingsArr = [];
        if (
          data &&
          data.responseMessage === "success" &&
          Array.isArray(data.responseData) &&
          Array.isArray(data.responseData[0])
        ) {
          bookingsArr = data.responseData[0];
        }
        // Fill missing user details from localStorage if not present in booking
        const userStr = localStorage.getItem("user");
        let userObj = {};
        try {
          userObj = userStr ? JSON.parse(userStr) : {};
        } catch {}
        const filledBookings = bookingsArr.map((b) => ({
          ...b,
          name: b.name || userObj.name || "",
          contact: b.contact || userObj.phone || "",
          email: b.email || userObj.email || "",
        }));
        setBookings(filledBookings);
      })
      .catch(() => setBookings([]))
      .finally(() => setBookingsLoading(false));
  }, [activeTab]);

  // Fetch cabs for rating when ratings tab is active
  useEffect(() => {
    if (activeTab !== "ratings") return;
    setRatingLoading(true);
    const userId = localStorage.getItem("userId");
    fetch(API_ENDPOINTS.GET_BOOKINGS_BY_USER_ID(userId))
      .then((res) => res.json())
      .then((data) => {
        let bookingsArr = [];
        if (
          data &&
          data.responseMessage === "success" &&
          Array.isArray(data.responseData) &&
          Array.isArray(data.responseData[0])
        ) {
          bookingsArr = data.responseData[0];
        }
        // Only show bookings with status "Completed" and not yet rated
        const completedBookings = bookingsArr.filter(
          (b) =>
            b.bookingStatus &&
            ["Completed", "PAST"].includes(b.bookingStatus) &&
            !b.userHasRated // Make sure your API provides this flag or filter by your own logic
        );
        setRatingBookings(completedBookings);
      })
      .catch(() => setRatingBookings([]))
      .finally(() => setRatingLoading(false));
  }, [activeTab]);

  // Fetch user's given ratings when ratings tab is active
  useEffect(() => {
    if (activeTab !== "ratings") return;
    setGivenRatingsLoading(true);
    fetch(API_ENDPOINTS.GET_RATINGS_BY_USER_ID(profile.id))
      .then((res) => res.json())
      .then(async (data) => {
        if (
          data &&
          data.responseMessage === "success" &&
          Array.isArray(data.responseData)
        ) {
          // Fetch cab details for each rating
          const ratingsWithCab = await Promise.all(
            data.responseData.map(async (rating) => {
              const cab = await fetchCabDetails(rating.cabRegistrationId);
              return {
                ...rating,
                cabName: cab.cabName || "",
                cabType: cab.cabType || "",
                cabNumber: cab.cabNumber || "",
                cabImageUrl: cab.cabImageUrl || "",
              };
            })
          );
          setGivenRatings(ratingsWithCab);
        } else {
          setGivenRatings([]);
        }
      })
      .catch(() => setGivenRatings([]))
      .finally(() => setGivenRatingsLoading(false));
  }, [activeTab, profile.id]);

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
          ...profile,
          imageUrl: uploadData.responseData,
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
          localStorage.setItem("user", JSON.stringify(updatedProfile));
          localStorage.setItem("userImage", uploadData.responseData);
          localStorage.setItem("userName", updatedProfile.name);
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
          setProfile(updatedProfile);
          localStorage.setItem("user", JSON.stringify(updatedProfile));
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

  const handleCancelBooking = (booking) => {
    setCancelConfirm({ show: true, booking });
  };

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
      } else {
        setMessage(data.responseMessage || "Failed to cancel booking.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Failed to cancel booking.");
      setMessageType("error");
    } finally {
      setCancelLoading(false); // <-- hide loading
      setCancelConfirm({ show: false, booking: null });
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Bhada24 Booking Receipt",
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

  // Handle rating submit
  const handleSubmitRating = useCallback(
    async (bookingId) => {
      setSubmittingRating((prev) => ({ ...prev, [bookingId]: true }));
      setMessage("");
      setMessageType("");
      try {
        // Find the booking to get cabRegistrationId
        const booking = ratingBookings.find((b) => b.bookingId === bookingId);
        if (!booking) {
          setMessage("Booking not found.");
          setMessageType("error");
          setSubmittingRating((prev) => ({ ...prev, [bookingId]: false }));
          return;
        }
        const reqBody = {
          id: 0,
          cabRegistrationId: booking.cabRegistrationId,
          userId: profile.id,
          rating: ratingValue[bookingId],
          comment: ratingComment[bookingId] || "",
        };
        const res = await fetch(API_ENDPOINTS.ADD_RATING, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reqBody),
        });
        const data = await res.json();
        if (data && data.responseMessage === "success") {
          setMessage("Thank you for your feedback! Your rating has been submitted.");
          setMessageType("success");
          setRatingBookings((prev) =>
            prev.filter((b) => b.bookingId !== bookingId)
          );
        } else {
          setMessage(data.responseMessage || "Failed to submit rating.");
          setMessageType("error");
        }
      } catch {
        setMessage("Failed to submit rating.");
        setMessageType("error");
      } finally {
        setSubmittingRating((prev) => ({ ...prev, [bookingId]: false }));
      }
    },
    [ratingValue, ratingComment, profile.id, ratingBookings]
  );

  // Add this helper function at the top (after imports)
  const fetchCabDetails = async (cabRegistrationId) => {
    try {
      const res = await fetch(API_ENDPOINTS.GET_CAB_BY_ID(cabRegistrationId));
      const data = await res.json();
      if (
        data &&
        data.responseMessage === "success" &&
        Array.isArray(data.responseData) &&
        data.responseData.length > 0 &&
        data.responseData[0].cab
      ) {
        const cab = data.responseData[0].cab;
        return {
          cabName: cab.cabName || "",
          cabType: cab.cabType || "",
          cabNumber: cab.cabNumber || "",
          cabImageUrl: cab.cabImageUrl || "",
          cabModel: cab.cabModel || "",
          cabColor: cab.cabColor || "",
        };
      }
    } catch {}
    return {};
  };

  return (
    <div
      style={{
        height: "auto",
        background: "#fff",
        padding: "0",
        marginTop: 0,
        marginBottom: 0,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div
        className="cablist-main-container"
        style={{
          maxWidth: 1200,
          width: "100%",
          margin: "40px auto",
          borderRadius: 28,
          boxShadow: "0 8px 40px #e5736822, 0 2px 8px #FFD60033",
          padding: "40px 20px",
          background: "#fff",
          height: "auto",
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
                  {ratingLoading ? (
                    <div>Loading cabs for rating...</div>
                  ) : ratingBookings.length === 0 ? (
                    <div className="text-muted">No cabs to rate.</div>
                  ) : (
                    <div>
                      {ratingBookings.map((booking) => (
                        <div
                          key={booking.bookingId}
                          className="mb-3 p-3 border rounded-3"
                          style={{ background: "#f8f9fa" }}
                        >
                          <div className="d-flex align-items-center gap-3 mb-2">
                            <img
                              src={booking.cabImageUrl}
                              alt={booking.cabName}
                              style={{
                                width: 60,
                                height: 40,
                                objectFit: "cover",
                                borderRadius: 6,
                                border: "1px solid #FFD600",
                                background: "#fff",
                              }}
                            />
                            <div>
                              <div className="fw-bold">{booking.cabName} ({booking.cabType})</div>
                              <div className="small text-muted">{booking.cabNumber}</div>
                              <div className="small text-muted">
                                Date: {new Date(booking.pickupDateTime).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="mb-2">
                            <label className="form-label mb-1">Your Rating:</label>
                            <div>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  style={{
                                    cursor: "pointer",
                                    color:
                                      (ratingValue[booking.bookingId] || 0) >= star
                                        ? "#FFD600"
                                        : "#ccc",
                                    fontSize: 22,
                                  }}
                                  onClick={() =>
                                    setRatingValue((prev) => ({
                                      ...prev,
                                      [booking.bookingId]: star,
                                    }))
                                  }
                                >
                                  <FaStar />
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="mb-2">
                            <label className="form-label mb-1">Your Comment:</label>
                            <textarea
                              className="form-control"
                              rows={2}
                              value={ratingComment[booking.bookingId] || ""}
                              onChange={(e) =>
                                setRatingComment((prev) => ({
                                  ...prev,
                                  [booking.bookingId]: e.target.value,
                                }))
                              }
                              placeholder="Write your feedback..."
                            />
                          </div>
                          <button
                            className="btn btn-warning"
                            style={{ color: "#23272f", fontWeight: 600 }}
                            disabled={
                              submittingRating[booking.bookingId] ||
                              !ratingValue[booking.bookingId]
                            }
                            onClick={() => handleSubmitRating(booking.bookingId)}
                          >
                            {submittingRating[booking.bookingId] ? "Submitting..." : "Submit Rating"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <h5 className="fw-bold mt-5 mb-3" style={{ color: "#1976d2" }}>
                    Ratings Given
                  </h5>
                  {givenRatingsLoading ? (
                    <div>Loading your ratings...</div>
                  ) : givenRatings.length === 0 ? (
                    <div className="text-muted">No ratings given yet.</div>
                  ) : (
                    <div>
                      {givenRatings.map((rating) => (
                        <div
                          key={rating.id}
                          className="mb-3 p-3 border rounded-3 d-flex align-items-center"
                          style={{ background: "#f8f9fa" }}
                        >
                          <img
                            src={rating.cabImageUrl}
                            alt={rating.cabName}
                            style={{
                              width: 60,
                              height: 40,
                              objectFit: "cover",
                              borderRadius: 6,
                              border: "1px solid #FFD600",
                              background: "#fff",
                              marginRight: 16,
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div className="fw-bold">
                              {rating.cabName} ({rating.cabType})
                            </div>
                            <div className="small text-muted">{rating.cabNumber}</div>
                            <div className="small text-muted">
                              {rating.ratingDate ? new Date(rating.ratingDate).toLocaleString() : ""}
                            </div>
                          </div>
                          <div className="d-flex align-items-center" style={{ minWidth: 120 }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                style={{
                                  color: rating.rating >= star ? "#FFD600" : "#ccc",
                                  fontSize: 22,
                                }}
                              >
                                <FaStar />
                              </span>
                            ))}
                          </div>
                          <div
                            className="border rounded p-2 bg-white ms-3"
                            style={{ minWidth: 150, maxWidth: 250, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                            title={rating.comment}
                          >
                            {rating.comment || <span className="text-muted">No comment</span>}
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
                        {filteredBookings.map((booking) => {
                          const isCancelled =
                            booking.bookingStatus &&
                            ["Canceled", "Cancelled", "CANCELLED"].includes(booking.bookingStatus);
                          const isExpanded = expandedBooking === booking.bookingId;

                          return (
                            <div
                              key={booking.bookingId}
                              className="mb-3 booking-card"
                              style={{
                                border: "1.5px solid #e3e6ed",
                                borderRadius: 18,
                                background: "#fff",
                                boxShadow: isExpanded
                                  ? "0 4px 24px #00b8ff22, 0 2px 8px #FFD60033"
                                  : "0 2px 8px #00b8ff11",
                                overflow: "hidden",
                                transition: "box-shadow 0.2s, border 0.2s",
                                position: "relative",
                              }}
                            >
                              {/* Summary Row */}
                              <div
                                className="d-flex align-items-center px-3 py-2 booking-summary-row"
                                style={{
                                  cursor: "pointer",
                                  background: isExpanded ? "#f8fafc" : "#fff",
                                  borderBottom: isExpanded ? "1px solid #e3e6ed" : "none",
                                  transition: "background 0.2s",
                                }}
                                onClick={() => setExpandedBooking(isExpanded ? null : booking.bookingId)}
                              >
                                <div
                                  style={{
                                    border: "2px solid #FFD600",
                                    borderRadius: 10,
                                    padding: 2,
                                    marginRight: 16,
                                    background: "#fff",
                                    minWidth: 60,
                                    minHeight: 44,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <img
                                    src={booking.cabImageUrl}
                                    alt={booking.cabName}
                                    style={{
                                      width: 54,
                                      height: 38,
                                      objectFit: "cover",
                                      borderRadius: 8,
                                    }}
                                  />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div
                                    className="fw-bold"
                                    style={{
                                      color: "#1976d2",
                                      fontSize: 17,
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",
                                      maxWidth: 200,
                                      fontWeight: 700,
                                      letterSpacing: 0.2,
                                    }}
                                  >
                                    {booking.cabName} <span style={{ fontWeight: 400, color: "#1976d2" }}>({booking.cabType})</span>
                                  </div>
                                  <div className="small text-muted" style={{ fontSize: 14 }}>
                                    {new Date(booking.pickupDateTime).toLocaleDateString()} &nbsp;|&nbsp; 
                                    <span style={{
                                      color:
                                        booking.bookingStatus === "Pending"
                                          ? "#e57368"
                                          : booking.bookingStatus === "Confirmed"
                                          ? "#1976d2"
                                          : booking.bookingStatus === "Completed"
                                          ? "#388e3c"
                                          : "#888",
                                      fontWeight: 600,
                                      letterSpacing: 0.1,
                                    }}>
                                      {booking.bookingStatus}
                                    </span>
                                  </div>
                                </div>
                                <span style={{ color: "#e57368", fontSize: 22, marginLeft: 8 }}>
                                  {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                </span>
                              </div>
                              {/* Expanded Details */}
                              {isExpanded && (
                                <div
                                  className="px-3 pb-3 pt-2"
                                  style={{
                                    background: "#f9fafb",
                                    borderTop: "1px solid #eee",
                                    animation: "fadeIn 0.3s",
                                  }}
                                >
                                  <div className="row g-2 mb-2" style={{ fontSize: 14 }}>
                                    <div className="col-12 col-md-6">
                                      <strong>Cab Number:</strong> {booking.cabNumber} <br />
                                      <strong>Model:</strong> {booking.cabModel} <br />
                                      <strong>Color:</strong> {booking.cabColor} <br />
                                      <strong>Pickup:</strong> {booking.pickupLocation} <br />
                                      <strong>Drop:</strong> {booking.dropLocation} <br />
                                      <strong>Date & Time:</strong>{" "}
                                      {new Date(booking.pickupDateTime).toLocaleString()} <br />
                                      <strong>Driver:</strong> {booking.driverName} ({booking.driverContact})
                                    </div>
                                    <div className="col-12 col-md-6">
                                      <div
                                        style={{
                                          background: "#fff",
                                          borderRadius: 10,
                                          border: "1px solid #e3e6ed",
                                          padding: "16px 18px",
                                          marginTop: 4,
                                          boxShadow: "0 2px 8px #ffd60011",
                                          minWidth: 220,
                                          maxWidth: 340,
                                        }}
                                      >
                                        <div style={{ fontWeight: 700, color: "#23272f", marginBottom: 8, fontSize: 15 }}>
                                          Fare Summary
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                          <span>Base Fare</span>
                                          <span>
                                            ₹{Number(booking.baseFare || booking.fare || 0).toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                          <span>Promo Discount</span>
                                          <span>
                                            -₹{Number(booking.promoDiscount || 0).toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2" style={{ fontWeight: 700 }}>
                                          <span>Final Fare</span>
                                          <span>
                                            ₹{Number((booking.fare || 0) - (booking.promoDiscount || 0)).toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-1">
                                          <span>Token Paid</span>
                                          <span>
                                            ₹{Number(booking.tokenAmount || 0).toFixed(2)}
                                          </span>
                                        </div>
                                        <div className="d-flex justify-content-between" style={{ fontWeight: 500 }}>
                                          <span>Balance to Pay</span>
                                          <span>
                                            ₹{Number((booking.balanceAmount || 0)).toFixed(2)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="d-flex flex-column flex-md-row gap-2 mt-3">
                                    {bookingsTab !== "cancelled" && !isCancelled && (
                                      <>
                                        <button
                                          className="btn btn-outline-danger btn-sm flex-fill"
                                          title="Cancel Booking"
                                          onClick={() => handleCancelBooking(booking)}
                                          style={{
                                            borderRadius: 8,
                                            fontWeight: 600,
                                            minWidth: 110,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: 6,
                                          }}
                                        >
                                          <FaTrash /> Cancel
                                        </button>
                                      </>
                                    )}
                                    <button
                                      className="btn btn-outline-secondary btn-sm flex-fill"
                                      title="Download Receipt"
                                      onClick={() => handleDownloadReceipt(booking)}
                                      style={{
                                        borderRadius: 8,
                                        fontWeight: 600,
                                        minWidth: 140,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 6,
                                      }}
                                    >
                                      <FaPrint /> Download Receipt
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
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
      {/* Print Receipt Modal (hidden, just for printing) */}
      {printBooking && (
        <div style={{ display: "none" }}>
          <BookingReceipt ref={printRef} booking={printBooking} />
        </div>
      )}
      {/* Cancel Booking Confirmation Modal */}
      {cancelConfirm.show && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex={-1}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">
                  Confirm Cancellation
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setCancelConfirm({ show: false, booking: null })}
                  disabled={cancelLoading}
                ></button>
              </div>
              <div className="modal-body">
                {cancelLoading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border text-danger" role="status" />
                    <div className="mt-2">Cancelling booking...</div>
                  </div>
                ) : (
                  "Are you sure you want to cancel this booking?"
                )}
              </div>
              {!cancelLoading && (
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setCancelConfirm({ show: false, booking: null })}
                  >
                    No
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={confirmCancelBooking}
                  >
                    Yes, Cancel Booking
                  </button>
                </div>
              )}
            </div>
          </div>
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
      {/* Hidden receipts for PDF download */}
      {filteredBookings.map((booking) => (
        <div key={booking.bookingId} style={{ display: "none" }}>
          <div id={`receipt-${booking.bookingId}`}>
            <BookingReceipt booking={booking} />
          </div>
        </div>
      ))}
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

export default UserProfile;