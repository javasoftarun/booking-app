import React from "react";

const TermsAndConditionsContent = ({ small }) => (
  <section style={{ maxWidth: 700, margin: 0 }}>
    <ul style={{ fontSize: small ? 13 : 15, color: "#23272f", lineHeight: 1.7, paddingLeft: 18 }}>
      <li>
        <strong>Acceptance:</strong> By booking with YatraNow, you agree to abide by all terms and conditions outlined here and on our website.
      </li>
      <li>
        <strong>Booking:</strong> All bookings are subject to availability and confirmation. Providing accurate information is your responsibility.
      </li>
      <li>
        <strong>Payment:</strong> Full or partial payment may be required at the time of booking. Token amounts are non-refundable.
      </li>
      <li>
        <strong>Changes & Cancellations:</strong> Changes or cancellations are governed by our <span style={{ color: "#e57368", fontWeight: 600 }}>Cancellation Policy</span> and may incur charges.
      </li>
      <li>
        <strong>Conduct:</strong> Any unlawful, abusive, or disruptive behavior may result in booking cancellation without refund.
      </li>
      <li>
        <strong>Liability:</strong> YatraNow is not liable for delays, losses, or damages due to circumstances beyond our control (e.g., weather, strikes, accidents).
      </li>
      <li>
        <strong>Privacy:</strong> Your data is handled as per our <a href="https://www.yatranow.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#e57368", fontWeight: 600 }}>Privacy Policy</a>.
      </li>
      <li>
        <strong>Support:</strong> For any queries, contact <a href="mailto:support@yatranow.com">support@yatranow.com</a> or <a href="tel:+919140251119">+91-9140251119</a>.
      </li>
    </ul>
    <div className="alert alert-info mt-4" style={{ fontSize: small ? 12 : 14 }}>
      Please read all terms carefully before booking. YatraNow reserves the right to update these terms at any time.
    </div>
  </section>
);

export default TermsAndConditionsContent;