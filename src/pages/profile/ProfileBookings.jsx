import React, { useEffect, useState } from "react";
import API_ENDPOINTS from "../../config/apiConfig";
import ProfileLoader from "../../components/ProfileLoader";

const ProfileBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
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

  if (loading) return <ProfileLoader text="Fetching your bookings..." />;
  if (!bookings.length) return <div>No bookings found.</div>;

  return (
    <div>
      <h4 className="fw-bold mb-4" style={{ color: "#e57368" }}>My Bookings</h4>
      <div className="row g-4">
        {bookings.map(booking => (
          <div key={booking.bookingId} className="col-12 col-md-6 col-lg-4">
            <div className="p-3 rounded-4 shadow-sm bg-white h-100">
              <div className="fw-bold" style={{ color: "#1976d2" }}>{booking.cabName}</div>
              <div className="text-muted mb-2">{booking.pickupLocation} → {booking.dropLocation}</div>
              <div className="mb-1"><b>Date:</b> {new Date(booking.pickupDateTime).toLocaleString()}</div>
              <div className="mb-1"><b>Status:</b> {booking.bookingStatus}</div>
              <div className="mb-1"><b>Fare:</b> ₹{booking.fare}</div>
              {/* Add more details/actions as needed */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileBookings;