import React from "react";

const RefundPolicyContent = ({ small }) => (
  <section style={{ maxWidth: 700, margin: 0 }}>
    <ul style={{ fontSize: small ? 13 : 15, color: "#23272f", lineHeight: 1.7, paddingLeft: 18 }}>
      <li>
        <strong>Eligibility:</strong> Refunds are applicable only for eligible cancellations as per our <span style={{ color: "#e57368", fontWeight: 600 }}>Cancellation Policy</span>.
      </li>
      <li>
        <strong>Token Amount:</strong> The token amount paid during booking is <span style={{ color: "#e57368", fontWeight: 600 }}>non-refundable</span> as it covers platform and basic charges.
      </li>
      <li>
        <strong>Processing Time:</strong> Approved refunds will be processed to your original payment method within <b>5-7 business days</b>.
      </li>
      <li>
        <strong>Mode of Refund:</strong> Refunds are credited to the same account/card/wallet used for payment.
      </li>
      <li>
        <strong>Partial Refunds:</strong> If only a part of your booking is eligible for refund, the amount will be calculated accordingly.
      </li>
      <li>
        <strong>Contact Support:</strong> For any refund-related queries, email <a href="mailto:support@bhada24.com">support@bhada24.com</a> or call <a href="tel:+919140251119">+91-9140251119</a>.
      </li>
    </ul>
    <div className="alert alert-info mt-4" style={{ fontSize: small ? 12 : 14 }}>
      For more details or assistance, please contact our 24x7 support team.
    </div>
  </section>
);

const RefundPolicyModal = ({ show, onClose }) => {
  const isMobile = window.innerWidth < 600;
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      tabIndex={-1}
      style={{
        display: "flex",
        alignItems: isMobile ? "flex-end" : "center",
        justifyContent: "center",
        zIndex: 3000,
        position: "fixed",
        inset: 0,
        background: "rgba(36, 41, 46, 0.18)",
        padding: 0,
      }}
      onClick={onClose}
    >
      {/* Blur overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />
      <div
        className="modal-dialog"
        style={{
          maxWidth: isMobile ? 360 : 420,
          width: "98vw",
          margin: isMobile ? "0 0 1.5rem 0" : "2.5rem auto",
          borderRadius: isMobile ? 14 : 18,
          background: "transparent",
          zIndex: 2,
          boxShadow: isMobile ? "0 -2px 24px #e5736822" : "0 8px 32px #e5736822, 0 2px 8px #FFD60033",
          overflow: "visible",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="modal-content"
          style={{
            border: "none",
            boxShadow: isMobile ? "0 2px 12px #00b8ff11" : "0 8px 32px #e5736822, 0 2px 8px #FFD60033",
            padding: 0,
            overflow: "visible",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: isMobile ? "auto" : "auto",
              maxHeight: isMobile ? "80vh" : "80vh",
            }}
          >
            <div
              className="modal-header"
              style={{
                background: "linear-gradient(90deg, #e3f6ff 60%, #fffbe7 100%)",
                borderBottom: "1px solid #f3e9e7",
                padding: isMobile ? "0.8rem 1rem 0.8rem 1rem" : "1.1rem 1.5rem",
                alignItems: "center",
                boxShadow: "0 2px 12px #00b8ff08",
                position: isMobile ? "sticky" : "static",
                top: 0,
                zIndex: 10,
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? 20 : 24,
                  marginRight: 10,
                  color: "#e57368",
                  verticalAlign: "middle",
                  display: "flex",
                  alignItems: "center",
                }}
                role="img"
                aria-label="refund"
              >
                <i className="bi bi-cash-coin" style={{ color: "#FFD600" }} />
              </span>
              <h5
                className="modal-title"
                style={{
                  color: "#e57368",
                  fontWeight: 700,
                  fontSize: isMobile ? 15 : 18,
                  margin: 0,
                  flex: 1,
                  letterSpacing: 0.5,
                }}
              >
                Refund Policy
              </h5>
              <button
                type="button"
                className="btn-close"
                style={{ marginLeft: 8, scale: isMobile ? "0.9" : "1" }}
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div
              className="modal-body"
              style={{
                padding: isMobile ? "0.8rem 1rem" : "1.2rem 1.3rem",
                background: "transparent",
                fontSize: isMobile ? 13 : 15,
              }}
            >
              <RefundPolicyContent small />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyModal;