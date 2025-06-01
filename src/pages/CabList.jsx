import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import API_ENDPOINTS from '../config/apiConfig';
import AuthModal from '../modal/AuthModal';

const cabTypeIcons = {
    Sedan: <i className="bi bi-car-front-fill me-2" style={{ fontSize: 24 }}></i>,
    Hatchback: <i className="bi bi-car-front-fill me-2" style={{ fontSize: 24 }}></i>,
    SUV: <i className="bi bi-car-front-fill me-2" style={{ fontSize: 24 }}></i>,
};

const PAGE_SIZE = 6;

const CabsList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cabs = [], pickup, drop, datetime, hours } = location.state || {};

    const [searchTerm, setSearchTerm] = useState('');
    const cabTypes = useMemo(
        () => Array.from(new Set(cabs.map(cab => cab.cabType))),
        [cabs]
    );
    const [selectedTypes, setSelectedTypes] = useState(['All']);
    const [page, setPage] = useState(1);
    const [showImg, setShowImg] = useState(false);
    const [imgSrc, setImgSrc] = useState('');
    const [filterOpen, setFilterOpen] = useState(window.innerWidth >= 768); // open by default on desktop
    const [, setGivenRatings] = useState([]);
    const [, setGivenRatingsLoading] = useState(false);
    const [activeTab] = useState('available'); // or 'ratings' based on your tab logic
    const [profile] = useState({ id: 1 }); // Dummy profile, replace with actual

    // Add state to store ratings for cabs
    const [cabRatings, setCabRatings] = useState({});
    const cabRatingsRef = useRef({});

    // Auth modal state
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Optional: handle window resize to auto-toggle filter on resize
    React.useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 768) setFilterOpen(false);
        else setFilterOpen(true);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const filteredCabs = useMemo(() => {
        let filtered = cabs;
        if (!selectedTypes.includes('All')) {
            filtered = filtered.filter(cab => selectedTypes.includes(cab.cabType));
        }
        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            filtered = filtered.filter(
                cab =>
                    cab.cabName.toLowerCase().includes(term) ||
                    cab.cabModel.toLowerCase().includes(term)
            );
        }
        return filtered;
    }, [cabs, selectedTypes, searchTerm]);

    const totalPages = Math.ceil(filteredCabs.length / PAGE_SIZE);
    const pagedCabs = filteredCabs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleTypeClick = (type) => {
        if (type === 'All') {
            setSelectedTypes(['All']);
        } else {
            setSelectedTypes(prev => {
                const alreadySelected = prev.includes(type);
                let newTypes = alreadySelected
                    ? prev.filter(t => t !== type)
                    : [...prev.filter(t => t !== 'All'), type];
                if (newTypes.length === 0) newTypes = ['All'];
                return newTypes;
            });
        }
    };

    // Wrap fetchCabRating in useCallback to avoid warning and unnecessary effect runs
    const fetchCabRating = useCallback(async (cabRegistrationId) => {
      try {
        const res = await fetch(API_ENDPOINTS.GET_RATINGS_BY_CAB_REG_ID(cabRegistrationId));
        const data = await res.json();
        if (
          data &&
          data.responseMessage === "success" &&
          data.responseData
        ) {
          return {
            averageRating: data.responseData.averageRating,
            totalRatings: data.responseData.totalRatings,
          };
        }
      } catch {}
      return { averageRating: null, totalRatings: null };
    }, []);

    // When fetching givenRatings, also fetch cab rating for each cab
    useEffect(() => {
      if (activeTab !== "ratings") return;
      setGivenRatingsLoading(true);
      fetch(API_ENDPOINTS.GET_RATINGS_BY_USER_ID(profile.id))
        .then((res) => res.json())
        .then(async (data) => {
          if (
            data &&
            data.responseMessage === "success" &&
            Array.isArray(data.responseData)
          ) {
            // Fetch cab details and cab rating for each rating
            const ratingsWithCab = await Promise.all(
              data.responseData.map(async (rating) => {
                const cabRating = await fetchCabRating(rating.cabRegistrationId);
                return {
                  ...rating,
                  ...cabRating,
                };
              })
            );
            setGivenRatings(ratingsWithCab);
          } else {
            setGivenRatings([]);
          }
        })
        .catch(() => setGivenRatings([]))
        .finally(() => setGivenRatingsLoading(false));
    }, [activeTab, profile.id]);

    useEffect(() => {
      let isMounted = true;
      const fetchRatings = async () => {
        const ratingsToFetch = pagedCabs.filter(
          cab => cabRatingsRef.current[cab.cabRegistrationId] === undefined
        );
        if (ratingsToFetch.length === 0) return;

        const newRatings = {};
        await Promise.all(
          ratingsToFetch.map(async (cab) => {
            const rating = await fetchCabRating(cab.cabRegistrationId);
            newRatings[cab.cabRegistrationId] = rating;
          })
        );
        if (isMounted && Object.keys(newRatings).length > 0) {
          setCabRatings(prev => {
            const updated = { ...prev, ...newRatings };
            cabRatingsRef.current = updated;
            return updated;
          });
        }
      };
      fetchRatings();
      return () => { isMounted = false; };
    }, [pagedCabs, fetchCabRating]);

    if (!cabs.length) {
        return (
            <div className="container py-5">
                <h3>No cabs found for your search.</h3>
            </div>
        );
    }

    return (
        <div className="cablist-bg" style={{ minHeight: '100vh' }}>
            <div className="cablist-main-container">

              {/* Mobile: Search Info as tags (on top) */}
              <div className="d-flex flex-wrap gap-2 align-items-center mb-3 d-md-none">
                <span className="badge rounded-pill bg-primary-subtle text-primary px-3 py-2" style={{ fontSize: 15 }}>
                  <i className="bi bi-geo-alt-fill me-1"></i> {pickup}
                </span>
                <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2" style={{ fontSize: 15 }}>
                  <i className="bi bi-geo-alt-fill me-1"></i> {drop}
                </span>
                <span className="badge rounded-pill bg-info-subtle text-info px-3 py-2" style={{ fontSize: 15 }}>
                  <i className="bi bi-calendar-event me-1"></i> {datetime}
                </span>
                <span className="badge rounded-pill bg-warning-subtle text-warning px-3 py-2" style={{ fontSize: 15 }}>
                  <i className="bi bi-clock me-1"></i> {hours}
                </span>
                <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2" style={{ fontSize: 15 }}>
                  <i className="bi bi-arrow-repeat me-1"></i> Round Trip
                </span>
                <button
                  type="button"
                  className="btn btn-link p-0 ms-2"
                  style={{ fontSize: 18 }}
                  title="Edit Trip Info"
                  onClick={() => navigate('/search-cab', { state: { pickup, drop, datetime, hours } })}
                >
                  <i className="bi bi-pencil-square text-primary"></i>
                </button>
              </div>

              <div className="row g-4">
                {/* Sidebar: Only on desktop */}
                <div className="col-12 col-md-4 col-lg-3 order-1 order-md-0">
                  {/* Desktop: Search Info Card */}
                  <div className="cablist-sidebar mb-3 mb-md-4 position-relative d-none d-md-block">
                    <button
                        type="button"
                        className="btn btn-link p-0 position-absolute"
                        style={{ top: 12, right: 12 }}
                        title="Edit Trip Info"
                        onClick={() => navigate('/search-cab', { state: { pickup, drop, datetime, hours } })}
                    >
                        <i className="bi bi-pencil-square fs-5 text-primary"></i>
                    </button>
                    <div className="mb-2 d-flex align-items-center gap-2">
                        <i className="bi bi-geo-alt-fill text-primary fs-5"></i>
                        <div>
                            <div className="text-muted small">Pickup</div>
                            <div className="fw-semibold text-dark">{pickup}</div>
                        </div>
                    </div>
                    <div className="mb-2 d-flex align-items-center gap-2">
                        <i className="bi bi-geo-alt-fill text-danger fs-5"></i>
                        <div>
                            <div className="text-muted small">Drop</div>
                            <div className="fw-semibold text-dark">{drop}</div>
                        </div>
                    </div>
                    <div className="mb-2 d-flex align-items-center gap-2">
                        <i className="bi bi-calendar-event text-primary fs-5"></i>
                        <div>
                            <div className="text-muted small">Pickup Date & Time</div>
                            <div className="fw-semibold text-dark">{datetime}</div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-clock text-primary fs-5"></i>
                        <div>
                            <div className="text-muted small">Hours</div>
                            <div className="fw-semibold text-dark">{hours}</div>
                        </div>
                    </div>
                    <div className="mb-2 d-flex align-items-center gap-2">
                      <i className="bi bi-arrow-repeat text-success fs-5"></i>
                      <div>
                          <div className="text-muted small">Trip Type</div>
                          <div className="fw-semibold text-success">Round Trip</div>
                      </div>
                    </div>
                  </div>
                  {/* Desktop: Filter in sidebar */}
                  <div className="cablist-sidebar d-none d-md-block">
                    <div className="bg-white shadow rounded-4 p-3 p-md-4" style={{ border: '1px solid #e3e6ed' }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0" style={{ color: '#333', fontSize: 18 }}>Select Cab Types</h5>
                      </div>
                      <div className="d-flex flex-column gap-2 gap-md-3">
                        {['All', ...cabTypes].map(type => (
                          <button
                            key={type}
                            className={`d-flex align-items-center px-3 px-md-4 py-2 py-md-3 fw-semibold text-start shadow-sm ${
                              selectedTypes.includes(type) ? 'bg-light border-primary' : 'bg-white border'
                            }`}
                            style={{
                              borderRadius: 12,
                              borderWidth: selectedTypes.includes(type) ? 2 : 1,
                              borderColor: selectedTypes.includes(type) ? '#1976d2' : '#e3e6ed',
                              color: selectedTypes.includes(type) ? '#1976d2' : '#444',
                              fontSize: 16,
                              outline: 'none',
                              transition: 'all 0.15s',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleTypeClick(type)}
                            type="button"
                          >
                            {cabTypeIcons[type] || <i className="bi bi-car-front-fill me-2" style={{ fontSize: 24 }}></i>}
                            {type.toUpperCase()}
                            {selectedTypes.includes(type) && type !== 'All' && (
                              <i className="bi bi-check-circle-fill ms-2 text-primary"></i>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-8 col-lg-9 order-0 order-md-1">
                  {/* Search Box */}
                  <div className="d-flex mb-3 mb-md-4 justify-content-end">
                    <form
                      style={{ maxWidth: 400, width: '100%' }}
                      onSubmit={e => {
                        e.preventDefault();
                        setPage(1);
                      }}
                      autoComplete="off"
                    >
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          style={{
                            borderRadius: '30px 0 0 30px',
                            border: '1.5px solid #1976d2',
                            background: '#fff',
                            fontSize: 17,
                            fontWeight: 500,
                            color: '#1a237e',
                            letterSpacing: '0.5px',
                          }}
                          placeholder="Search cabs by name or model"
                          value={searchTerm}
                          onChange={e => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                          }}
                        />
                        <button
                          type="submit"
                          className="btn"
                          style={{
                            borderRadius: '0 30px 30px 0',
                            background: '#1976d2',
                            color: '#fff',
                            fontWeight: 600,
                            border: '1.5px solid #1976d2',
                            borderLeft: 0
                          }}
                        >
                          <i className="bi bi-search"></i>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Mobile: Cab Type Filter (after search) */}
                  <div className="cablist-sidebar d-md-none mb-3">
                    <div className="bg-white shadow rounded-4 p-2" style={{ border: '1px solid #e3e6ed' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold" style={{ color: '#333', fontSize: 15 }}>Select Cab Types</span>
                        <button
                          type="button"
                          className="btn btn-sm"
                          style={{ background: '#FFD600', borderRadius: 8, fontWeight: 700, fontSize: 14, padding: '2px 8px' }}
                          onClick={() => setFilterOpen(open => !open)}
                          aria-label="Toggle Cab Type Filter"
                        >
                          {filterOpen ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                        </button>
                      </div>
                      <div className={`d-flex flex-wrap gap-2 ${filterOpen ? '' : 'd-none'}`}>
                        {['All', ...cabTypes].map(type => (
                          <button
                            key={type}
                            className={`cab-type-btn d-flex align-items-center px-2 py-1 fw-semibold text-start shadow-sm ${
                              selectedTypes.includes(type) ? 'bg-light border-primary' : 'bg-white border'
                            }`}
                            style={{
                              borderRadius: 8,
                              borderWidth: selectedTypes.includes(type) ? 2 : 1,
                              borderColor: selectedTypes.includes(type) ? '#1976d2' : '#e3e6ed',
                              color: selectedTypes.includes(type) ? '#1976d2' : '#444',
                              fontSize: 13,
                              outline: 'none',
                              transition: 'all 0.15s',
                              cursor: 'pointer',
                              minHeight: 28,
                              minWidth: 60,
                            }}
                            onClick={() => handleTypeClick(type)}
                            type="button"
                          >
                            {cabTypeIcons[type]
                              ? React.cloneElement(cabTypeIcons[type], { style: { fontSize: 16, marginRight: 6 } })
                              : <i className="bi bi-car-front-fill me-2" style={{ fontSize: 16 }}></i>}
                            {type.toUpperCase()}
                            {selectedTypes.includes(type) && type !== 'All' && (
                              <i className="bi bi-check-circle-fill ms-1 text-primary" style={{ fontSize: 14 }}></i>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Cab List */}
                  <div className="d-flex flex-column gap-4">
                    {pagedCabs.map((cab, idx) => (
                        <div
                          key={cab.cabRegistrationId || idx}
                          className="cab-card d-flex flex-column flex-md-row align-items-center justify-content-between p-4"
                          style={{
                            minHeight: 140,
                            gap: 24
                          }}
                        >
                          {/* Cab Logo or Image */}
                          <div
                            className="d-flex align-items-center justify-content-center mb-3 mb-md-0"
                            style={{
                              minWidth: 200,
                              maxWidth: 260,
                              minHeight: 130,
                              height: 150,
                              background: 'linear-gradient(120deg, #fff6f3 70%, #f7f7f7 100%)',
                              borderRadius: 16,
                              boxShadow: '0 2px 12px #e5736820',
                              border: '1.5px solid #ffe5e0',
                              position: 'relative',
                              overflow: 'hidden',
                              display: 'flex',
                            }}
                          >
                            <img
                              src={cab.cabImageUrl}
                              alt={cab.cabName}
                              className="cab-img"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 16,
                                background: '#fff',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                display: 'block',
                              }}
                              onClick={() => {
                                setImgSrc(cab.cabImageUrl);
                                setShowImg(true);
                              }}
                              title="View Image"
                            />
                            <span
                              style={{
                                position: 'absolute',
                                bottom: 10,
                                right: 14,
                                background: 'rgba(0,0,0,0.55)',
                                color: '#fff',
                                borderRadius: 8,
                                padding: '2px 8px',
                                fontSize: 16,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                              onClick={() => {
                                setImgSrc(cab.cabImageUrl);
                                setShowImg(true);
                              }}
                              title="View Image"
                            >
                              <i className="bi bi-eye"></i>
                            </span>
                          </div>
                          {/* Cab Info */}
                          <div className="flex-grow-1 px-md-3 w-100">
                            <div className="d-flex align-items-center gap-3 mb-2 flex-wrap">
                              <span className="fw-bold" style={{ fontSize: 22, color: '#23272f', letterSpacing: 0.5 }}>{cab.cabName}</span>
                              <span className="d-flex align-items-center gap-1">
                                {cabRatings[cab.cabRegistrationId]?.averageRating
                                  ? [...Array(5)].map((_, i) => (
                                      <FaStar
                                        key={i}
                                        style={{
                                          color:
                                            i < cabRatings[cab.cabRegistrationId].averageRating
                                              ? "#FFD600"
                                              : "#ccc",
                                          fontSize: 18,
                                          marginRight: 2,
                                        }}
                                      />
                                    ))
                                  : [...Array(5)].map((_, i) => (
                                      <FaStar
                                        key={i}
                                        style={{
                                          color: "#ccc",
                                          fontSize: 18,
                                          marginRight: 2,
                                        }}
                                      />
                                    ))}
                                <span className="ms-2 fw-semibold" style={{ fontSize: 15, color: "#e57368" }}>
                                  {cabRatings[cab.cabRegistrationId]?.averageRating ?? "N/A"}
                                </span>
                                <span className="text-muted" style={{ fontSize: 13 }}>
                                  ({cabRatings[cab.cabRegistrationId]?.totalRatings ?? 0} reviews)
                                </span>
                              </span>
                            </div>
                            <div className="mb-2" style={{ fontSize: 16, color: '#5a5a5a', fontWeight: 500 }}>
                              <span>{cab.cabType}</span>
                              <span className="mx-2">•</span>
                              <span>{cab.ac ? "AC" : "Non-AC"}</span>
                              <span className="mx-2">•</span>
                              <span>{cab.cabCapacity} Seats</span>
                              <span className="mx-2">•</span>
                              <span>Model: {cab.cabModel}</span>
                            </div>
                            <div className="mb-1" style={{ fontSize: 15, color: '#7b7b7b', fontWeight: 400 }}>
                              <i className="bi bi-currency-rupee"></i>
                              <span style={{ marginLeft: 4 }}>Extra km fare: <span style={{ color: '#e57368', fontWeight: 600 }}>INR {cab.perKmRate}</span> per kilometer</span>
                            </div>
                            <div className="mb-1" style={{ fontSize: 15, color: '#7b7b7b', fontWeight: 400 }}>
                              <i className="bi bi-shield-check"></i>
                              <span style={{ marginLeft: 4 }}>Insurance: <span style={{ color: '#23272f', fontWeight: 500 }}>{cab.cabInsurance}</span></span>
                            </div>
                            <div className="mb-1" style={{ fontSize: 15, color: '#7b7b7b', fontWeight: 400 }}>
                              <i className="bi bi-cash-coin"></i>
                              <span style={{ marginLeft: 4 }}>
                                <span style={{ color: '#e57368', fontWeight: 500 }}>Toll tax not included</span>
                              </span>
                            </div>
                          </div>
                          {/* Price & Book */}
                          <div className="d-flex flex-column align-items-end justify-content-between" style={{ minWidth: 140 }}>
                              <div className="fw-bold" style={{ fontSize: 28, color: '#222' }}>
                                  ₹{cab.fare}
                              </div>
                              <div className="text-secondary mb-2" style={{ fontSize: 13 }}>
                                  + Taxes & Charges
                              </div>
                              <button
                                  className="btn btn-book fw-bold"
                                  onClick={() =>
                                    navigate('/cab-booking-details', {
                                      state: {
                                        cab,
                                        pickup,
                                        drop,
                                        datetime,
                                        hours,
                                        roundTrip: true,
                                        cabRating: cabRatings[cab.cabRegistrationId]
                                      }
                                    })
                                  }
                              >
                                  BOOK
                              </button>
                          </div>
                        </div>
                    ))}
                  </div>
                  {/* Pagination */}
                  {totalPages > 1 && (
                      <nav className="mt-5">
                          <ul className="pagination justify-content-center">
                              <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
                                  <button className="page-link" onClick={() => setPage(page - 1)}>&laquo;</button>
                              </li>
                              {Array.from({ length: totalPages }, (_, i) => (
                                  <li key={i} className={`page-item${page === i + 1 ? ' active' : ''}`}>
                                      <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                                  </li>
                              ))}
                              <li className={`page-item${page === totalPages ? ' disabled' : ''}`}>
                                  <button className="page-link" onClick={() => setPage(page + 1)}>&raquo;</button>
                              </li>
                          </ul>
                      </nav>
                  )}
                </div>
              </div>
              {/* Image Popup Modal */}
              {showImg && (
                  <div
                      style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          width: '100vw',
                          height: '100vh',
                          background: 'rgba(0,0,0,0.7)',
                          zIndex: 1050,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                      }}
                      onClick={() => setShowImg(false)}
                  >
                      <div
                          style={{
                              position: 'relative',
                              background: '#fff',
                              borderRadius: 12,
                              padding: 16,
                              maxWidth: '90vw',
                              maxHeight: '90vh',
                              boxShadow: '0 4px 32px rgba(0,0,0,0.25)'
                          }}
                          onClick={e => e.stopPropagation()}
                      >
                          <button
                              type="button"
                              className="btn btn-light position-absolute"
                              style={{ top: 8, right: 8, zIndex: 2 }}
                              onClick={() => setShowImg(false)}
                              title="Close"
                          >
                              <i className="bi bi-x-lg"></i>
                          </button>
                          <img
                              src={imgSrc}
                              alt="Cab Large"
                              style={{
                                  maxWidth: '80vw',
                                  maxHeight: '70vh',
                                  display: 'block',
                                  margin: '0 auto',
                                  borderRadius: 8
                              }}
                          />
                      </div>
                  </div>
              )}
              <AuthModal show={showAuthModal} onClose={() => setShowAuthModal(false)} />
            </div>
        </div>
    );
};

export default CabsList;