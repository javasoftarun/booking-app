import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Dummy icons for cab types (replace with your own or use react-icons)
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
    const [selectedType, setSelectedType] = useState('All');
    const [page, setPage] = useState(1);
    const [showImg, setShowImg] = useState(false);
    const [imgSrc, setImgSrc] = useState('');

    const filteredCabs = useMemo(() => {
        let filtered = selectedType === 'All' ? cabs : cabs.filter(cab => cab.cabType === selectedType);
        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            filtered = filtered.filter(
                cab =>
                    cab.cabName.toLowerCase().includes(term) ||
                    cab.cabModel.toLowerCase().includes(term)
            );
        }
        return filtered;
    }, [cabs, selectedType, searchTerm]);

    const totalPages = Math.ceil(filteredCabs.length / PAGE_SIZE);
    const pagedCabs = filteredCabs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    if (!cabs.length) {
        return (
            <div className="container py-5">
                <h3>No cabs found for your search.</h3>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <div className="container py-4">
                {/* Info Banner */}
                <div className="alert alert-info d-flex align-items-center mb-4" style={{ borderRadius: 12 }}>
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    <span>
                        Free cancellation is available. Driver and cab detail will be provided after booking.
                    </span>
                </div>
                <div className="row g-4">
                    {/* Left: Cab Type Filter + Search Info Card */}
                    <div className="col-12 col-md-4 col-lg-3 order-1 order-md-0">
                        {/* Search Info Card */}
                        <div
                            className="bg-white shadow rounded-4 p-3 p-md-4 mb-3 mb-md-4 position-relative"
                            style={{
                                border: '1px solid #e3e6ed',
                                minHeight: 180,
                                marginBottom: 16,
                            }}
                        >
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
                        </div>
                        {/* Cab Type Filter */}
                        <div className="bg-white shadow rounded-4 p-3 p-md-4" style={{ border: '1px solid #e3e6ed' }}>
                            <h5 className="fw-bold mb-3" style={{ color: '#333', fontSize: 18 }}>Select Cab Types</h5>
                            <div className="d-flex flex-column gap-2 gap-md-3">
                                {['All', ...cabTypes].map(type => (
                                    <button
                                        key={type}
                                        className={`d-flex align-items-center px-3 px-md-4 py-2 py-md-3 fw-semibold text-start shadow-sm ${selectedType === type ? 'bg-light border-primary' : 'bg-white border'} `}
                                        style={{
                                            borderRadius: 12,
                                            borderWidth: selectedType === type ? 2 : 1,
                                            borderColor: selectedType === type ? '#1976d2' : '#e3e6ed',
                                            color: selectedType === type ? '#1976d2' : '#444',
                                            fontSize: 16,
                                            outline: 'none',
                                            transition: 'all 0.15s',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => { setSelectedType(type); setPage(1); }}
                                    >
                                        {cabTypeIcons[type] || <i className="bi bi-car-front-fill me-2" style={{ fontSize: 24 }}></i>}
                                        {type.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Right: Search and Cab List */}
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
                        {/* Cab List */}
                        <div className="d-flex flex-column gap-4">
                            {pagedCabs.map((cab, idx) => (
                                <div
                                    key={cab.cabRegistrationId || idx}
                                    className="d-flex flex-column flex-md-row align-items-center justify-content-between bg-white shadow-sm p-4"
                                    style={{
                                        borderRadius: 18,
                                        border: '1px solid #e3e6ed',
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
                                        <span className="badge bg-light text-danger fw-semibold" style={{ fontSize: 15 }}>
                                          4.0/5 <span className="text-muted" style={{ fontSize: 13 }}>(3k reviews)</span>
                                        </span>
                                      </div>
                                      <div className="mb-2" style={{ fontSize: 16, color: '#5a5a5a', fontWeight: 500 }}>
                                        <span>{cab.cabType}</span>
                                        <span className="mx-2">•</span>
                                        <span>AC</span>
                                        <span className="mx-2">•</span>
                                        <span>{cab.cabCapacity} Seats</span>
                                      </div>
                                      <div className="mb-1" style={{ fontSize: 15, color: '#7b7b7b', fontWeight: 400 }}>
                                        <i className="bi bi-currency-rupee"></i>
                                        <span style={{ marginLeft: 4 }}>Extra km fare: <span style={{ color: '#e57368', fontWeight: 600 }}>INR {cab.perKmRate}</span> per kilometer</span>
                                      </div>
                                      <div className="mb-1" style={{ fontSize: 15, color: '#7b7b7b', fontWeight: 400 }}>
                                        <i className="bi bi-fuel-pump"></i>
                                        <span style={{ marginLeft: 4 }}>Fuel Type: <span style={{ color: '#23272f', fontWeight: 500 }}>{cab.cabFuelType || 'Petrol, CNG'}</span></span>
                                      </div>
                                      <div className="mb-1" style={{ fontSize: 15, color: '#7b7b7b', fontWeight: 400 }}>
                                        <i className="bi bi-x-circle"></i>
                                        <span style={{ marginLeft: 4 }}>Cancellation: <span style={{ color: '#43a047', fontWeight: 500 }}>Free cancellation until pickup time</span></span>
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
                                            className="btn fw-bold"
                                            style={{
                                                background: '#ff4d4f',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: 24,
                                                fontSize: 16,
                                                fontWeight: 600,
                                                padding: '10px 32px',
                                                boxShadow: '0 2px 8px #f8bbd0',
                                                transition: 'background 0.2s, box-shadow 0.2s',
                                            }}
                                            onClick={() =>
                                                navigate('/cab-booking-details', { state: { cab, pickup, drop, datetime, hours } })
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
            </div>
        </div>
    );
};

export default CabsList;