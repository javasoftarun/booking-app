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
      {/* Booking Form Hero Section */}
      <section className="hero-form-section">
        <div className="hero-form-card">
          <div className="hero-form-title">
            <i className="bi bi-taxi-front-fill me-2" style={{ color: "#FFD600", fontSize: 32, verticalAlign: "middle" }} />
            Cabs
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
      </section>

      {/* Horizontal Steps */}
      <section className="container my-5">
        <h3 className="fw-bold mb-4 text-center">How YatraNow Works</h3>
        <div className="steps-horizontal">
          <div className="step-h">
            <div className="step-h-icon"><i className="bi bi-search"></i></div>
            <div className="fw-bold">Search & Compare</div>
            <div className="text-secondary">Enter your route and compare the best cabs instantly.</div>
          </div>
          <div className="step-h">
            <div className="step-h-icon"><i className="bi bi-cash-coin"></i></div>
            <div className="fw-bold">Book & Pay</div>
            <div className="text-secondary">Book your cab in seconds and pay securely online.</div>
          </div>
          <div className="step-h">
            <div className="step-h-icon"><i className="bi bi-emoji-smile"></i></div>
            <div className="fw-bold">Enjoy Your Ride</div>
            <div className="text-secondary">Sit back, relax, and enjoy a safe, comfortable journey.</div>
          </div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="container my-5">
        <h3 className="fw-bold mb-4 text-center">Exciting Offers</h3>
        <div className="card-grid">
          {offers.map((offer, idx) => (
            <div key={idx} className="card-grid-item">
              <div className="fw-bold text-warning mb-2 d-flex align-items-center gap-2" style={{ fontSize: 20 }}>
                <i className="bi bi-gift-fill" style={{ color: "#FFD600", fontSize: 22 }}></i>
                {offer.title}
              </div>
              <div className="text-secondary" style={{ fontSize: 16 }}>{offer.desc}</div>
              <span className="card-badge">OFFER</span>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose YatraNow Section */}
      <section className="container my-5">
        <h3 className="fw-bold mb-4 text-center">Why Choose YatraNow?</h3>
        <div className="card-grid">
          {whyChoose.map((item, idx) => (
            <div key={idx} className="card-grid-item text-center">
              <i className={`bi ${item.icon} text-warning mb-2`} style={{ fontSize: 32 }}></i>
              <div className="fw-bold mt-2">{item.title}</div>
              <div className="text-secondary">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />
    </>
  );
};

export default Home;