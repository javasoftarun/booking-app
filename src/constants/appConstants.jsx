export const USER_DEFAULT_IMAGE =
  "http://res.cloudinary.com/djapc6r8k/image/upload/v1747877340/ltlb9zsi3rdakqx4ymw4.jpg";

export const USER_DEFAULT_ROLE = "USER";

export const DEFAULT_BOOKING_STATUS = "PENDING";
export const DEFAULT_CAB_STATUS = "ACTIVE";

export const COUPONS = [
  { code: "WELCOME100", desc: "Get ₹100 off on your first booking", discount: 100, minFare: 500 },
  { code: "SAVE10", desc: "Flat 10% off (up to ₹200)", discountPercent: 10, maxDiscount: 200, minFare: 1000 },
  { code: "CAB50", desc: "₹50 off for fares above ₹400", discount: 50, minFare: 400 },
];