import React, { useState, useEffect } from "react";

const ProfileInfo = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setProfile(JSON.parse(userStr));
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-4 rounded-4 shadow-sm bg-white" style={{ maxWidth: 600, margin: "0 auto" }}>
      <div className="d-flex align-items-center gap-4 mb-4">
        <img
          src={profile.imageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
          alt="avatar"
          className="rounded-circle border"
          style={{ width: 90, height: 90, objectFit: "cover", border: "3px solid #FFD600" }}
        />
        <div>
          <div className="fw-bold" style={{ fontSize: 24, color: "#e57368" }}>{profile.name}</div>
          <div className="text-muted" style={{ fontSize: 16 }}>{profile.email}</div>
          <div className="badge rounded-pill bg-warning text-dark mt-2" style={{ fontWeight: 600 }}>
            {profile.role ? profile.role.toUpperCase() : "USER"}
          </div>
        </div>
      </div>
      <form>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" value={profile.name} readOnly />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={profile.email} readOnly />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Mobile</label>
            <input type="text" className="form-control" value={profile.phone} readOnly />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Gender</label>
            <input type="text" className="form-control" value={profile.gender} readOnly />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Date of Birth</label>
            <input type="date" className="form-control" value={profile.dateOfBirth} readOnly />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;