import React from "react";

const CancellationPolicyContent = ({ small }) => (
  <section style={{ maxWidth: 700, margin: 0 }}>
    <ul style={{ fontSize: small ? 13 : 15, color: "#23272f", lineHeight: 1.7, paddingLeft: 18 }}>
      <li>
        <strong>Free Cancellation:</strong> You can cancel your booking for free up to 1 hour before the scheduled pickup time.
      </li>
      <li>
        <strong>Token Amount Non-Refundable:</strong> If you cancel the booking, the token amount paid will <span style={{ color: "#e57368", fontWeight: 600 }}>not be refunded</span> as it includes platform and basic charges.
      </li>
      <li>
        <strong>Refunds:</strong> Any eligible refunds will be processed to your original payment method within 5-7 business days.
      </li>
      <li>
        <strong>How to Cancel:</strong> You can cancel your booking from your profile page or by contacting our support team at <a href="mailto:support@yatranow.com">support@yatranow.com</a> or <a href="tel:+919140251119">+91-9140251119</a>.
      </li>
      <li>
        <strong>Special Cases:</strong> In case of unavoidable circumstances (like natural calamities), cancellation charges may be waived at the company’s discretion.
      </li>
    </ul>
    <div className="alert alert-info mt-4" style={{ fontSize: small ? 12 : 14 }}>
      For any questions or assistance with cancellations, please contact our 24x7 support team.
    </div>
  </section>
);

export default CancellationPolicyContent;