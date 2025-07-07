import React, { useState, useEffect } from "react";

const ProfileSettings = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) setProfile(JSON.parse(userStr));
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="p-4 rounded-4 shadow-sm bg-white" style={{ maxWidth: 600, margin: "0 auto" }}>
      <h4 className="fw-bold mb-4" style={{ color: "#e57368" }}>Settings</h4>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="emailNotification"
          checked={profile.emailNotification || false}
          onChange={e => setProfile({ ...profile, emailNotification: e.target.checked })}
        />
        <label className="form-check-label" htmlFor="emailNotification">
          Enable Email Notifications
        </label>
      </div>
      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="mobileNotification"
          checked={profile.mobileNotification || false}
          onChange={e => setProfile({ ...profile, mobileNotification: e.target.checked })}
        />
        <label className="form-check-label" htmlFor="mobileNotification">
          Enable Mobile Notifications
        </label>
      </div>
      {/* Add more settings as needed */}
    </div>
  );
};

export default ProfileSettings;