import React, { useState, useEffect, useRef } from "react";
import API_ENDPOINTS from "../../config/apiConfig";

const UPLOAD_IMAGE_API = API_ENDPOINTS.UPLOAD_BASE64_IMAGE;
const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const ProfileInfo = () => {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });
  const fileInputRef = useRef();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const userId = user.id || user._id || user.userId || "";
      setProfile({ ...user, id: userId });
      setForm({
        id: userId,
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
    }
  }, []);

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 2500);
  };

  const handleEdit = () => setEdit(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Convert image to base64 and upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

      let base64Image = await toBase64(file);
      const base64PrefixMatch = base64Image.match(/^data:(image\/\w+);base64,/);
      if (base64PrefixMatch) {
        base64Image = base64Image.replace(/^data:(image\/\w+);base64,/, "");
      }

      const res = await fetch(UPLOAD_IMAGE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: form.id,
          base64Image: base64Image,
        }),
      });
      const data = await res.json();
      if (
        data.responseMessage === "success" &&
        typeof data.responseData === "string" &&
        data.responseData.startsWith("http")
      ) {
        setForm((prev) => ({ ...prev, imageUrl: data.responseData }));
        const updatedProfile = { ...profile, imageUrl: data.responseData };
        setProfile(updatedProfile);
        localStorage.setItem("user", JSON.stringify(updatedProfile));
        window.dispatchEvent(new Event("userProfileUpdated"));
      }
    } catch (err) {
      // No popup for image upload error
    }
    setUploading(false);
  };

  // Save profile to backend
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.imageUrl) delete payload.imageUrl;

      const res = await fetch(API_ENDPOINTS.UPDATE_USER, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.responseMessage === "success") {
        setProfile(form);
        localStorage.setItem("user", JSON.stringify(form));
        setEdit(false);
        window.dispatchEvent(new Event("userProfileUpdated"));
        showPopup("Profile updated successfully!", "success");
      } else {
        showPopup(data.responseMessage || "Failed to update profile", "error");
      }
    } catch (err) {
      showPopup("Profile update error", "error");
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setEdit(false);
    setForm({
      id: profile.id || "",
      name: profile.name || "",
      email: profile.email || "",
      password: profile.password || "",
      phone: profile.phone || "",
      role: profile.role || "",
      verified: profile.verified || false,
      imageUrl: profile.imageUrl || "",
      gender: profile.gender || "",
      dateOfBirth: profile.dateOfBirth || "",
      createdAt: profile.createdAt || "",
      updatedAt: profile.updatedAt || "",
      emailNotification: profile.emailNotification || false,
      mobileNotification: profile.mobileNotification || false,
    });
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div
      key={edit ? "edit" : profile ? JSON.stringify(profile) : "loading"}
      className="p-4 rounded-4 shadow-sm bg-white"
      style={{ maxWidth: 600, margin: "0 auto" }}
    >
      {/* Popup */}
      {popup.show && (
        <div
          className="profile-popup-animation"
          style={{
            position: "fixed",
            top: 90,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2000,
            minWidth: 320,
            maxWidth: 400,
            background: "#fff",
            boxShadow: "0 8px 32px #0002",
            padding: "22px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation: "fadeInScale 0.4s",
          }}
        >
          {popup.type === "success" ? (
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ marginBottom: 12 }}>
              <circle cx="24" cy="24" r="22" fill="#eafaf1" stroke="#38c172" strokeWidth="3" />
              <polyline
                points="15,25 22,32 34,18"
                fill="none"
                stroke="#38c172"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ marginBottom: 12 }}>
              <circle cx="24" cy="24" r="22" fill="#fbeaea" stroke="#dc3545" strokeWidth="3" />
              <line x1="17" y1="17" x2="31" y2="31" stroke="#dc3545" strokeWidth="4" strokeLinecap="round" />
              <line x1="31" y1="17" x2="17" y2="31" stroke="#dc3545" strokeWidth="4" strokeLinecap="round" />
            </svg>
          )}
          <div
            style={{
              fontWeight: 700,
              fontSize: 18,
              color: popup.type === "success" ? "#38c172" : "#dc3545",
              marginBottom: 4,
              textAlign: "center",
            }}
          >
            {popup.type === "success" ? "Success!" : "Error"}
          </div>
          <div style={{ color: "#23272f", fontSize: 16, textAlign: "center" }}>
            {popup.message}
          </div>
        </div>
      )}
      <style>
        {`
      @keyframes fadeInScale {
        0% { opacity: 0; transform: scale(0.85) translateX(-50%);}
        100% { opacity: 1; transform: scale(1) translateX(-50%);}
      }
      `}
      </style>

      <div className="d-flex align-items-center gap-4 mb-4">
        <div style={{ position: "relative" }}>
          <img
            src={form.imageUrl || DEFAULT_AVATAR}
            alt="avatar"
            className="rounded-circle border"
            style={{ width: 90, height: 90, objectFit: "cover", border: "3px solid #FFD600" }}
          />
          {edit && (
            <>
              <button
                type="button"
                className="btn btn-sm btn-light"
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  borderRadius: "50%",
                  border: "1.5px solid #e57368",
                  boxShadow: "0 2px 8px #e5736822",
                  padding: 6,
                  zIndex: 2,
                }}
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                aria-label="Upload profile photo"
              >
                <i className="bi bi-camera" style={{ color: "#e57368", fontSize: 18 }} />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
                disabled={uploading}
              />
              {uploading && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 3,
                  }}
                >
                  <div className="spinner-border text-warning" style={{ width: 28, height: 28 }} />
                </div>
              )}
            </>
          )}
        </div>
        <div>
          <div className="fw-bold" style={{ fontSize: 24, color: "#e57368" }}>{profile.name}</div>
          <div className="text-muted" style={{ fontSize: 16 }}>{profile.email}</div>
          <div className="badge rounded-pill bg-warning text-dark mt-2" style={{ fontWeight: 600 }}>
            {profile.role ? profile.role.toUpperCase() : "USER"}
          </div>
        </div>
      </div>
      <form onSubmit={handleSave}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleChange}
              readOnly={!edit}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              readOnly={!!form.email || !edit}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Mobile</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              readOnly={!!form.phone || !edit} // <-- disable if phone exists
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              name="gender"
              value={form.gender}
              onChange={handleChange}
              disabled={!edit}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              readOnly={!edit}
            />
          </div>
        </div>
        <div className="mt-4 d-flex gap-3">
          {!edit ? (
            <button
              type="button"
              className="btn btn-outline-primary px-4"
              onClick={handleEdit}
            >
              <i className="bi bi-pencil me-2" />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={uploading || saving}
              >
                <i className="bi bi-save me-2" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleCancel}
                disabled={uploading || saving}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileInfo;