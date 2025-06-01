import React, { useState } from "react";
import { auth, provider } from "../config/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { USER_DEFAULT_ROLE } from "../constants/appConstants";
import API_ENDPOINTS from "../config/apiConfig";
import TermsAndConditionsModal from "../modal/TermsAndConditionsModal";
import PrivacyPolicyModal from "../modal/PrivacyPolicyModal";

const AuthModal = ({ show, onClose }) => {
    const [step, setStep] = useState("mobile");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [referral, setReferral] = useState("");
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    if (!show) return null;

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const payload = {
                id: 0,
                name: user.displayName || "Guest",
                email: user.email || "",
                password: null,
                phone: user.phoneNumber ? user.phoneNumber.replace("+91", "") : null,
                role: USER_DEFAULT_ROLE,
                verified: true,
                imageUrl: user.photoURL || "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            // Call Add User API
            const res = await fetch(API_ENDPOINTS.ADD_USER, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            const userObj =
                (data.responseData &&
                    Array.isArray(data.responseData) &&
                    data.responseData[0]) ||
                null;

            if (userObj) {
                // Store the complete user object as a JSON string
                localStorage.setItem("user", JSON.stringify(userObj));
                // New user created, set info from payload
                localStorage.setItem("userId", userObj.id);
                localStorage.setItem("userName", userObj.name);
                localStorage.setItem("userEmail", userObj.email);
                localStorage.setItem("userPhone", userObj.phone || "");
                localStorage.setItem("userRole", userObj.role);
                localStorage.setItem("userVerified", userObj.verified);
                localStorage.setItem("userImage", userObj.imageUrl);
                window.dispatchEvent(new Event("userLogin"));
                onClose && onClose();
            } else if (data.responseMessage === "Email is already in use") {
                // Email exists, fetch user by email
                const userRes = await fetch(API_ENDPOINTS.GET_USER_BY_EMAIL(payload.email));
                const userData = await userRes.json();
                // userData.responseData should be an array
                const existingUser =
                    (userData.responseData &&
                        Array.isArray(userData.responseData) &&
                        userData.responseData[0]) ||
                    null;
                if (existingUser) {
                    localStorage.setItem("user", JSON.stringify(existingUser));
                    localStorage.setItem("userId", existingUser.id);
                    localStorage.setItem("userName", existingUser.name);
                    localStorage.setItem("userEmail", existingUser.email);
                    localStorage.setItem("userPhone", existingUser.phone || "");
                    localStorage.setItem("userRole", existingUser.role);
                    localStorage.setItem("userVerified", existingUser.verified);
                    localStorage.setItem("userImage", existingUser.imageUrl);
                    console.log("User info fetched from existing user:", existingUser);

                    window.dispatchEvent(new Event("userLogin"));
                    onClose && onClose();
                } else {
                    alert("Unable to fetch user info. Please try again.");
                }
            } else {
                alert(data.responseMessage || "Google sign-in failed.");
            }
        } catch (error) {
            alert("Google sign-in failed.");
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                "recaptcha-container",
                {
                    size: "invisible",
                    callback: (response) => {
                        // reCAPTCHA solved
                    },
                },
                auth
            );
        }
        try {
            const result = await signInWithPhoneNumber(auth, "+91" + mobile, window.recaptchaVerifier);
            setConfirmationResult(result);
            setStep("otp");
        } catch (error) {
            alert("Failed to send OTP");
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            await confirmationResult.confirm(otp);
            alert("Logged in successfully!");
            // onClose();
        } catch (error) {
            alert("Invalid OTP");
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                zIndex: 2000,
                left: 0,
                top: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(30,40,60,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(3px)",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 8px 32px rgba(30,40,60,0.10)",
                    width: "95vw",
                    maxWidth: 370,
                    minHeight: 420,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid #e3e6ed",
                    padding: 0,
                    animation: "fadeInUp .4s cubic-bezier(.4,2,.6,1)",
                }}
            >
                {/* Subtle Top Bar */}
                <div
                    style={{
                        height: 6,
                        width: "100%",
                        background: "linear-gradient(90deg, #f5f6fa 0%, #e3e6ed 100%)",
                        borderRadius: "0 0 12px 12px",
                    }}
                />
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        background: "#f5f6fa",
                        border: "none",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        fontSize: 20,
                        color: "#888",
                        boxShadow: "0 1px 4px #e3e6ed",
                        cursor: "pointer",
                        zIndex: 1,
                        transition: "background 0.2s",
                    }}
                    aria-label="Close"
                >
                    <i className="bi bi-x-lg" />
                </button>
                {/* Brand & Welcome */}
                <div style={{ textAlign: "center", marginTop: 28, marginBottom: 8 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 10,
                            marginBottom: 8,
                        }}
                    >
                        <span style={{
                            fontWeight: 800,
                            fontSize: 28,
                            letterSpacing: 0.5,
                            fontFamily: "inherit",
                            color: "#e57368",
                        }}>
                            Yatra
                            <span style={{ color: "#FFD600" }}>Now</span>
                        </span>
                    </div>
                    <div style={{ color: "#888", fontSize: 14, marginTop: 2 }}>
                        Sign in to continue
                    </div>
                </div>
                {/* Auth Form */}
                <div
                    style={{
                        flex: 1,
                        padding: "0 24px 20px 24px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <div id="recaptcha-container"></div>
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
                                Mobile Number
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
                                    placeholder="Enter mobile"
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
                                    background: "#FFD600", // Yellow button
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
                    <div className="d-flex align-items-center my-3">
                        <div style={{ flex: 1, height: 1, background: "#e3e6ed" }} />
                        <span
                            style={{
                                margin: "0 12px",
                                color: "#bbb",
                                fontWeight: 500,
                                fontSize: 14,
                                letterSpacing: 0.5,
                            }}
                        >
                            or
                        </span>
                        <div style={{ flex: 1, height: 1, background: "#e3e6ed" }} />
                    </div>
                    <button
                        className="btn w-100 border"
                        style={{
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 15,
                            color: "#23272f",
                            border: "1px solid #e3e6ed",
                            marginBottom: 10,
                            background: "#f5f6fa",
                            boxShadow: "0 1px 4px #e3e6ed",
                            letterSpacing: 0.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            transition: "background 0.2s",
                        }}
                        type="button"
                        onClick={handleGoogleSignIn}
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
                            alt="Google"
                            width={20}
                            style={{ borderRadius: 4, marginRight: 6 }}
                        />
                        Sign in with Google
                    </button>
                    <div
                        style={{
                            fontSize: 11,
                            color: "#888",
                            marginTop: 10,
                            textAlign: "center",
                            lineHeight: 1.6,
                        }}
                    >
                        By logging in, you agree to{" "}
                        <span
                            style={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }}
                            onClick={() => setShowTerms(true)}
                        >
                            Terms of Use
                        </span>{" "}
                        &amp;{" "}
                        <span
                            style={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }}
                            onClick={() => setShowPrivacy(true)}
                        >
                            Privacy Policy
                        </span>
                    </div>
                </div>
            </div>
            {/* Modals for Terms and Privacy */}
            <TermsAndConditionsModal show={showTerms} onClose={() => setShowTerms(false)} />
            <PrivacyPolicyModal show={showPrivacy} onClose={() => setShowPrivacy(false)} />
            {/* Animation keyframes */}
            <style>
                {`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}
            </style>
        </div>
    );
};

export default AuthModal;