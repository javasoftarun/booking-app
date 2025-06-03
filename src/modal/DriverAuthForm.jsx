import React from "react";

const DriverAuthForm = ({
  step,
  mobile,
  setMobile,
  referral,
  setReferral,
  otp,
  setOtp,
  handleSendOtp,
  handleVerifyOtp,
}) => (
  <div>
    {step === "mobile" ? (
      <form onSubmit={handleSendOtp} style={{ marginTop: 16 }}>
        <label
          style={{
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 6,
            display: "block",
            color: "#23272f",
          }}
        >
          Driver Mobile Number
        </label>
        <div className="input-group mb-3">
          <span
            className="input-group-text"
            style={{
              background: "#f5f6fa",
              fontWeight: 600,
              fontSize: 15,
              borderRadius: "8px 0 0 8px",
              border: "1px solid #e3e6ed",
              borderRight: "none",
              color: "#1976d2",
            }}
          >
            +91
          </span>
          <input
            type="tel"
            className="form-control"
            placeholder="Enter driver mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            style={{
              fontSize: 16,
              borderRadius: "0 8px 8px 0",
              border: "1px solid #e3e6ed",
              borderLeft: "none",
              padding: "10px 14px",
              background: "#fafbfc",
            }}
            required
            maxLength={10}
          />
        </div>
        <label
          style={{
            fontWeight: 500,
            fontSize: 13,
            marginBottom: 6,
            display: "block",
            color: "#23272f",
          }}
        >
          Referral Code <span style={{ color: "#bbb" }}>(optional)</span>
        </label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Referral Code"
          value={referral}
          onChange={(e) => setReferral(e.target.value)}
          style={{
            fontSize: 14,
            borderRadius: 8,
            border: "1px solid #e3e6ed",
            padding: "8px 14px",
            background: "#fafbfc",
          }}
        />
        <button
          type="submit"
          className="btn w-100 fw-bold"
          style={{
            background: "#FFD600",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            padding: "9px 0",
            marginTop: 8,
            marginBottom: 10,
            color: "#23272f",
            boxShadow: "0 1px 4px #e3e6ed",
            opacity: mobile.length === 10 ? 1 : 0.6,
            pointerEvents: mobile.length === 10 ? "auto" : "none",
            letterSpacing: 0.5,
            transition: "background 0.2s",
          }}
          disabled={mobile.length !== 10}
        >
          <i className="bi bi-shield-lock-fill me-2" style={{ color: "#e57368" }} />
          Send OTP
        </button>
      </form>
    ) : (
      <form onSubmit={handleVerifyOtp} style={{ marginTop: 16 }}>
        <label
          style={{
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 6,
            display: "block",
            color: "#23272f",
          }}
        >
          Enter OTP
        </label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          style={{
            fontSize: 17,
            borderRadius: 8,
            border: "1px solid #e3e6ed",
            padding: "10px 14px",
            background: "#fafbfc",
            letterSpacing: 6,
            textAlign: "center",
          }}
          required
          maxLength={6}
        />
        <button
          type="submit"
          className="btn w-100 fw-bold"
          style={{
            background: "#FFD600",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            padding: "9px 0",
            marginTop: 8,
            marginBottom: 10,
            color: "#23272f",
            boxShadow: "0 1px 4px #e3e6ed",
            letterSpacing: 0.5,
            transition: "background 0.2s",
          }}
        >
          <i className="bi bi-unlock-fill me-2" style={{ color: "#e57368" }} />
          Verify OTP
        </button>
      </form>
    )}
  </div>
);

export default DriverAuthForm;