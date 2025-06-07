import React, { useState, useEffect } from "react";
import { auth, provider, messaging, onMessage } from "../config/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { USER_DEFAULT_ROLE } from "../constants/appConstants";
import API_ENDPOINTS from "../config/apiConfig";
import TermsAndConditionsModal from "../modal/TermsAndConditionsModal";
import PrivacyPolicyModal from "../modal/PrivacyPolicyModal";
import { getToken } from "firebase/messaging";

const AuthModal = ({ show, onClose }) => {
    const [step, setStep] = useState("mobile");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);

    useEffect(() => {
        if (!show) {
            setShowPrivacy(false);
            setShowTerms(false);
            setStep("mobile");
            setMobile("");
            setOtp("");
            setConfirmationResult(null);
        }
    }, [show]);

    useEffect(() => {
        onMessage(messaging, (payload) => {
            new window.Notification(payload.notification.title, {
                body: payload.notification.body,
                icon: "/logo192.png",
            });
        });
    }, []);

    if (!show) return null;

    const handleGoogleSignIn = async () => {
        try {
            // Get FCM token before user API call
            let fcmToken = "";
            try {
                fcmToken = await getToken(messaging, {
                    vapidKey:
                        "BMjoI0vuxY7XF6EkpbfeJP4GMmwyCRkK_9ptzad5gX36ckb502s_1odyiWf0Hjz7xafGz_Xt7QdTPvmK53lGRlc",
                });
                console.log("FCM Token:", fcmToken);
            } catch (err) {
                console.warn("Unable to get FCM token", err);
            }

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
                fcmToken: fcmToken || "",
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
            tabIndex={-1}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: 18,
                    boxShadow: "0 8px 40px #e5736822, 0 2px 8px #FFD60033",
                    width: "99vw",
                    maxWidth: 400,
                    minHeight: 420,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    overflow: "hidden",
                    border: "1.5px solid #e57368",
                    padding: 0,
                    animation: "fadeInUp .4s cubic-bezier(.4,2,.6,1)",
                }}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        background: "linear-gradient(90deg, #fff 60%, #e3f6ff 100%)",
                        padding: "22px 0 12px 0",
                        textAlign: "center",
                        borderBottom: "1px solid #f3e9e7",
                        position: "relative",
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute",
                            top: 16,
                            right: 18,
                            background: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: 32,
                            height: 32,
                            fontSize: 18,
                            color: "#e57368",
                            boxShadow: "0 1px 4px #FFD60033",
                            cursor: "pointer",
                            zIndex: 1,
                        }}
                        aria-label="Close"
                    >
                        <i className="bi bi-x-lg" />
                    </button>
                    <div
                        style={{
                            fontWeight: 900,
                            fontSize: 26,
                            color: "#e57368",
                            letterSpacing: 0.5,
                        }}
                    >
                        Yatra
                        <span style={{ color: "#FFD600" }}>N</span>
                        <span style={{ color: "#23272f" }}>ow</span>
                    </div>
                    <div
                        style={{
                            color: "#23272f",
                            fontWeight: 600,
                            fontSize: 16,
                            marginTop: 2,
                        }}
                    >
                        Sign in to continue
                    </div>
                </div>
                {/* Auth Form */}
                <div
                    style={{
                        flex: 1,
                        padding: "0 28px 24px 28px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <div id="recaptcha-container"></div>
                    {step === "mobile" ? (
                        <form onSubmit={handleSendOtp} style={{ marginTop: 22 }}>
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
                                        color: "#e57368",
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
                            <button
                                type="submit"
                                className="btn w-100 fw-bold"
                                style={{
                                    background: "#e57368",
                                    border: "none",
                                    borderRadius: 8,
                                    fontSize: 16,
                                    padding: "10px 0",
                                    marginTop: 8,
                                    marginBottom: 10,
                                    color: "#fff",
                                    boxShadow: "0 1px 4px #FFD60044",
                                    opacity: mobile.length === 10 ? 1 : 0.6,
                                    pointerEvents: mobile.length === 10 ? "auto" : "none",
                                    letterSpacing: 0.5,
                                    transition: "background 0.2s",
                                }}
                                disabled={mobile.length !== 10}
                            >
                                <i className="bi bi-shield-lock-fill me-2" style={{ color: "#FFD600" }} />
                                Send OTP
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} style={{ marginTop: 22 }}>
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
                                    background: "#e57368",
                                    border: "none",
                                    borderRadius: 8,
                                    fontSize: 16,
                                    padding: "10px 0",
                                    marginTop: 8,
                                    marginBottom: 10,
                                    color: "#fff",
                                    boxShadow: "0 1px 4px #FFD60044",
                                    letterSpacing: 0.5,
                                    transition: "background 0.2s",
                                }}
                            >
                                <i className="bi bi-unlock-fill me-2" style={{ color: "#FFD600" }} />
                                Verify OTP
                            </button>
                        </form>
                    )}
                    <div className="d-flex align-items-center my-3">
                        <div style={{ flex: 1, height: 1, background: "#e3e6ed" }} />
                        <span
                            style={{
                                margin: "0 12px",
                                color: "#888",
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
                            background: "#f8fafc",
                            boxShadow: "0 1px 4px #e3f6ff44",
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
                            fontSize: 12,
                            color: "#888",
                            marginTop: 10,
                            textAlign: "center",
                            lineHeight: 1.6,
                        }}
                    >
                        By logging in, you agree to{" "}
                        <span
                            style={{
                                color: "#e57368",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                            onClick={() => setShowTerms(true)}
                        >
                            Terms of Use
                        </span>{" "}
                        &amp;{" "}
                        <span
                            style={{
                                color: "#e57368",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                            onClick={() => setShowPrivacy(true)}
                        >
                            Privacy Policy
                        </span>
                    </div>
                </div>
            </div>
            <TermsAndConditionsModal show={showTerms} onClose={() => setShowTerms(false)} />
            <PrivacyPolicyModal show={showPrivacy} onClose={() => setShowPrivacy(false)} />
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