import React, { useState } from "react";
import { auth, provider } from "../config/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { USER_DEFAULT_ROLE } from "../constants/appConstants";
import API_ENDPOINTS from "../config/apiConfig";

const AuthModal = ({ show, onClose }) => {
    const [step, setStep] = useState("mobile");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [referral, setReferral] = useState("");

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
                background: "rgba(40,40,40,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    boxShadow: "0 8px 40px #0002",
                    width: "95vw",
                    maxWidth: 700,
                    minHeight: 420,
                    display: "flex",
                    overflow: "hidden",
                }}
            >
                {/* Left Side */}
                <div
                    style={{
                        background: "#f5f6fa",
                        flex: 1.1,
                        padding: 32,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        minWidth: 220,
                    }}
                    className="d-none d-md-flex"
                >
                    <div style={{ fontWeight: 900, fontSize: 28, color: "#b71c1c", marginBottom: 18 }}>
                        <img src="https://cdn-icons-png.flaticon.com/512/854/854894.png" alt="YatraNow" width={36} className="me-2" style={{ verticalAlign: "middle" }} />
                        Yatra<span style={{ color: "#e57368" }}>Now</span>
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 15 }}>
                        <li className="mb-3">
                            <b style={{ color: "#23272f" }}>Assured Service</b>
                            <div style={{ color: "#666", fontSize: 13 }}>Get support for cancellations and refunds</div>
                        </li>
                        <li className="mb-3">
                            <b style={{ color: "#23272f" }}>Free cancellation</b>
                            <div style={{ color: "#666", fontSize: 13 }}>100% refund on eligible cancellations</div>
                        </li>
                        <li>
                            <b style={{ color: "#23272f" }}>4.8★ Rating</b>
                            <div style={{ color: "#666", fontSize: 13 }}>Trusted by thousands of happy customers</div>
                        </li>
                    </ul>
                </div>
                {/* Right Side */}
                <div style={{ flex: 1.5, padding: 32, position: "relative" }}>
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            top: 18,
                            right: 18,
                            background: "none",
                            border: "none",
                            fontSize: 28,
                            color: "#888",
                            cursor: "pointer",
                            zIndex: 1,
                        }}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                    <div style={{ fontSize: 26, fontWeight: 700, marginBottom: 24, textAlign: "center" }}>
                        Login to YatraNow
                    </div>
                    <div id="recaptcha-container"></div>
                    {step === "mobile" ? (
                        <form
                            onSubmit={handleSendOtp}
                        >
                            <div className="mb-3">
                                <label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, display: "block" }}>
                                    Enter Mobile Number to Continue
                                </label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="+91"
                                    value={mobile}
                                    onChange={e => setMobile(e.target.value)}
                                    style={{
                                        fontSize: 18,
                                        borderRadius: 10,
                                        border: "1.5px solid #e3e6ed",
                                        padding: "12px 16px",
                                        marginBottom: 8,
                                        background: "#fafbfc",
                                    }}
                                    required
                                    maxLength={13}
                                />
                            </div>
                            <div className="mb-3">
                                <label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, display: "block" }}>
                                    Have a referral code?
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Referral Code if Available"
                                    value={referral}
                                    onChange={e => setReferral(e.target.value)}
                                    style={{
                                        fontSize: 16,
                                        borderRadius: 10,
                                        border: "1.5px solid #e3e6ed",
                                        padding: "10px 16px",
                                        background: "#fafbfc",
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-danger w-100 fw-bold"
                                style={{
                                    background: "#e57368",
                                    border: "none",
                                    borderRadius: 10,
                                    fontSize: 18,
                                    padding: "10px 0",
                                    marginTop: 8,
                                    marginBottom: 16,
                                    opacity: mobile.length >= 10 ? 1 : 0.6,
                                    pointerEvents: mobile.length >= 10 ? "auto" : "none"
                                }}
                                disabled={mobile.length < 10}
                            >
                                Send OTP
                            </button>
                        </form>
                    ) : (
                        <form
                            onSubmit={handleVerifyOtp}
                        >
                            <div className="mb-3">
                                <label style={{ fontWeight: 500, fontSize: 15, marginBottom: 6, display: "block" }}>
                                    Enter OTP Received
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    style={{
                                        fontSize: 18,
                                        borderRadius: 10,
                                        border: "1.5px solid #e3e6ed",
                                        padding: "12px 16px",
                                        marginBottom: 8,
                                        background: "#fafbfc",
                                    }}
                                    required
                                    maxLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-danger w-100 fw-bold"
                                style={{
                                    background: "#e57368",
                                    border: "none",
                                    borderRadius: 10,
                                    fontSize: 18,
                                    padding: "10px 0",
                                    marginTop: 8,
                                    marginBottom: 16,
                                }}
                            >
                                Verify OTP
                            </button>
                        </form>
                    )}
                    <div className="d-flex align-items-center my-3">
                        <div style={{ flex: 1, height: 1, background: "#e3e6ed" }} />
                        <span style={{ margin: "0 12px", color: "#888" }}>Or Continue With</span>
                        <div style={{ flex: 1, height: 1, background: "#e3e6ed" }} />
                    </div>
                    <button
                        className="btn btn-light w-100 border"
                        style={{
                            borderRadius: 10,
                            fontWeight: 600,
                            fontSize: 16,
                            color: "#23272f",
                            border: "1.5px solid #e3e6ed",
                            marginBottom: 10,
                        }}
                        type="button"
                        onClick={handleGoogleSignIn}
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" width={22} className="me-2" />
                        Sign in with Google
                    </button>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 10, textAlign: "center" }}>
                        By logging in, I understand & agree to YatraNow's{" "}
                        <a
                            href="/terms"
                            style={{ color: "#e57368", textDecoration: "underline" }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            terms of use
                        </a>{" "}
                        &amp;{" "}
                        <a
                            href="/privacy"
                            style={{ color: "#e57368", textDecoration: "underline" }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            privacy policy
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;