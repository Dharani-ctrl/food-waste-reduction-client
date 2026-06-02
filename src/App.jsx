import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import FoodDetail from './pages/FoodDetail';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import { Toaster, toast } from 'react-hot-toast';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');
const API_URL = process.env.REACT_APP_API_URL || "https://food-waste-reduction-server-vert.vercel.app/";

function AppContent() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      // Join user specific room
      socket.emit('join_room', user._id);

      // If NGO, also join NGO general room
      if (user.role === 'ngo') {
        socket.emit('join_ngo_room');
      }

      // Listeners
      const handleNewFood = (data) => {
        toast.success(`New Food Added: ${data.title} in ${data.city}!`, { icon: '🍲' });
      };

      const handleDonationAccepted = (data) => {
        toast.success(data.message, { icon: '✅' });
      };

      const handleDeliveryCompleted = (data) => {
        toast.success(data.message, { icon: '🎉' });
      };

      socket.on('new_food', handleNewFood);
      socket.on('donation_accepted', handleDonationAccepted);
      socket.on('delivery_completed', handleDeliveryCompleted);

      return () => {
        socket.off('new_food', handleNewFood);
        socket.off('donation_accepted', handleDonationAccepted);
        socket.off('delivery_completed', handleDeliveryCompleted);
      };
    }
  }, [user]);

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <main className="flex-grow flex flex-col items-center w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/donor" element={<DonorDashboard />} />
            <Route path="/ngo" element={<NGODashboard />} />
            <Route path="/food/:id" element={<FoodDetail />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <div className="text-2xl font-bold text-green-500 mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                  ZeroWaste
                </div>
                <p className="text-gray-500 max-w-sm">Connecting food surplus with those in need. Join our mission to reduce food waste and combat hunger across the globe.</p>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="/about" className="hover:text-green-400 transition-colors">About Us</a></li>
                  <li><a href="/register?role=donor" className="hover:text-green-400 transition-colors">Become a Donor</a></li>
                  <li><a href="/register?role=ngo" className="hover:text-green-400 transition-colors">Register NGO</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Legal & Support</h3>
                <ul className="space-y-2">
                  <li><a href="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
                  <li><a href="/contact" className="hover:text-green-400 transition-colors">Contact Us</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p>&copy; {new Date().getFullYear()} ZeroWaste Platform. All rights reserved.</p>
              <div className="flex gap-4 text-sm">
                Saving food, helping people, protecting the planet. 🌍
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
