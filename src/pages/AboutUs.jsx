import React from "react";

const AboutUs = () => (
  <div
    style={{
      minHeight: "100vh",
      background: "#f8fafc",
      padding: 0,
      marginTop: 32,
      marginBottom: -50,
    }}
  >
    <section
      className="container py-5"
      style={{
        maxWidth: 1100,
      }}
    >
      <div
        className="bg-white rounded-3 shadow-sm px-3 px-md-5 py-4"
        style={{
          border: "1px solid #e3e6ed",
        }}
      >
        {/* Header */}
        <div className="mb-5 text-center">
         
          <div style={{ color: "#888", fontSize: 17 }}>
            Pre-book your cab, travel with confidence.
          </div>
        </div>

        {/* Path Design */}
        <div className="position-relative" style={{ minHeight: 600 }}>
          {/* Vertical Path Line */}
          <div
            className="d-none d-md-block"
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 3,
              background: "linear-gradient(#FFD600 0%, #e57368 100%)",
              borderRadius: 2,
              zIndex: 0,
            }}
          />

          {/* Step 1: Intro (Left) */}
          <div className="row mb-5 align-items-center" style={{ position: "relative", zIndex: 1 }}>
            <div className="col-md-6 order-2 order-md-1 text-md-end text-center">
              <div style={{ display: "inline-block", maxWidth: 420 }}>
                <h4 className="fw-semibold mb-2" style={{ color: "#e57368" }}>Who We Are</h4>
                <p style={{ fontSize: 16, color: "#23272f" }}>
                  <strong>YatraNow</strong> is dedicated to making your travel experience smooth, safe, and affordable. We focus on <b>pre-cab booking</b> so you can plan your journey in advance and avoid last-minute hassles. Our platform is simple, transparent, and designed for everyone.
                </p>
              </div>
            </div>
            <div className="col-md-6 order-1 order-md-2 text-center mb-4 mb-md-0">
              <span
                style={{
                  display: "inline-block",
                  background: "#FFD60022",
                  borderRadius: "50%",
                  width: 70,
                  height: 70,
                  lineHeight: "70px",
                  fontSize: 34,
                  color: "#e57368",
                }}
              >
                <i className="bi bi-emoji-smile" />
              </span>
            </div>
          </div>

          {/* Step 2: Why Pre-Cab Booking (Right) */}
          <div className="row mb-5 align-items-center flex-md-row-reverse" style={{ position: "relative", zIndex: 1 }}>
            <div className="col-md-6 text-md-start text-center">
              <div style={{ display: "inline-block", maxWidth: 420 }}>
                <h4 className="fw-semibold mb-2" style={{ color: "#e57368" }}>Why Pre-Cab Booking?</h4>
                <ul style={{ fontSize: 15, color: "#23272f", lineHeight: 2, paddingLeft: 20, marginBottom: 0 }}>
                  <li><b>Peace of Mind:</b> Your cab is reserved and ready when you need it.</li>
                  <li><b>No Surprises:</b> Transparent pricing, no surge or hidden charges.</li>
                  <li><b>Reliable Service:</b> Verified drivers and punctual pickups.</li>
                  <li><b>Time Saving:</b> Skip the wait and start your journey on time.</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6 text-center mb-4 mb-md-0">
              <span
                style={{
                  display: "inline-block",
                  background: "#e5736822",
                  borderRadius: "50%",
                  width: 70,
                  height: 70,
                  lineHeight: "70px",
                  fontSize: 34,
                  color: "#FFD600",
                }}
              >
                <i className="bi bi-calendar-check" />
              </span>
            </div>
          </div>

          {/* Step 3: How It Works (Left) */}
          <div className="row mb-5 align-items-center" style={{ position: "relative", zIndex: 1 }}>
            <div className="col-md-6 order-2 order-md-1 text-md-end text-center">
              <div style={{ display: "inline-block", maxWidth: 420 }}>
                <h4 className="fw-semibold mb-2" style={{ color: "#e57368" }}>How It Works</h4>
                <ol style={{ fontSize: 15, color: "#23272f", lineHeight: 2, paddingLeft: 20, marginBottom: 0 }}>
                  <li>Enter your pickup & drop details, date, and time.</li>
                  <li>Compare available cabs and select your ride.</li>
                  <li>Book and pay securely online.</li>
                  <li>Get instant confirmation and driver details.</li>
                  <li>Enjoy a safe, comfortable journey.</li>
                </ol>
              </div>
            </div>
            <div className="col-md-6 order-1 order-md-2 text-center mb-4 mb-md-0">
              <span
                style={{
                  display: "inline-block",
                  background: "#FFD60022",
                  borderRadius: "50%",
                  width: 70,
                  height: 70,
                  lineHeight: "70px",
                  fontSize: 34,
                  color: "#e57368",
                }}
              >
                <i className="bi bi-geo-alt" />
              </span>
            </div>
          </div>

          {/* Step 4: Our Promise (Right) */}
          <div className="row mb-5 align-items-center flex-md-row-reverse" style={{ position: "relative", zIndex: 1 }}>
            <div className="col-md-6 text-md-start text-center">
              <div style={{ display: "inline-block", maxWidth: 420 }}>
                <h4 className="fw-semibold mb-2" style={{ color: "#e57368" }}>Our Promise</h4>
                <p style={{ fontSize: 15, color: "#23272f" }}>
                  We are committed to providing a seamless booking experience, professional drivers, and customer support that cares. Whether it’s an airport transfer, business trip, or family outing, YatraNow is your reliable travel partner.
                </p>
              </div>
            </div>
            <div className="col-md-6 text-center mb-4 mb-md-0">
              <span
                style={{
                  display: "inline-block",
                  background: "#e5736822",
                  borderRadius: "50%",
                  width: 70,
                  height: 70,
                  lineHeight: "70px",
                  fontSize: 34,
                  color: "#FFD600",
                }}
              >
                <i className="bi bi-shield-check" />
              </span>
            </div>
          </div>

          {/* Step 5: Contact (Left) */}
          <div className="row align-items-center" style={{ position: "relative", zIndex: 1 }}>
            <div className="col-md-6 order-2 order-md-1 text-md-end text-center">
              <div style={{ display: "inline-block", maxWidth: 420 }}>
                <h5 className="fw-semibold mb-2" style={{ color: "#e57368" }}>Contact Us</h5>
                <div style={{ fontSize: 15, color: "#23272f" }}>
                  <div>
                    <i className="bi bi-envelope-fill me-2" style={{ color: "#FFD600" }} />
                    <a href="mailto:support@yatranow.com" className="text-decoration-none text-muted">
                      support@yatranow.com
                    </a>
                  </div>
                  <div>
                    <i className="bi bi-telephone-fill me-2" style={{ color: "#FFD600" }} />
                    <a href="tel:+919140251119" className="text-decoration-none text-muted">
                      +91-9140251119
                    </a>
                  </div>
                  <div>
                    <i className="bi bi-geo-alt-fill me-2" style={{ color: "#FFD600" }} />
                    Varanasi, Uttar Pradesh, India
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 order-1 order-md-2 text-center mb-4 mb-md-0">
              <span
                style={{
                  display: "inline-block",
                  background: "#FFD60022",
                  borderRadius: "50%",
                  width: 70,
                  height: 70,
                  lineHeight: "70px",
                  fontSize: 34,
                  color: "#e57368",
                }}
              >
                <i className="bi bi-chat-dots" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default AboutUs;