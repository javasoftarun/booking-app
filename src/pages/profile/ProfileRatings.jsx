import React, { useEffect, useState } from "react";
import API_ENDPOINTS from "../../config/apiConfig";
import { FaStar } from "react-icons/fa";
import ProfileLoader from "../../components/ProfileLoader";

const ProfileRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};
    fetch(API_ENDPOINTS.GET_RATINGS_BY_USER_ID(user.id))
      .then(res => res.json())
      .then(data => {
        if (data && data.responseMessage === "success" && Array.isArray(data.responseData)) {
          setRatings(data.responseData);
        } else {
          setRatings([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ProfileLoader text="Loading your ratings..." />;
  if (!ratings.length) return <div>No ratings yet.</div>;

  return (
    <div>
      <h4 className="fw-bold mb-4" style={{ color: "#e57368" }}>My Ratings</h4>
      <div className="row g-4">
        {ratings.map(rating => (
          <div key={rating.id} className="col-12 col-md-6 col-lg-4">
            <div className="p-3 rounded-4 shadow-sm bg-white h-100">
              <div className="fw-bold mb-2">{rating.cabName}</div>
              <div className="mb-2">
                {[1,2,3,4,5].map(star => (
                  <FaStar key={star} color={rating.rating >= star ? "#FFD600" : "#ccc"} />
                ))}
              </div>
              <div className="mb-1 text-muted">{rating.comment || "No comment"}</div>
              <div className="small text-secondary">{rating.ratingDate ? new Date(rating.ratingDate).toLocaleString() : ""}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileRatings;