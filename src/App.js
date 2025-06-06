import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CabsList from './pages/CabList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import CabBookingDetails from './pages/CabBookingDetails';
import BookingConfirmation from './pages/BookingConfirmation';
import UserProfile from './pages/UserProfile';
import Footer from './components/Footer';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';

const App = () => (
  <BrowserRouter>
    <div className="with-mobile-footer">
      <Navbar />
      <div style={{ paddingBottom: '64px' }}>
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search-cab" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cabs" element={<CabsList />} />
            <Route path="/profile" element={<UserProfile />} />
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