import React, { useState } from "react";

const faqs = [
  {
    q: "How do I book a cab?",
    a: "Just fill the form above and click Search. Choose your cab and confirm your booking."
  },
  {
    q: "Can I book for outstation?",
    a: "Yes, you can book both local and outstation cabs with Bhada24."
  },
  {
    q: "How do I pay?",
    a: "You can pay online or directly to the driver after your ride."
  },
  {
    q: "Can I modify or cancel my booking?",
    a: "Yes, you can modify or cancel your booking from your profile or by contacting our support team. Cancellation charges may apply as per our policy."
  },
  {
    q: "What if my driver is late?",
    a: "We strive for punctuality. In case of any delay, you will be notified and our support team will assist you immediately."
  },
  {
    q: "Are your drivers verified?",
    a: "All our drivers are background-checked, verified, and trained for your safety."
  },
  {
    q: "How do I contact customer support?",
    a: "You can reach us 24/7 via the Contact option in the footer, email at support@bhada24.com, or call +91-9140251119."
  },
  {
    q: "Is there a refund policy?",
    a: "Yes, refunds are processed as per our refund policy. Please refer to the Refund Policy link in the footer for details."
  }
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = idx => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="container my-5">
      <h3 className="fw-bold mb-4 text-center">Frequently Asked Questions</h3>
      <div className="accordion" id="faqAccordion">
        {faqs.map((faq, idx) => (
          <div className="accordion-item" key={idx}>
            <h2 className="accordion-header" id={`heading${idx}`}>
              <button
                className={`accordion-button${openIndex === idx ? "" : " collapsed"}`}
                type="button"
                onClick={() => handleToggle(idx)}
                aria-expanded={openIndex === idx}
                aria-controls={`collapse${idx}`}
              >
                {faq.q}
              </button>
            </h2>
            <div
              id={`collapse${idx}`}
              className={`accordion-collapse collapse${openIndex === idx ? " show" : ""}`}
              aria-labelledby={`heading${idx}`}
            >
              <div
                className="accordion-body"
                style={{
                  background: "#f8fafd",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px #00b8ff11",
                  color: "#23272f",
                  fontSize: 16,
                  padding: "1.2rem 1.5rem",
                  margin: "0.5rem 0"
                }}
              >
                <i className="bi bi-info-circle-fill me-2" style={{ color: "#1976d2", fontSize: 18, verticalAlign: "middle" }} />
                <span style={{ fontWeight: 500 }}>{faq.a}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;