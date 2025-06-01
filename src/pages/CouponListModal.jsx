import React from "react";

const CouponListModal = ({
  show,
  coupons,
  eligibleCoupons,
  selectedCoupon,
  onApply,
  onRemove,
  onClose,
  cabFare,
}) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        background: "rgba(0,0,0,0.4)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 2000,
      }}
      tabIndex={-1}
      role="dialog"
      onClick={onClose}
    >
      <div className="modal-dialog modal-dialog-centered" role="document" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Available Coupons</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body" style={{ maxHeight: 400, overflowY: "auto" }}>
            {eligibleCoupons.length === 0 && (
              <div className="text-secondary">No coupons available for this fare.</div>
            )}
            {eligibleCoupons.map(coupon => (
              <div
                key={coupon.promocode}
                className={`d-flex align-items-center justify-content-between mb-2 p-2 rounded ${selectedCoupon && selectedCoupon.promocode === coupon.promocode ? "bg-light border border-primary" : ""}`}
              >
                <div>
                  <span className="fw-semibold" style={{ color: "#1976d2" }}>{coupon.promocode}</span>
                  <span className="ms-2 text-secondary">{coupon.description}</span>
                  <div className="small text-muted">
                    Min Fare: ₹{coupon.minFare}
                    {coupon.discount > 0 && <> | Flat ₹{coupon.discount} off</>}
                    {coupon.discountPercentage > 0 && <> | {coupon.discountPercentage}% off{coupon.maxDiscount > 0 && ` (Max ₹${coupon.maxDiscount})`}</>}
                  </div>
                </div>
                {selectedCoupon && selectedCoupon.promocode === coupon.promocode ? (
                  <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => onRemove()}>Remove</button>
                ) : (
                  <button className="btn btn-sm btn-outline-success ms-2" onClick={() => onApply(coupon)}>Apply</button>
                )}
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponListModal;