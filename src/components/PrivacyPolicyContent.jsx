import React from "react";

const PrivacyPolicyContent = ({ small }) => (
  <section style={{ maxWidth: 700, margin: 0 }}>
    <ul style={{ fontSize: small ? 13 : 15, color: "#23272f", lineHeight: 1.7, paddingLeft: 18 }}>
      <li>
        <strong>Information Collection:</strong> We collect only necessary personal information for booking and support purposes.
      </li>
      <li>
        <strong>Usage:</strong> Your data is used to process bookings, provide support, and improve our services. We do not sell your data.
      </li>
      <li>
        <strong>Security:</strong> We use industry-standard measures to protect your information from unauthorized access.
      </li>
      <li>
        <strong>Sharing:</strong> Your data may be shared with service partners only as required to fulfill your booking.
      </li>
      <li>
        <strong>Cookies:</strong> Our website uses cookies to enhance your experience. You can manage cookie preferences in your browser.
      </li>
      <li>
        <strong>Third-Party Links:</strong> We are not responsible for the privacy practices of external sites linked from our platform.
      </li>
      <li>
        <strong>Contact:</strong> For privacy questions, email <a href="mailto:support@bhada24.com">support@bhada24.com</a> or call <a href="tel:+919140251119">+91-9140251119</a>.
      </li>
    </ul>
    <div className="alert alert-info mt-4" style={{ fontSize: small ? 12 : 14 }}>
      By using Bhada24, you agree to this privacy policy. We may update this policy; please review it regularly.
    </div>
  </section>
);

export default PrivacyPolicyContent;