const API_USER_BASE_URL = "https://userservice-f6nd.onrender.com/api";
const API_CABANDBOOKING_BASE_URL = "https://carbookingservice-0mby.onrender.com/api";
const API_COMMONSERVICE_BASE_URL = "https://commonservice-31h4.onrender.com/api";

const API_ENDPOINTS = {
  // users api endpoints
  LOGIN_API: `${API_USER_BASE_URL}/users/login`,
  FORGOT_PASSWORD: `${API_USER_BASE_URL}/users/forgot-password`,
  RESET_PASSWORD: `${API_USER_BASE_URL}/users/reset-password`,
  GET_ALL_USERS: `${API_USER_BASE_URL}/users/all`,
  GET_USER_BY_ID: (id) => `${API_USER_BASE_URL}/users/${id}`,
  ADD_USER: `${API_USER_BASE_URL}/users/register`,
  DELETE_USER: (id) => `${API_USER_BASE_URL}/users/${id}`,
  UPDATE_PASSWORD: `${API_USER_BASE_URL}/users/update/password`,
  UPDATE_USER: `${API_USER_BASE_URL}/users/update`,
  GET_USER_BY_EMAIL: (email) => `${API_USER_BASE_URL}/users/find/email/${email}`,

  // cab and booking api endpoints
  GET_ALL_CABS: `${API_CABANDBOOKING_BASE_URL}/cab/registration/get/all`,
  DELETE_CAB: (id) => `${API_CABANDBOOKING_BASE_URL}/cab/registration/delete/${id}`,
  GET_CAB_BY_ID: (id) => `${API_CABANDBOOKING_BASE_URL}/cab/registration/get/${id}`,
  UPDATE_BOOKING: (id) => `${API_CABANDBOOKING_BASE_URL}/cab/booking/update/${id}`,
  UPDATE_BOOKING_STATUS: `${API_CABANDBOOKING_BASE_URL}/cab/booking/update-booking-status`,
  SEARCH_AVAILABLE_CABS: `${API_CABANDBOOKING_BASE_URL}/cab/registration/search`,
  ADD_BOOKING: `${API_CABANDBOOKING_BASE_URL}/cab/booking/startbooking`,
  GET_BOOKINGS_BY_CAB_REG_ID: (id) => `${API_CABANDBOOKING_BASE_URL}/cab/booking/get-by-cabregistrationid/${id}`,
  GET_BOOKINGS_BY_USER_ID: (id) => `${API_CABANDBOOKING_BASE_URL}/cab/booking/get-by-userid/${id}`,

  // Common service endpoints
  UPLOAD_BASE64_IMAGE: `${API_COMMONSERVICE_BASE_URL}/common/uploadBase64Image`,
  ALL_OFFERS: `${API_COMMONSERVICE_BASE_URL}/common/offer/all`,
  ADD_RATING: `${API_COMMONSERVICE_BASE_URL}/common/cab-rating/add`,
  GET_RATINGS_BY_USER_ID: (userId) => `${API_COMMONSERVICE_BASE_URL}/common/cab-rating/user/${userId}`,
  GET_RATINGS_BY_CAB_REG_ID: (cabRegistrationId) => `${API_COMMONSERVICE_BASE_URL}/common/cab-rating/${cabRegistrationId}`,
  GET_ALL_COUPONS: `${API_COMMONSERVICE_BASE_URL}/common/offer/all`,
};

export default API_ENDPOINTS;