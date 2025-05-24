import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PlacesAutocomplete from 'react-places-autocomplete';
import API_ENDPOINTS from '../config/apiConfig';

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

const faqs = [
  {
    q: "How do I book a cab?",
    a: "Just fill the form above and click Search. Choose your cab and confirm your booking."
  },
  {
    q: "Can I book for outstation?",
    a: "Yes, you can book both local and outstation cabs with YatraNow."
  },
  {
    q: "How do I pay?",
    a: "You can pay online or directly to the driver after your ride."
  }
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
    // eslint-disable-next-line
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const pickupDate = new Date(datetime);
      const dropDate = new Date(pickupDate.getTime() + Number(hours) * 60 * 60 * 1000);
      const pickupDateStr = pickupDate.toISOString().slice(0, 19);
      const dropDateStr = dropDate.toISOString().slice(0, 19);

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
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Banner with Form Overlay */}
      <div
        style={{
          width: '100%',
          height: 400,
          background: 'url(http://res.cloudinary.com/djapc6r8k/image/upload/v1747736624/faskzlf6gk46hgj8v8go.png) center/cover no-repeat',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 40,
        }}
      >
        {/* Booking Form Overlay */}
        <div
          className="shadow"
          style={{
            background: 'rgba(255,255,255,0.97)',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(60,60,120,0.13)',
            padding: '0 0 28px 0',
            maxWidth: 1300,
            width: '99%',
            position: 'relative',
            margin: '0 auto',
            border: '1.5px solid #e3e6ed',
            transition: 'box-shadow 0.2s'
          }}
        >
          {/* Only Cabs Tab */}
          <div className="d-flex align-items-center gap-3 px-3 pt-2 pb-1">
            <div className="d-flex flex-column align-items-center">
              <span className="mb-1 text-danger" style={{ fontSize: 24 }}>
                <i className="bi bi-taxi-front-fill"></i>
                <span className="fw-bold text-danger" style={{ fontSize: 16, letterSpacing: 1 }}> Cabs</span>
              </span>
              <span style={{
                width: 40,
                height: 3,
                borderRadius: 3,
                background: "#e57368",
                marginTop: 2,
                display: "block"
              }} />
            </div>
            <div className="ms-auto fw-bold d-none d-md-block" style={{ fontSize: 14, color: "#2d2d2d" }}>
              Book Cabs for Outstation & Local
            </div>
          </div>
          {/* Search Form */}
          <form onSubmit={handleSubmit}>
            <div
              className="d-flex flex-column flex-lg-row align-items-stretch gap-3 px-3"
              style={{
                background: "#f7f7f7",
                borderRadius: 18,
                boxShadow: "0 1px 8px #e3e6ed",
                padding: "12px 12px",
                margin: "0 10px",
                minHeight: 56,
                alignItems: "center"
              }}
            >
              {/* FROM */}
              <div className="flex-grow-1 d-flex flex-column justify-content-center border-end px-4 py-2" style={{ minWidth: 260 }}>
                <span className="text-uppercase fw-semibold text-secondary" style={{ fontSize: 12, letterSpacing: 1 }}>From</span>
                <PlacesAutocomplete value={pickup} onChange={setPickup} onSelect={setPickup}>
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input
                        {...getInputProps({
                          placeholder: 'Pickup Location',
                          className: 'form-control border-0 bg-transparent fw-bold p-0',
                          style: {
                            fontSize: 16,
                            outline: "none",
                            boxShadow: "none",
                            background: "transparent",
                            padding: 0,
                            height: 28,
                          },
                          required: true,
                        })}
                      />
                      {pickup && (
                        <div className="text-muted" style={{ fontSize: 11, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {pickup}
                        </div>
                      )}
                      {suggestions.length > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            zIndex: 1000,
                            width: '100%',
                            top: '100%',
                            left: 0,
                            fontSize: 15,
                            maxHeight: 220,
                            overflowY: 'auto',
                            background: '#fff',
                            border: '1.5px solid #e57368',
                            borderRadius: 12,
                            boxShadow: '0 8px 32px #e5736820',
                            marginTop: 6,
                            padding: 0,
                          }}
                        >
                          {loading && (
                            <div style={{ padding: "12px 18px", color: "#888", fontSize: 14 }}>
                              Loading...
                            </div>
                          )}
                          {suggestions.map((suggestion, idx) => {
                            const isLast = idx === suggestions.length - 1;
                            const style = {
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "12px 18px",
                              cursor: "pointer",
                              background: suggestion.active ? "#fff3f0" : "#fff",
                              color: "#23272f",
                              fontWeight: suggestion.active ? 600 : 400,
                              borderBottom: isLast ? "none" : "1px solid #f7e6e6",
                              transition: "background 0.15s",
                            };
                            return (
                              <div
                                {...getSuggestionItemProps(suggestion, { style })}
                                key={suggestion.placeId}
                              >
                                <i className="bi bi-geo-alt-fill text-danger" style={{ fontSize: 18, opacity: 0.85 }} />
                                <span style={{ flex: 1, fontSize: 15 }}>{suggestion.description}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>
              {/* TO */}
              <div className="flex-grow-1 d-flex flex-column justify-content-center border-end px-4 py-2" style={{ minWidth: 260 }}>
                <span className="text-uppercase fw-semibold text-secondary" style={{ fontSize: 12, letterSpacing: 1 }}>To</span>
                <PlacesAutocomplete value={drop} onChange={setDrop} onSelect={setDrop}>
                  {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input
                        {...getInputProps({
                          placeholder: 'Drop Location',
                          className: 'form-control border-0 bg-transparent fw-bold p-0',
                          style: {
                            fontSize: 16,
                            outline: "none",
                            boxShadow: "none",
                            background: "transparent",
                            padding: 0,
                            height: 28,
                          },
                          required: true,
                        })}
                      />
                      {drop && (
                        <div className="text-muted" style={{ fontSize: 11, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {drop}
                        </div>
                      )}
                      {suggestions.length > 0 && (
                        <div
                          className="shadow-sm"
                          style={{
                            position: 'absolute',
                            zIndex: 1000,
                            width: '100%',
                            top: '100%',
                            left: 0,
                            fontSize: 14,
                            maxHeight: 180,
                            overflowY: 'auto',
                            background: '#fff',
                            border: '1.5px solid #e57368',
                            borderRadius: 10,
                            boxShadow: '0 4px 16px #f8bbd0',
                            marginTop: 4,
                          }}
                        >
                          {loading && (
                            <div style={{ padding: "8px 14px", color: "#888", fontSize: 13 }}>
                              Loading...
                            </div>
                          )}
                          {suggestions.map(suggestion => {
                            const style = {
                              padding: "10px 16px",
                              cursor: "pointer",
                              background: suggestion.active ? "#ffeaea" : "#fff",
                              color: "#23272f",
                              borderBottom: "1px solid #f3e6e6",
                              fontWeight: suggestion.active ? 600 : 400,
                              borderRadius: suggestion.active ? 8 : 0,
                              transition: "background 0.15s",
                            };
                            return (
                              <div
                                {...getSuggestionItemProps(suggestion, { style })}
                                key={suggestion.placeId}
                              >
                                <i className="bi bi-geo-alt-fill me-2 text-danger" style={{ fontSize: 16, verticalAlign: "middle" }} />
                                {suggestion.description}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </PlacesAutocomplete>
              </div>
              {/* Pickup Date */}
              <div className="d-flex flex-column justify-content-center border-end px-4 py-2" style={{ minWidth: 180, alignItems: 'flex-start' }}>
                <span className="text-uppercase fw-semibold text-secondary" style={{ fontSize: 12, letterSpacing: 1 }}>Pickup Date</span>
                <input
                  type="date"
                  className="form-control border-0 bg-transparent fw-bold p-0"
                  style={{
                    fontSize: 15,
                    outline: "none",
                    boxShadow: "none",
                    background: "transparent",
                    width: 160, 
                    height: 36,
                    padding: 0,
                  }}
                  value={datetime ? datetime.split('T')[0] : ''}
                  onChange={e => {
                    // Keep the time part if already set, else default to 09:00
                    const date = e.target.value;
                    let time = "09:00";
                    if (datetime && datetime.includes("T") && datetime.split("T")[1]) {
                      time = datetime.split("T")[1].slice(0, 5);
                    }
                    setDatetime(date ? `${date}T${time}` : "");
                  }}
                  required
                />
                {datetime && datetime.split('T')[0] && (
                  <div className="text-muted" style={{ fontSize: 13, marginTop: 2 }}>
                    {(() => {
                      const dateObj = new Date(datetime);
                      if (isNaN(dateObj)) return '';
                      return dateObj.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: '2-digit' });
                    })()}
                  </div>
                )}
              </div>
              {/* Pickup Time */}
              <div className="d-flex flex-column justify-content-center border-end px-4 py-2" style={{ minWidth: 150, alignItems: 'flex-start' }}>
                <span className="text-uppercase fw-semibold text-secondary" style={{ fontSize: 12, letterSpacing: 1 }}>Pickup Time</span>
                <input
                  type="time"
                  className="form-control border-0 bg-transparent fw-bold p-0"
                  style={{
                    fontSize: 15,
                    outline: "none",
                    boxShadow: "none",
                    background: "transparent",
                    width: 120, 
                    height: 36,
                    padding: 0,
                  }}
                  value={datetime && datetime.includes('T') ? datetime.split('T')[1]?.slice(0, 5) || '' : ''}
                  onChange={e => {
                    let date = datetime ? datetime.split('T')[0] : '';
                    setDatetime(date && e.target.value ? `${date}T${e.target.value}` : '');
                  }}
                  required
                />
                {datetime && datetime.includes('T') && datetime.split('T')[1] && (
                  <div className="text-muted" style={{ fontSize: 15, marginTop: 2 }}>
                    {(() => {
                      const t = datetime.split('T')[1];
                      if (!t) return '';
                      let [h, m] = t.split(':');
                      if (typeof h === "undefined" || typeof m === "undefined") return '';
                      h = parseInt(h, 10);
                      const ampm = h >= 12 ? 'PM' : 'AM';
                      h = h % 12 || 12;
                      return `${h}:${m} ${ampm}`;
                    })()}
                  </div>
                )}
              </div>
              {/* Travel Time */}
              <div className="d-flex flex-column justify-content-center px-4 py-2" style={{ minWidth: 140, alignItems: 'flex-start' }}>
                <span className="text-uppercase fw-semibold text-secondary" style={{ fontSize: 12, letterSpacing: 1 }}>Travel Time</span>
                <select
                  className="form-select fw-bold"
                  style={{
                    fontSize: 15,
                    outline: "none",
                    background: "#fff",
                    border: "none",
                    borderRadius: 8,
                    width: 110,
                    height: 38,
                    padding: "8px 12px",
                    marginTop: 2,
                    boxShadow: "none",
                    color: "#23272f",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none"
                  }}
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
              {/* Search Button */}
              <div className="d-flex align-items-center px-4 py-2">
                <button
                  type="submit"
                  className="btn fw-bold"
                  style={{
                    background: "#e57368",
                    color: "#fff",
                    border: "none",
                    borderRadius: 16,
                    fontSize: 15,
                    fontWeight: 700,
                    padding: "8px 22px",
                    boxShadow: '0 2px 8px #f8bbd0',
                    minWidth: 90,
                    whiteSpace: 'nowrap',
                    letterSpacing: 1
                  }}
                  disabled={loading}
                >
                  {loading ? 'Searching...' : <>Search <i className="bi bi-arrow-right ms-2"></i></>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Offers Section */}
      <section className="container my-5">
        <h3 className="fw-bold mb-4 text-center">Exciting Offers</h3>
        <div className="row justify-content-center">
          {offers.map((offer, idx) => (
            <div key={idx} className="col-12 col-md-5 col-lg-4 mb-3">
              <div
                className="p-4 rounded shadow-sm h-100"
                style={{
                  background: 'linear-gradient(100deg, #ffe5e0 60%, #fff 100%)',
                  border: '2px solid #e57368',
                  boxShadow: '0 4px 16px #f8bbd0',
                  position: 'relative',
                  transition: 'box-shadow 0.2s',
                }}
              >
                <div className="fw-bold text-danger mb-2" style={{ fontSize: 20 }}>
                  {offer.title}
                </div>
                <div className="text-secondary" style={{ fontSize: 16 }}>{offer.desc}</div>
                <span
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: '#e57368',
                    color: '#fff',
                    borderRadius: 8,
                    padding: '2px 10px',
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}
                >
                  OFFER
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose YatraNow Section */}
      <section className="container my-5">
        <h3 className="fw-bold mb-4 text-center">Why Choose YatraNow?</h3>
        <div className="row justify-content-center">
          {whyChoose.map((item, idx) => (
            <div key={idx} className="col-12 col-md-4 mb-3">
              <div className="p-3 rounded shadow-sm bg-white h-100 text-center">
                <i className={`bi ${item.icon} text-danger mb-2`} style={{ fontSize: 32 }}></i>
                <div className="fw-bold mt-2">{item.title}</div>
                <div className="text-secondary">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container my-5">
        <h3 className="fw-bold mb-4 text-center">Frequently Asked Questions</h3>
        <div className="accordion" id="faqAccordion">
          {faqs.map((faq, idx) => (
            <div className="accordion-item" key={idx}>
              <h2 className="accordion-header" id={`heading${idx}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${idx}`}
                  aria-expanded="false"
                  aria-controls={`collapse${idx}`}
                >
                  {faq.q}
                </button>
              </h2>
              <div
                id={`collapse${idx}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading${idx}`}
                data-bs-parent="#faqAccordion"
              >
                <div className="accordion-body">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;