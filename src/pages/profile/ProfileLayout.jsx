import React from "react";
import ProfileSidebar from "./ProfileSidebar";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => (
  <div
    className="container my-5 d-flex flex-column flex-md-row"
    style={{ gap: 32 }}
  >
    <ProfileSidebar />
    <div style={{ flex: 1, minWidth: 0 }}>
      <Outlet />
    </div>
  </div>
);

export default ProfileLayout;