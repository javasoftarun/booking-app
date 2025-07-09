import React, { useEffect, useState } from "react";
import API_ENDPOINTS from "../../config/apiConfig";
import { FaStar } from "react-icons/fa";
import ProfileLoader from "../../components/ProfileLoader";

const ProfileRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cabMap, setCabMap] = useState({}); // cabRegistrationId -> cab info

  // Fetch ratings and cabs/bookings on mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};

    // Fetch ratings
    fetch(API_ENDPOINTS.GET_RATINGS_BY_USER_ID(user.id))
      .then(res => res.json())
      .then(data => {
        if (data && data.responseMessage === "success" && Array.isArray(data.responseData)) {
          setRatings(data.responseData);
        } else {
          setRatings([]);
        }
      });

    // Fetch all cabs or bookings (choose whichever gives you cab info)
    fetch(API_ENDPOINTS.GET_BOOKINGS_BY_USER_ID(user.id))
      .then(res => res.json())
      .then(data => {
        if (
          data &&
          data.responseMessage === "success" &&
          Array.isArray(data.responseData) &&
          Array.isArray(data.responseData[0])
        ) {
          // Build a map: cabRegistrationId -> cab info
          const cabMap = {};
          data.responseData[0].forEach(b => {
            if (b.cabRegistrationId) {
              cabMap[b.cabRegistrationId] = {
                cabName: b.cabName,
                cabType: b.cabType,
                cabCapacity: b.cabCapacity,
                cabImageUrl: b.cabImageUrl,
                driverName: b.driverName,
              };
            }
          });
          setCabMap(cabMap);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ProfileLoader text="Loading your ratings..." />;

  return (
    <div>
      <h4 className="fw-bold mb-4" style={{ color: "#e57368" }}>My Ratings</h4>
      <div className="row g-4">
        {ratings.map(rating => {
          // Try to get cab info from cabMap using cabRegistrationId
          const cabInfo = rating.cabRegistrationId ? cabMap[rating.cabRegistrationId] : null;
          return (
            <div key={rating.bookingId || rating.id} className="col-12 col-md-6 col-lg-4">
              <div className="p-4 rounded-4 shadow-sm bg-white h-100 d-flex flex-column justify-content-between">
                <div>
                  {/* Cab Info */}
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={
                        (cabInfo && cabInfo.cabImageUrl) ||
                        "https://cdn-icons-png.flaticon.com/512/296/296216.png"
                      }
                      alt={cabInfo?.cabName || "Cab"}
                      style={{
                        width: 48,
                        height: 32,
                        objectFit: "cover",
                        borderRadius: 6,
                        marginRight: 12,
                        background: "#f8fafc",
                        border: "1px solid #eee"
                      }}
                    />
                    <div>
                      <div className="fw-bold" style={{ color: "#1976d2" }}>
                        {cabInfo?.cabName || "Cab"}
                      </div>
                      <div className="text-muted" style={{ fontSize: 14 }}>
                        {cabInfo?.cabType || "Cab"} • {cabInfo?.cabCapacity || "—"} Seats
                      </div>
                      <div className="text-muted" style={{ fontSize: 13 }}>
                        {cabInfo?.driverName ? `Driver: ${cabInfo.driverName}` : ""}
                      </div>
                    </div>
                  </div>
                  {/* Stars */}
                  <div className="mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <FaStar
                        key={star}
                        color={rating.rating >= star ? "#FFD600" : "#e0e0e0"}
                        size={20}
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </div>
                  <div className="mb-2 text-muted" style={{ fontSize: 15 }}>
                    {rating.comment || <span className="fst-italic">No comment</span>}
                  </div>
                </div>
                <div className="small text-secondary mt-2" style={{ textAlign: "right" }}>
                  {rating.ratingDate
                    ? new Date(rating.ratingDate).toLocaleString()
                    : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileRatings;