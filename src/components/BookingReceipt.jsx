import React, { forwardRef } from "react";
import logo from "../assets/images/logo.png";

const BookingReceipt = forwardRef(({ booking }, ref) => {
  // Get passenger details from localStorage
  let passenger = {};
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      passenger = {
        name: user.name || user.fullName || user.username || "--",
        contact: user.phone || user.mobile || user.contact || "--",
        email: user.email || "--",
      };
    }
  } catch {
    passenger = { name: "--", contact: "--", email: "--" };
  }

  return (
    <div ref={ref} style={{ maxWidth: 600, margin: "0 auto", padding: 32, fontFamily: "inherit", background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <h2 style={{ color: "#8d3c1e", fontWeight: 700, margin: 0, fontSize: 28 }}> Booking Receipt</h2>
      </div>
      <div style={{ color: "#666", fontSize: 14, marginBottom: 16 }}>
        Booking Date: {new Date().toLocaleString()}
      </div>
      <hr />
      <div style={{ marginBottom: 16 }}>
        <b>Passenger Details</b>
        <div><b>Name:</b> {passenger.name}</div>
        <div><b>Contact:</b> {passenger.contact}</div>
        <div><b>Email:</b> {passenger.email}</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Trip Details</b>
        <div>📍 <b>From:</b> {booking.pickupLocation}</div>
        <div>📍 <b>To:</b> {booking.dropLocation}</div>
        <div>🕒 <b>Pickup:</b> {booking.pickupDateTime}</div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Cab Details</b>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={booking.cabImageUrl} alt={booking.cabName} style={{ width: 60, borderRadius: 8 }} />
          <div>
            <div><b>{booking.cabName}</b></div>
            <div>{booking.cabType} • {booking.cabCapacity} Seats</div>
            <div><b>Fuel:</b> {booking.cabFuel || "N/A"}</div>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <b>Fare Summary</b>
        <div>Base Fare <span style={{ float: "right" }}>₹{booking.fare}</span></div>
        <div>Promo Discount <span style={{ float: "right" }}>-₹{booking.promoDiscount}</span></div>
        <div style={{ fontWeight: 700 }}>Final Fare <span style={{ float: "right" }}>₹{booking.fare - booking.promoDiscount}</span></div>
        <div>Token Paid <span style={{ float: "right" }}>₹{booking.tokenAmount}</span></div>
        <div>Balance to Pay <span style={{ float: "right" }}>₹{booking.balanceAmount}</span></div>
      </div>
      <div style={{ background: "#f5f8fa", border: "1px solid #cce3f6", borderRadius: 6, padding: 10, fontSize: 13, marginBottom: 24 }}>
        <span style={{ color: "#0d6efd" }}>ℹ️</span> Cab and driver details will be shared up to 30 mins before your pickup time.<br />
        For help, contact our support.
      </div>
      <div style={{ textAlign: "center", color: "#8d3c1e", marginTop: 32 }}>
        <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          <img src={logo} alt="Bhada24 Logo" style={{ height: 45, width: "auto", verticalAlign: "middle", marginRight: 6 }} />
        </div>
        <div style={{ fontSize: 13 }}>
          All rights reserved © {new Date().getFullYear()}<br />
          Designed with ♥ for your travel needs.<br />
          Need help? <a href="mailto:support@bhada24.com" style={{ color: "#e57368" }}>support@bhada24.com</a>
        </div>
      </div>
    </div>
  );
});

export default BookingReceipt;