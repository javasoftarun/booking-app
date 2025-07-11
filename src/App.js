import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CabsList from './pages/CabList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import CabBookingDetails from './pages/CabBookingDetails';
import BookingConfirmation from './pages/BookingConfirmation';
import Footer from './components/Footer';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import ProfileLayout from './pages/profile/ProfileLayout';
import ProfileInfo from './pages/profile/ProfileInfo';
import ProfileBookings from './pages/profile/ProfileBookings';
import ProfileRatings from './pages/profile/ProfileRatings';
import ProfileSettings from './pages/profile/ProfileSettings';
import ProfileDeactivate from './pages/profile/ProfileDeactivate';

const App = () => (
  <BrowserRouter>
    <div className="with-mobile-footer">
      <Navbar />
      <div style={{ paddingBottom: '0px' }}>
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search-cab" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cabs" element={<CabsList />} />
            <Route path="/profile/*" element={<ProfileLayout />}>
              <Route path="info" element={<ProfileInfo />} />
              <Route path="bookings" element={<ProfileBookings />} />
              <Route path="ratings" element={<ProfileRatings />} />
              <Route path="settings" element={<ProfileSettings />} />
              <Route path="deactivate" element={<ProfileDeactivate />} />
            </Route>
            <Route path="/cab-booking-details" element={<CabBookingDetails />} />
            <Route path="/confirmation" element={<BookingConfirmation />} />
          </Routes>
        </main>
      </div>
    </div>
    <Footer />
  </BrowserRouter>
);

export default App;