import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import PlacesAutocomplete from 'react-places-autocomplete';
import API_ENDPOINTS from '../config/apiConfig';
import FaqSection from '../components/FaqSection';
import weddingImg from '../assets/images/wedding.avif';
import djImg from '../assets/images/dj.webp';
import transportImg from '../assets/images/transporter.avif';
import lightingImg from '../assets/images/rath.avif';
import decoratedWeddingCarImg from '../assets/images/decorated-wedding-car.jpg';

// Dummy data for offers, why choose, and FAQs
const offers = [
  { title: "Flat 10% Off", desc: "On your first ride with Bhada24. Use code: FIRST10" },
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
  const [listeningField, setListeningField] = useState(null);
  const recognitionRef = useRef(null);
  const pickupInputRef = useRef(null);
  const dropInputRef = useRef(null);
  const [recognizing, setRecognizing] = useState(false);

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
  // Helper messages for user after voice input
  const [showPickupHelper, setShowPickupHelper] = useState(false);
  const [showDropHelper, setShowDropHelper] = useState(false);

  // Voice recognition setup (only create instance ONCE)
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'en-IN';
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;
  }, []);

  // Voice search handler
  const startListening = (field) => {
    if (recognizing) return; // Prevent double start
    setListeningField(field);
    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event) => {
        let transcript = event.results[0][0].transcript;
        // Remove trailing punctuation and add a space
        transcript = transcript.replace(/[.,!?;:]+$/, '') + ' ';
        if (field === 'pickup') {
          setPickup(transcript);
          setShowPickupHelper(true);
          setTimeout(() => {
            if (pickupInputRef.current) {
              pickupInputRef.current.focus();
              pickupInputRef.current.setSelectionRange(transcript.length, transcript.length);
            }
          }, 100);
        }
        if (field === 'drop') {
          setDrop(transcript);
          setShowDropHelper(true);
          setTimeout(() => {
            if (dropInputRef.current) {
              dropInputRef.current.focus();
              dropInputRef.current.setSelectionRange(transcript.length, transcript.length);
            }
          }, 100);
        }
        setListeningField(null);
        setRecognizing(false);
      };
      recognitionRef.current.onerror = () => {
        setListeningField(null);
        setRecognizing(false);
      };
      recognitionRef.current.onend = () => {
        setListeningField(null);
        setRecognizing(false);
      };
      setRecognizing(true);
      recognitionRef.current.start();
    }
  };

  // Hide helper when user types
  const handlePickupChange = (val) => {
    setPickup(val);
    setShowPickupHelper(false);
  };
  const handleDropChange = (val) => {
    setDrop(val);
    setShowDropHelper(false);
  };

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

  // Responsive: detect mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 767;

  return (
    <>
      {/* Listening Indicator */}
      {recognizing && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(30,32,38,0.15)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "32px 48px",
              borderRadius: 18,
              boxShadow: "0 8px 32px #0002",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div className="mb-2">
              <i
                className="bi bi-mic-fill"
                style={{
                  fontSize: 48,
                  color: "#e57368",
                  animation: "pulse 1s infinite",
                }}
              />
            </div>
            <div style={{ fontWeight: 700, fontSize: 22, color: "#e57368" }}>
              Listening...
            </div>
            <div style={{ color: "#23272f", fontSize: 16 }}>
              Please speak your location
            </div>
          </div>
          <style>
            {`
              @keyframes pulse {
                0% { box-shadow: 0 0 0 0 #e5736840; }
                70% { box-shadow: 0 0 0 16px #e5736800; }
                100% { box-shadow: 0 0 0 0 #e5736840; }
              }
            `}
          </style>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="hero-form-section">
        <img
          src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80"
          alt="Banner"
          className="hero-banner-bg"
        />
        <div className="hero-banner-overlay"></div>
        <div className="container hero-form-content">
          <div className="text-center mb-4 d-none d-md-block">
            <h1 className="hero-title-main">
              Book Your Cab <span className="red">Anywhere</span> <span className="yellow">Anytime</span>
            </h1>
            <div className="hero-desc">
              Book Early. <span className="yellow">Travel Easy.</span><span className="red"> Reliable Cabs at Your Fingertips.</span>
            </div>
          </div>
          <div className="hero-form-card">
            <div className="hero-form-title">
              <i className="bi bi-taxi-front-fill" style={{ color: "#FFD600", fontSize: 32, verticalAlign: "middle" }} />
              Cabs Booking
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              {/* MOBILE: Separate sections for Pickup/Drop and Pickup Date/Time */}
              {isMobile ? (
                <>
                  {/* Section: Pickup & Drop */}
                  <div className="mb-3">
                    <div className="mb-2">
                      <label className="form-label fw-semibold text-secondary" htmlFor="pickup" style={{ fontSize: 15 }}>
                        Pickup Location
                      </label>
                      <PlacesAutocomplete
                        value={pickup}
                        onChange={handlePickupChange}
                        onSelect={address => {
                          setPickup(address);
                          setShowPickupHelper(false);
                        }}
                      >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                          <div style={{ position: 'relative', width: '100%' }}>
                            <input
                              {...getInputProps({
                                ref: pickupInputRef,
                                placeholder: 'From',
                                className: 'form-control',
                                id: 'pickup',
                                name: 'pickup',
                                required: true,
                                style: { fontWeight: 400 }
                              })}
                            />
                            {/* Voice button */}
                            <button
                              type="button"
                              className="btn btn-link p-0 position-absolute"
                              style={{ right: 8, top: 8 }}
                              aria-label="Voice input for pickup"
                              onClick={() => startListening('pickup')}
                              tabIndex={-1}
                            >
                              <i className={`bi ${listeningField === 'pickup' ? 'bi-mic-fill text-danger' : 'bi-mic'} fs-5`} />
                            </button>
                            {showPickupHelper && (
                              <div className="text-muted small mt-1">
                                Tap space or type to see suggestions.
                              </div>
                            )}

                            {suggestions.length > 0 && (
                              <div
                                className="position-absolute bg-white rounded shadow autocomplete-dropdown-container"
                                style={{
                                  zIndex: 9999,
                                  top: 'calc(100% + 4px)',
                                  left: 0,
                                  right: 0,
                                  width: '100%',
                                  boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                                  border: '1px solid #e0e0e0',
                                  background: '#fff'
                                }}
                              >
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
                    <div>
                      <label className="form-label fw-semibold text-secondary" htmlFor="drop" style={{ fontSize: 15 }}>
                        Drop Location
                      </label>
                      <PlacesAutocomplete
                        value={drop}
                        onChange={handleDropChange}
                        onSelect={address => {
                          setDrop(address);
                          setShowDropHelper(false);
                        }}
                      >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                          <div style={{ position: 'relative', width: '100%' }}>
                            <input
                              {...getInputProps({
                                ref: dropInputRef,
                                placeholder: 'To',
                                className: 'form-control',
                                id: 'drop',
                                name: 'drop',
                                required: true,
                                style: { fontWeight: 400 }
                              })}
                            />
                            {/* Voice button */}
                            <button
                              type="button"
                              className="btn btn-link p-0 position-absolute"
                              style={{ right: 8, top: 8 }}
                              aria-label="Voice input for drop"
                              onClick={() => startListening('drop')}
                              tabIndex={-1}
                            >
                              <i className={`bi ${listeningField === 'drop' ? 'bi-mic-fill text-danger' : 'bi-mic'} fs-5`} />
                            </button>
                            {showDropHelper && (
                              <div className="text-muted small mt-1">
                                Tap space or type to see suggestions.
                              </div>
                            )}
                            {suggestions.length > 0 && (
                              <div
                                className="position-absolute bg-white rounded shadow autocomplete-dropdown-container"
                                style={{
                                  zIndex: 9999,
                                  top: 'calc(100% + 4px)',
                                  left: 0,
                                  right: 0,
                                  width: '100%',
                                  boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                                  border: '1px solid #e0e0e0',
                                  background: '#fff'
                                }}
                              >
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
                  </div>
                  {/* Section: Pickup Date & Time */}
                  <div className="mb-3">
                    <div className="mb-2">
                      <label className="form-label fw-semibold text-secondary" htmlFor="pickupDate" style={{ fontSize: 15 }}>
                        Pickup Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="pickupDate"
                        name="pickupDate"
                        style={{ fontWeight: 400 }}
                        value={datetime ? datetime.split('T')[0] : ''}
                        onChange={e => {
                          const date = e.target.value;
                          setDatetime(date + (datetime && datetime.includes('T') ? datetime.slice(datetime.indexOf('T')) : 'T09:00'));
                        }}
                        required
                        placeholder="Pickup Date"
                      />
                    </div>
                    <div>
                      <label className="form-label fw-semibold text-secondary" htmlFor="pickupTime" style={{ fontSize: 15 }}>
                        Pickup Time
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        id="pickupTime"
                        name="pickupTime"
                        style={{ fontWeight: 400 }}
                        value={
                          datetime && datetime.includes('T')
                            ? datetime.split('T')[1].slice(0, 5)
                            : '09:00'
                        }
                        onChange={e => {
                          const time = e.target.value;
                          setDatetime((datetime ? datetime.split('T')[0] : '') + 'T' + time);
                        }}
                        required
                        placeholder="Pickup Time"
                      />
                    </div>
                  </div>
                  {/* Section: Travel Time & Search */}
                  <div className="mb-3">
                    <div className="fw-semibold text-secondary mb-2" style={{ fontSize: 16 }}>
                      Travel Time
                    </div>
                    <div className="mb-2">
                      <select
                        className="form-select"
                        id="travelTime"
                        name="travelTime"
                        style={{ fontWeight: 400 }}
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
                    <div>
                      <button
                        type="submit"
                        className="btn btn-yellow fw-bold w-100"
                        disabled={loading}
                        style={{ minHeight: 40 }}
                      >
                        {loading ? 'Searching...' : <>Search <i className="bi bi-arrow-right ms-2"></i></>}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // DESKTOP: Original layout (keep as is)
                <div className="row gy-3">
                  {/* From */}
                  <div className="col-12 col-md-3">
                    {isMobile ? null : (
                      <label className="form-label fw-semibold text-secondary" htmlFor="pickup">
                        From
                      </label>
                    )}
                    <PlacesAutocomplete value={pickup} onChange={setPickup} onSelect={setPickup}>
                      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div style={{ position: 'relative', width: '100%' }}>
                          <input
                            {...getInputProps({
                              placeholder: isMobile ? 'From (Pickup Location)' : 'Pickup Location',
                              className: 'form-control',
                              id: 'pickup',
                              name: 'pickup',
                              required: true,
                              style: { fontWeight: 400 }
                            })}
                          />
                          {suggestions.length > 0 && (
                            <div
                              className="position-absolute bg-white rounded shadow autocomplete-dropdown-container"
                              style={{
                                zIndex: 9999,
                                top: 'calc(100% + 4px)',
                                left: 0,
                                right: 0,
                                width: window.innerWidth <= 600 ? '100%' : '380px',
                                minWidth: window.innerWidth <= 600 ? 0 : '320px',
                                maxWidth: window.innerWidth <= 600 ? '100%' : '95vw',
                                boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                                border: '1px solid #e0e0e0',
                                background: '#fff'
                              }}
                            >
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
                  {/* To */}
                  <div className="col-12 col-md-3">
                    {isMobile ? null : (
                      <label className="form-label fw-semibold text-secondary" htmlFor="drop">
                        To
                      </label>
                    )}
                    <PlacesAutocomplete value={drop} onChange={setDrop} onSelect={setDrop}>
                      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div style={{ position: 'relative', width: '100%' }}>
                          <input
                            {...getInputProps({
                              placeholder: isMobile ? 'To (Drop Location)' : 'Drop Location',
                              className: 'form-control',
                              id: 'drop',
                              name: 'drop',
                              required: true,
                              style: { fontWeight: 400 }
                            })}
                          />
                          {suggestions.length > 0 && (
                            <div
                              className="position-absolute bg-white rounded shadow autocomplete-dropdown-container"
                              style={{
                                zIndex: 9999,
                                top: 'calc(100% + 4px)',
                                left: 0,
                                right: 0,
                                width: window.innerWidth <= 600 ? '100%' : '380px',
                                minWidth: window.innerWidth <= 600 ? 0 : '320px',
                                maxWidth: window.innerWidth <= 600 ? '100%' : '95vw',
                                boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                                border: '1px solid #e0e0e0',
                                background: '#fff'
                              }}
                            >
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
                  {/* Pickup Date */}
                  <div className="col-12 col-md-2">
                    <label className="form-label fw-semibold text-secondary" htmlFor="pickupDate">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="pickupDate"
                      name="pickupDate"
                      style={{ fontWeight: 400 }}
                      value={datetime ? datetime.split('T')[0] : ''}
                      onChange={e => {
                        const date = e.target.value;
                        setDatetime(date + (datetime && datetime.includes('T') ? datetime.slice(datetime.indexOf('T')) : 'T00:00'));
                      }}
                      required
                    />
                  </div>
                  {/* Pickup Time */}
                  <div className="col-12 col-md-2">
                    <label className="form-label fw-semibold text-secondary" htmlFor="pickupTime">
                      Pickup Time
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="pickupTime"
                      name="pickupTime"
                      style={{ fontWeight: 400 }}
                      value={
                        datetime && datetime.includes('T')
                          ? datetime.split('T')[1].slice(0, 5)
                          : '09:00'
                      }
                      onChange={e => {
                        const time = e.target.value;
                        setDatetime((datetime ? datetime.split('T')[0] : '') + 'T' + time);
                      }}
                      required
                    />
                  </div>
                  {/* Travel Time */}
                  <div className="col-12 col-md-1">
                    {isMobile ? null : (
                      <label className="form-label fw-semibold text-secondary" htmlFor="travelTime">
                        Travel Time
                      </label>
                    )}
                    <select
                      className="form-select"
                      id="travelTime"
                      name="travelTime"
                      style={{ fontWeight: 400 }}
                      value={hours}
                      onChange={e => setHours(e.target.value)}
                      required
                    >
                      <option value="">{isMobile ? "Travel Time" : "Select"}</option>
                      <option value="3">3 Hours</option>
                      <option value="6">6 Hours</option>
                      <option value="9">9 Hours</option>
                      <option value="12">12 Hours</option>
                      <option value="24">1 Day</option>
                      <option value="48">2 Days</option>
                    </select>
                  </div>
                  {/* Search Button */}
                  <div className="col-12 col-md-1 d-grid">
                    <button
                      type="submit"
                      className="btn btn-yellow fw-bold w-100"
                      disabled={loading}
                      style={{ minHeight: 40 }}
                    >
                      {loading ? 'Searching...' : <>Search <i className="bi bi-arrow-right ms-2"></i></>}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="container my-5">
        <h3 className="fw-bold mb-4 text-center" style={{ color: "#d32f2f" }}>Why Choose Bhada24?</h3>
        <div className="row g-4 justify-content-center">
          {whyChoose.map((item, idx) => (
            <div key={idx} className="col-12 col-md-4 d-flex justify-content-center">
              <div className="card-grid-item text-center p-4 h-100 shadow-sm rounded-4" style={{ width: "100%", maxWidth: 340 }}>
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
          <div className="col-12 col-sm-6 col-md-3">
            <div className="card-grid-item text-center p-3 h-100 mx-auto" style={{ width: "100%" }}>
              <img
                src={transportImg}
                alt="Transporters"
                className="img-fluid rounded-3 mb-3"
                style={{ height: 160, width: "100%", objectFit: "cover" }}
              />
              <div className="fw-bold mt-2">Transporters</div>
              <div className="text-secondary">Book trucks, mini-trucks, and more for your goods and wedding logistics.</div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="card-grid-item text-center p-3 h-100 mx-auto" style={{ width: "100%" }}>
              <img
                src={djImg}
                alt="DJ & Sound"
                className="img-fluid rounded-3 mb-3"
                style={{ height: 160, width: "100%", objectFit: "cover" }}
              />
              <div className="fw-bold mt-2">DJ & Sound</div>
              <div className="text-secondary">Hire professional DJs and sound systems for your events and parties.</div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="card-grid-item text-center p-3 h-100 mx-auto" style={{ width: "100%" }}>
              <img
                src={lightingImg}
                alt="Roadlights"
                className="img-fluid rounded-3 mb-3"
                style={{ height: 160, width: "100%", objectFit: "cover" }}
              />
              <div className="fw-bold mt-2">Roadlights</div>
              <div className="text-secondary">Decorative roadlights and lighting solutions for weddings and functions.</div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <div className="card-grid-item text-center p-3 h-100 mx-auto" style={{ width: "100%" }}>
              <img
                src={decoratedWeddingCarImg}
                alt="Cabs"
                className="img-fluid rounded-3 mb-3"
                style={{ height: 160, width: "100%", objectFit: "cover" }}
              />
              <div className="fw-bold mt-2">Cabs</div>
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
              Bhada24 is not just for cabs! We help you book <b>transporters</b> for goods, <b>DJs</b> for parties, <b>roadlights</b> for weddings, and much more.
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
                "Bhada24 made our wedding transport so easy! The cabs were on time and the drivers were very professional."
              </div>
              <div className="fw-bold">- Anil Kumar, Varanasi</div>
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
              <div className="fw-bold">- Anand, Gorakhpur</div>
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
          <Link to="/contact" className="btn btn-danger fw-bold mt-3 px-4 py-2">
            Get in Touch
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="container my-5">
        <h3 className="fw-bold mb-4 text-center" style={{ color: "#1976d2" }}>How Bhada24 Works</h3>
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
      <FaqSection />
    </>
  );
};

export default Home;