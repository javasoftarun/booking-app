import React, { useState } from "react";
import API_ENDPOINTS from "../config/apiConfig";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(API_ENDPOINTS.INSER_USER_QUERY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (data.responseMessage === "success") {
      setSubmitted(true);
      // Optionally, you can clear the form here
      // setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } else {
      alert("Something went wrong. Please try again.");
    }
  } catch (error) {
    alert("Failed to send message. Please try again later.");
  }
};

  return (
    <section className="container my-5 mb-0">
      <div className="row g-4">
        <div className="col-lg-7">
          <h2 className="fw-bold mb-3" style={{ color: "#d32f2f" }}>Contact Us</h2>
          <p>
            Have questions, need a custom quote, or want to partner with Bhada24? Fill out the form below and our team will get back to you within 24 hours.
          </p>
          {submitted ? (
            <div className="alert alert-success mt-4">
              Thank you for contacting us! We will get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10,}"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Message</label>
                  <textarea
                    className="form-control"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 d-grid">
                  <button type="submit" className="btn btn-danger fw-bold">
                    Send Message
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
        <div className="col-lg-5">
          <div className="bg-white rounded-4 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-3" style={{ color: "#1976d2" }}>Our Contact Details</h5>
            <p className="mb-2">
              <i className="bi bi-telephone-fill me-2 text-warning"></i>
              <b>Phone:</b> <a href="tel:+919140251119">+91 9140251119</a>
            </p>
            <p className="mb-2">
              <i className="bi bi-envelope-fill me-2 text-warning"></i>
              <b>Email:</b> <a href="mailto:support@bhada24.com">support@bhada24.com</a>
            </p>
            <p className="mb-2">
              <i className="bi bi-geo-alt-fill me-2 text-warning"></i>
              <b>Address:</b> 123, Main Road, Varanasi, Uttar Pradesh, India
            </p>
            <hr />
            <h6 className="fw-bold mb-2" style={{ color: "#d32f2f" }}>Business Hours</h6>
            <ul className="list-unstyled mb-3">
              <li>Monday - Saturday: 8:00 AM - 10:00 PM</li>
              <li>Sunday: 9:00 AM - 6:00 PM</li>
            </ul>
            <h6 className="fw-bold mb-2" style={{ color: "#d32f2f" }}>Follow Us</h6>
            <div>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="me-3 text-decoration-none">
                <i className="bi bi-facebook" style={{ fontSize: 22, color: "#1976d2" }}></i>
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="me-3 text-decoration-none">
                <i className="bi bi-instagram" style={{ fontSize: 22, color: "#d32f2f" }}></i>
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="me-3 text-decoration-none">
                <i className="bi bi-twitter-x" style={{ fontSize: 22, color: "#23272f" }}></i>
              </a>
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                <i className="bi bi-whatsapp" style={{ fontSize: 22, color: "#25D366" }}></i>
              </a>
            </div>
            <hr />
            <div>
              <b>Looking for a partnership or bulk booking?</b>
              <br />
              <span>Write to us at <a href="mailto:partners@bhada24.com">partners@bhada24.com</a></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;