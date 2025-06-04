import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PlacesAutocomplete from 'react-places-autocomplete';
import API_ENDPOINTS from '../config/apiConfig';
import FaqSection from '../components/FaqSection';

// Dummy data for offers, why choose, and FAQs
const offers = [
  { title: "Flat 10% Off", desc: "On your first ride with YatraNow. Use code: FIRST10" },
  { title: "Refer & Earn", desc: "Invite friends and earn ride credits." }
];

const whyChoose = [
  { icon: "bi-shield-check", title: "Safe & Secure", desc: "Verified drivers and sanitized cabs." },
  { icon: "bi-currency-rupee", title: "Best Prices", desc: "Transparent fares, no hidden charges." },
  { icon: "bi-clock-history", title: "24x7 Support", desc: "We are here for you anytime." }
];

const weddingImg = "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80";
const djImg = "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80";
const transportImg = "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=400&q=80";
const lightingImg = "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    pickup: initialPickup = '',
    drop: initialDrop = '',
    datetime: initialDatetime = '',
    hours: initialHours = ''
  } = (location.state && location.state.editData) || location.state || {};

  const [pickup, setPickup] = useState(initialPickup);
  const [drop, setDrop] = useState(initialDrop);
  const [datetime, setDatetime] = useState(initialDatetime);
  const [hours, setHours] = useState(initialHours);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.editData) {
      const { pickup, drop, datetime, hours } = location.state.editData;
      if (pickup) setPickup(pickup);
      if (drop) setDrop(drop);
      if (datetime) setDatetime(datetime);
      if (hours) setHours(hours);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const pickupDate = new Date(datetime);
      const dropDate = new Date(pickupDate.getTime() + Number(hours) * 60 * 60 * 1000);

      // --- Fix: Format as local time string, not UTC ---
      const pad = n => n.toString().padStart(2, '0');
      const formatLocal = d =>
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`; // <-- add :00 for seconds

      const pickupDateStr = formatLocal(pickupDate);
      const dropDateStr = formatLocal(dropDate);

      const requestBody = {
        pickupLocation: pickup,
        dropLocation: drop,
        pickupDateTime: pickupDateStr,
        dropDateTime: dropDateStr,
        radius: 15
      };

      const response = await fetch(API_ENDPOINTS.SEARCH_AVAILABLE_CABS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      setLoading(false);
      navigate('/cabs', { state: { cabs: data.responseData, pickup, drop, datetime, hours } });
    } catch (err) {
      setLoading(false);
      alert('Failed to fetch cabs. Please try again.');
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-form-section">
        <img
          src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80"
          alt="Banner"
          className="hero-banner-bg"
        />
        <div className="hero-banner-overlay"></div>
        <div className="container hero-form-content">
          <div className="text-center mb-4">
            <h1 className="hero-title-main">
              Book Your Cab <span className="red">Anywhere</span> <span className="yellow">Anytime</span>
            </h1>
            <div className="hero-desc">
              Fast, <span className="yellow">safe</span>, and <span className="red">affordable</span> rides at your fingertips.
            </div>
          </div>
          <div className="hero-form-card">
            <div className="hero-form-title">
              <i className="bi bi-taxi-front-fill" style={{ color: "#FFD600", fontSize: 32, verticalAlign: "middle" }} />
              Cabs Booking
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="row g-3 align-items-end">
                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold text-secondary">From</label>
                  <PlacesAutocomplete value={pickup} onChange={setPickup} onSelect={setPickup}>
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div style={{ position: 'relative', width: '100%' }}>
                        <input
                          {...getInputProps({
                            placeholder: 'Pickup Location',
                            className: 'form-control fw-bold',
                            required: true,
                          })}
                        />
                        {suggestions.length > 0 && (
                          <div className="position-absolute w-100 bg-white rounded shadow" style={{ zIndex: 1000, top: '100%' }}>
                            {loading && <div className="p-2 text-muted">Loading...</div>}
                            {suggestions.map((suggestion, idx) => (
                              <div
                                {...getSuggestionItemProps(suggestion, {
                                  className: "p-2",
                                  style: {
                                    cursor: "pointer",
                                    background: suggestion.active ? "#fffbe7" : "#fff",
                                    fontWeight: suggestion.active ? 600 : 400,
                                  }
                                })}
                                key={suggestion.placeId}
                              >
                                <i className="bi bi-geo-alt-fill text-warning me-2" />
                                {suggestion.description}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold text-secondary">To</label>
                  <PlacesAutocomplete value={drop} onChange={setDrop} onSelect={setDrop}>
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                      <div style={{ position: 'relative', width: '100%' }}>
                        <input
                          {...getInputProps({
                            placeholder: 'Drop Location',
                            className: 'form-control fw-bold',
                            required: true,
                          })}
                        />
                        {suggestions.length > 0 && (
                          <div className="position-absolute w-100 bg-white rounded shadow" style={{ zIndex: 1000, top: '100%' }}>
                            {loading && <div className="p-2 text-muted">Loading...</div>}
                            {suggestions.map((suggestion, idx) => (
                              <div
                                {...getSuggestionItemProps(suggestion, {
                                  className: "p-2",
                                  style: {
                                    cursor: "pointer",
                                    background: suggestion.active ? "#fffbe7" : "#fff",
                                    fontWeight: suggestion.active ? 600 : 400,
                                  }
                                })}
                                key={suggestion.placeId}
                              >
                                <i className="bi bi-geo-alt-fill text-warning me-2" />
                                {suggestion.description}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label fw-semibold text-secondary">Pickup Date</label>
                  <input
                    type="date"
                    className="form-control fw-bold"
                    value={datetime ? datetime.split('T')[0] : ''}
                    onChange={e => {
                      const date = e.target.value;
                      let time = "09:00";
                      if (datetime && datetime.includes("T") && datetime.split("T")[1]) {
                        time = datetime.split("T")[1].slice(0, 5);
                      }
                      setDatetime(date ? `${date}T${time}` : "");
                    }}
                    required
                  />
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label fw-semibold text-secondary">Pickup Time</label>
                  <input
                    type="time"
                    className="form-control fw-bold"
                    value={datetime && datetime.includes('T') ? datetime.split('T')[1]?.slice(0, 5) || '' : ''}
                    onChange={e => {
                      let date = datetime ? datetime.split('T')[0] : '';
                      setDatetime(date && e.target.value ? `${date}T${e.target.value}` : '');
                    }}
                    required
                  />
                </div>
                <div className="col-6 col-md-1">
                  <label className="form-label fw-semibold text-secondary">Travel Time</label>
                  <select
                    className="form-select fw-bold"
                    value={hours}
                    onChange={e => setHours(e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="3">3 Hours</option>
                    <option value="6">6 Hours</option>
                    <option value="9">9 Hours</option>
                    <option value="12">12 Hours</option>
                    <option value="24">1 Day</option>
                    <option value="48">2 Days</option>
                  </select>
                </div>
                <div className="col-6 col-md-1 d-grid">
                  <button
                    type="submit"
                    className="btn btn-yellow fw-bold"
                    disabled={loading}
                    style={{ minHeight: 40 }}
                  >
                    {loading ? 'Searching...' : <>Search <i className="bi bi-arrow-right ms-2"></i></>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="container my-5">
        <h3 className="fw-bold mb-4 text-center" style={{ color: "#d32f2f" }}>Why Choose YatraNow?</h3>
        <div className="row g-4 justify-content-center">
          {whyChoose.map((item, idx) => (
            <div key={idx} className="col-md-4">
              <div className="card-grid-item text-center p-4 h-100 shadow-sm rounded-4">
                <i className={`bi ${item.icon} text-warning mb-2`} style={{ fontSize: 40 }}></i>
                <div className="fw-bold mt-2" style={{ fontSize: 20 }}>{item.title}</div>
                <div className="text-secondary">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXCITING OFFERS SECTION */}
      <section className="container-fluid my-5" style={{
        borderRadius: 18, padding: "48px 0"
      }}>
        <div className="container">
          <h3 className="fw-bold mb-4 text-center" style={{ color: "#d32f2f", fontSize: 30 }}>
            Limited Time Offers!
          </h3>
          <div className="row g-4 justify-content-center">
            {offers.map((offer, idx) => (
              <div key={idx} className="col-md-5">
                <div className="d-flex align-items-center gap-3 p-4 rounded-4 shadow-sm bg-white">
                  <div className="d-flex align-items-center justify-content-center rounded-circle" style={{
                    width: 56, height: 56, background: "#fffbe7", flexShrink: 0
                  }}>
                    <i className="bi bi-gift-fill" style={{ color: "#FFD600", fontSize: 32 }}></i>
                  </div>
                  <div>
                    <div className="fw-bold mb-1" style={{ color: "#e57368", fontSize: 20 }}>
                      {offer.title}
                    </div>
                    <div className="text-secondary" style={{ fontSize: 16 }}>{offer.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE CATEGORIES */}
      <section className="container my-5">
        <h3 className="fw-bold mb-4 text-center" style={{ color: "#d32f2f" }}>Our Popular Services</h3>
        <div className="row g-4">
          <div className="col-md-3 col-6">
            <div className="card-grid-item text-center p-3 h-100">
              <img
                src={transportImg}
                alt="Transporters"
                className="img-fluid rounded-3 mb-3"
                style={{ height: 160, width: "100%", objectFit: "cover", maxWidth: 240 }}
              />
              <div className="fw-bold mt-2">Transporters</div>
              <div className="text-secondary">Book trucks, mini-trucks, and more for your goods and wedding logistics.</div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card-grid-item text-center p-3 h-100">
              <img
                src={djImg}
                alt="DJ & Sound"
                className="img-fluid rounded-3 mb-3"
                style={{ height: 160, width: "100%", objectFit: "cover", maxWidth: 240 }}
              />
              <div className="fw-bold mt-2">DJ & Sound</div>
              <div className="text-secondary">Hire professional DJs and sound systems for your events and parties.</div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card-grid-item text-center p-3 h-100">
              <img
                src={lightingImg}
                alt="Roadlights"
                className="img-fluid rounded-3 mb-3"
                style={{ height: 160, width: "100%", objectFit: "cover", maxWidth: 240 }}
              />
              <div className="fw-bold mt-2">Roadlights</div>
              <div className="text-secondary">Decorative roadlights and lighting solutions for weddings and functions.</div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card-grid-item text-center p-3 h-100">
              <img
                src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
                alt="Cabs & Taxis"
                className="img-fluid rounded-3 mb-3"
                style={{ height: 160, width: "100%", objectFit: "cover", maxWidth: 240 }}
              />
              <div className="fw-bold mt-2">Cabs & Taxis</div>
              <div className="text-secondary">Book safe, reliable cabs for local, outstation, and event travel.</div>
            </div>
          </div>
        </div>
      </section>

      {/* WEDDINGS & EVENTS SECTION */}
      <section className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src={weddingImg}
              alt="Wedding & Event Services"
              className="img-fluid rounded-4 shadow-sm"
              style={{ width: "100%", maxHeight: 340, objectFit: "cover" }}
            />
          </div>
          <div className="col-md-6">
            <h3 className="fw-bold mb-3" style={{ color: "#d32f2f" }}>
              Your One-Stop Solution for Weddings & Events
            </h3>
            <p style={{ fontSize: 17, color: "#23272f" }}>
              YatraNow is not just for cabs! We help you book <b>transporters</b> for goods, <b>DJs</b> for parties, <b>roadlights</b> for weddings, and much more.
              <br /><br />
              <span style={{ color: "#FFD600" }}>This Saadi (wedding) season</span>, get exclusive offers on all event essentials. Make your celebrations grand and hassle-free with our trusted partners.
            </p>
            <ul style={{ fontSize: 16, color: "#1976d2" }}>
              <li>Book cabs for guests and family</li>
              <li>Hire transporters for wedding logistics</li>
              <li>Get the best DJs for your party</li>
              <li>Arrange decorative roadlights and more</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SPECIAL WEDDING OFFERS */}
      <section className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-7">
            <h3 className="fw-bold mb-3" style={{ color: "#FFD600" }}>Special Offers for Wedding Season!</h3>
            <ul style={{ fontSize: 17, color: "#23272f" }}>
              <li>Bulk cab booking discounts for wedding guests</li>
              <li>Combo deals on DJ + Lighting + Transport</li>
              <li>Early bird offers for advance bookings</li>
              <li>24x7 event support for seamless celebrations</li>
            </ul>
            <div className="alert alert-warning mt-3" style={{ fontSize: 15 }}>
              <i className="bi bi-gift-fill me-2" />
              <b>Contact us</b> for custom packages and best rates for your event!
            </div>
          </div>
          <div className="col-md-5 text-center">
            <img
              src={weddingImg}
              alt="Wedding Offers"
              className="img-fluid rounded-4 shadow-sm"
              style={{ maxHeight: 220, objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="container my-5">
        <h3 className="fw-bold mb-4 text-center" style={{ color: "#1976d2" }}>What Our Customers Say</h3>
        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div className="p-4 bg-white rounded-4 shadow-sm h-100">
              <div className="mb-2">
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
              </div>
              <div className="text-secondary mb-2">
                "YatraNow made our wedding transport so easy! The cabs were on time and the drivers were very professional."
              </div>
              <div className="fw-bold">- Priya S., Lucknow</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-white rounded-4 shadow-sm h-100">
              <div className="mb-2">
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-fill text-warning"></i>
                <i className="bi bi-star-half text-warning"></i>
              </div>
              <div className="text-secondary mb-2">
                "Booked DJ and lighting for my brother's wedding. Great service and best rates in town!"
              </div>
              <div className="fw-bold">- Aman K., Kanpur</div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="container my-5">
        <div className="p-4 bg-white rounded-4 text-center shadow-sm">
          <h4 className="fw-bold mb-2" style={{ color: "#d32f2f" }}>
            Ready to make your event hassle-free?
          </h4>
          <div style={{ fontSize: 18 }}>
            <span>Contact our team for a free consultation and best offers!</span>
          </div>
          <a href="/contact" className="btn btn-danger fw-bold mt-3 px-4 py-2">
            Get in Touch
          </a>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="container my-5">
        <h3 className="fw-bold mb-4 text-center" style={{ color: "#1976d2" }}>How YatraNow Works</h3>
        <div className="row text-center">
          <div className="col-md-4">
            <i className="bi bi-search" style={{ fontSize: 40, color: "#FFD600" }}></i>
            <h5 className="fw-bold mt-2">Search & Compare</h5>
            <p className="text-secondary">Find the best cabs and services instantly.</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-cash-coin" style={{ fontSize: 40, color: "#FFD600" }}></i>
            <h5 className="fw-bold mt-2">Book & Pay</h5>
            <p className="text-secondary">Easy booking and secure payments.</p>
          </div>
          <div className="col-md-4">
            <i className="bi bi-emoji-smile" style={{ fontSize: 40, color: "#FFD600" }}></i>
            <h5 className="fw-bold mt-2">Enjoy Your Ride</h5>
            <p className="text-secondary">Relax and enjoy your journey.</p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <FaqSection />

      {/* WEDDINGS & EVENTS PROMO SECTION */}
      <section className="container my-5">
        <div className="row align-items-center">
          <div className="col-md-6">
            <img src={weddingImg} alt="Weddings" className="img-fluid rounded-4 shadow-sm" />
          </div>
          <div className="col-md-6">
            <h3 className="fw-bold mb-3" style={{ color: "#d32f2f" }}>Make Every Event Memorable</h3>
            <p style={{ fontSize: 17 }}>
              From cabs for guests to DJs and decorative lighting, YatraNow is your event partner.
              <br /><br />
              <span style={{ color: "#FFD600" }}>Book everything in one place and focus on your celebration!</span>
            </p>
            <ul style={{ fontSize: 16, color: "#1976d2" }}>
              <li>Easy event logistics</li>
              <li>Exclusive wedding deals</li>
              <li>Trusted local partners</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;