import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Search, MapPin, Clock, Filter, List, CheckCircle, Truck, HeartHandshake, Map as MapIcon, ArrowUpDown } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import CountdownTimer from '../components/CountdownTimer';
import toast from 'react-hot-toast';
import L from 'leaflet';


const API_URL = process.env.REACT_APP_API_URL || "https://food-waste-reduction-server.onrender.com";
// Custom icons for Map
const userIcon = new L.DivIcon({
  className: 'custom-user-marker',
  html: `<div style="position:relative;width:24px;height:24px;">
          <div style="position:absolute;width:100%;height:100%;background:#3b82f6;border-radius:50%;opacity:0.4;animation:pulse 2s infinite;"></div>
          <div style="position:absolute;top:25%;left:25%;width:50%;height:50%;background:#2563eb;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const foodIcon = new L.DivIcon({
  className: 'custom-food-marker',
  html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:#10b981;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:2px 2px 6px rgba(0,0,0,0.3);">
          <div style="width:12px;height:12px;background:white;border-radius:50%;"></div>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const NGODashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  
  // Data State
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter State
  const [filters, setFilters] = useState({ city: '', category: 'all', listingType: 'all', distance: '', sort: 'newest' });
  const [userLoc, setUserLoc] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
    else if (user.role !== 'ngo') navigate('/');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLoc({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (err) => console.log(err)
      );
    }
  }, [user, navigate]);

  const fetchListings = async () => {
    if (!user || user.role !== 'ngo') return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      let queryUrl = `${API_URL}/api/ngo/listings?`;
      if (filters.city) queryUrl += `city=${filters.city}&`;
      if (filters.category !== 'all') queryUrl += `category=${filters.category}&`;
      if (filters.listingType !== 'all') queryUrl += `listingType=${filters.listingType}`;

      const res = await axios.get(queryUrl, config);
      let data = res.data;

      // Calculate distance for all if userLoc is present
      if (userLoc) {
        data = data.map(item => {
          if (!item.location || !item.location.lat) return { ...item, distKm: Infinity };
          const R = 6371; // km
          const dLat = (item.location.lat - userLoc.lat) * Math.PI / 180;
          const dLng = (item.location.lng - userLoc.lng) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(userLoc.lat * Math.PI / 180) * Math.cos(item.location.lat * Math.PI / 180) *
                    Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          return { ...item, distKm: R * c };
        });
      }

      // Filter by max distance
      if (filters.distance && userLoc) {
        data = data.filter(item => item.distKm <= parseInt(filters.distance));
      }

      // Sort
      if (filters.sort === 'distance' && userLoc) {
        data.sort((a, b) => a.distKm - b.distKm);
      } else if (filters.sort === 'expiry') {
        data.sort((a, b) => new Date(a.expiryDateTime) - new Date(b.expiryDateTime));
      } else {
        // default newest
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setListings(data);
    } catch (err) {
      setError('Failed to fetch food listings');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    if (!user || user.role !== 'ngo') return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`${API_URL}/api/ngo/my-requests`, config);
      setRequests(res.data);
    } catch (err) {
      setError('Failed to fetch your requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError('');
    setSuccess('');
    if (activeTab === 'browse') {
      fetchListings();
    } else if (activeTab === 'requests') {
      fetchRequests();
    }
  }, [activeTab]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleRequestPickup = async (listingId) => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/api/ngo/request/${listingId}`, {}, config);
      setSuccess('Pickup requested successfully!');
      toast.success('Pickup requested successfully!', { icon: '🙌' });
      // Refresh listings to remove the requested one from active browse view
      fetchListings();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      toast.error('Failed to request pickup');
      setError(err.response?.data?.message || 'Failed to request pickup');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_URL}/api/ngo/request/${requestId}`, { status: newStatus }, config);
      // Refresh requests
      fetchRequests();
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
      setError(err.response?.data?.message || 'Failed to update status');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'ngo') return null;

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white shadow-md flex flex-col shrink-0 md:min-h-full z-10">
        {/* Header — only visible on desktop */}
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <h2 className="text-xl font-bold text-gray-800">NGO Panel</h2>
          <p className="text-sm text-gray-500">{user.name}</p>
        </div>
        {/* Horizontal on mobile, vertical on desktop */}
        <nav className="flex flex-row md:flex-col p-3 md:p-4 gap-2 overflow-x-auto hide-scrollbar md:flex-1">
          <button onClick={() => setActiveTab('browse')} className={`shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-left font-semibold whitespace-nowrap transition-colors ${activeTab === 'browse' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Search size={18} /> Browse Food
          </button>
          <button onClick={() => setActiveTab('requests')} className={`shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-left font-semibold whitespace-nowrap transition-colors ${activeTab === 'requests' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <List size={18} /> My Requests
          </button>
          <button onClick={() => setActiveTab('map')} className={`shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-left font-semibold whitespace-nowrap transition-colors ${activeTab === 'map' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <MapIcon size={18} /> Map View
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto relative">
        {loading && <div className="absolute top-0 left-0 w-full h-1 bg-green-200 overflow-hidden"><div className="w-1/2 h-full bg-green-600 animate-pulse rounded-r-full"></div></div>}

        {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
        {success && <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg">{success}</div>}

        {/* BROWSE TAB */}
        {activeTab === 'browse' && (
          <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setActiveTab('browse')} className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-green-600">
                <ArrowUpDown className="rotate-90" size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Available Donations</h1>
            </div>
            
            {/* Filter Bar */}
            <form onSubmit={applyFilters} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
                  <input type="text" name="city" value={filters.city} onChange={handleFilterChange} placeholder="Filter by city..." className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="all">All Categories</option>
                  <option value="cooked">Cooked Food</option>
                  <option value="raw">Raw Ingredients</option>
                  <option value="packaged">Packaged</option>
                  <option value="beverages">Beverages</option>
                </select>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-500 mb-1">Max Distance</label>
                <select name="distance" value={filters.distance} onChange={handleFilterChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="">Any distance</option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                  <option value="20">Within 20 km</option>
                  <option value="50">Within 50 km</option>
                </select>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
                <select name="listingType" value={filters.listingType} onChange={handleFilterChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="all">All Types</option>
                  <option value="donation">Free Donation</option>
                  <option value="low-cost">Low Cost</option>
                </select>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
                <select name="sort" value={filters.sort} onChange={handleFilterChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                  <option value="newest">Newest First</option>
                  <option value="distance">Nearest Distance</option>
                  <option value="expiry">Expiring Soon</option>
                </select>
              </div>
              <button type="submit" className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2">
                <Filter size={18} /> Apply
              </button>
            </form>

            {listings.length === 0 && !loading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Search size={48} className="text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">No Food Available</h2>
                <p className="text-gray-500">There are no active food listings matching your filters right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map(listing => (
                  <div key={listing._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    {listing.images && listing.images.length > 0 ? (
                      <div className="h-48 w-full bg-gray-200 overflow-hidden">
                        <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
                        <MapIcon size={48} className="text-gray-300" />
                      </div>
                    )}
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${listing.listingType === 'donation' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {listing.listingType === 'donation' ? 'FREE' : `₹${listing.price}`}
                        </span>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize">{listing.category}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{listing.title}</h3>
                      <p className="text-sm text-gray-500 font-medium mb-3">By {listing.donorId?.name}</p>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2 font-medium text-gray-800"><List size={16} className="text-green-600"/> {listing.quantity} {listing.unit}</div>
                        <CountdownTimer expiryDate={listing.expiryDateTime} />
                        <div className="flex items-start gap-2"><MapPin size={16} className="text-blue-500 shrink-0 mt-0.5"/> <span className="line-clamp-1">{listing.pickupAddress}, {listing.city} {listing.distKm ? `(${listing.distKm.toFixed(1)} km away)` : ''}</span></div>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>
                    </div>
                    <div className="p-4 border-t border-gray-100 flex gap-2">
                      <button 
                        onClick={() => navigate(`/food/${listing._id}`)} 
                        className="flex-1 bg-white border-2 border-green-600 text-green-700 py-2 rounded-lg font-bold hover:bg-green-50 flex items-center justify-center transition-colors"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => handleRequestPickup(listing._id)} 
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
                      >
                        <HeartHandshake size={18} /> Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MY REQUESTS TAB */}
        {activeTab === 'requests' && (
          <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setActiveTab('browse')} className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-green-600">
                <ArrowUpDown className="rotate-90" size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
            </div>
            
            {requests.length === 0 && !loading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <List size={48} className="text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">No Requests Made</h2>
                <p className="text-gray-500">You haven't requested any food yet. Go to the Browse tab to find available donations.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requests.map(req => (
                  <div key={req._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                    {/* Status Ribbon */}
                    <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-xl font-bold text-xs shadow-sm ${
                      req.status === 'requested' ? 'bg-yellow-400 text-yellow-900' : 
                      req.status === 'confirmed' ? 'bg-blue-500 text-white' : 
                      req.status === 'picked_up' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                    }`}>
                      {req.status.toUpperCase()}
                    </div>

                    <div className="mb-4 pt-2">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-bold text-xl border border-green-100 shadow-inner">
                          {req.listingId?.title ? req.listingId.title.charAt(0).toUpperCase() : 'F'}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg leading-tight">{req.listingId?.title}</h3>
                          <p className="text-gray-500 text-xs mt-0.5">{new Date(req.requestedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4 text-sm">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                          <List size={16} className="text-gray-400" />
                          <p className="font-semibold text-gray-800">{req.listingId?.quantity} {req.listingId?.unit} <span className="font-normal text-gray-500">• {req.listingId?.listingType === 'low-cost' ? `₹${req.listingId?.price}` : 'Free'}</span></p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium text-xs mb-1">Donor Details</p>
                          <p className="font-bold text-gray-700">{req.donorId?.name}</p>
                          <p className="text-gray-600 mt-0.5">📍 {req.donorId?.address}, {req.donorId?.city}</p>
                          <p className="text-gray-600 mt-0.5">📞 {req.donorId?.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-auto pt-2">
                      {req.status === 'confirmed' && (
                        <button 
                          onClick={() => handleUpdateStatus(req._id, 'picked_up')} 
                          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-green-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={18} /> Mark as Picked Up
                        </button>
                      )}
                      
                      {(req.status === 'requested' || req.status === 'confirmed') && (
                        <button 
                          onClick={() => {
                            if(window.confirm('Are you sure you want to cancel this request?')) {
                              handleUpdateStatus(req._id, 'cancelled');
                            }
                          }} 
                          className="flex-1 px-4 py-3 border-2 border-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 hover:border-red-200 transition-colors"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      {/* MAP TAB */}
        {activeTab === 'map' && (
          <div className="space-y-6 max-w-6xl mx-auto h-[600px] flex flex-col animate-fade-in">
            <div className="flex items-center gap-4 mb-2">
              <button onClick={() => setActiveTab('browse')} className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-green-600">
                <ArrowUpDown className="rotate-90" size={20} />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Donations Near You</h1>
            </div>
            <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
              {userLoc ? (
                <MapContainer center={[userLoc.lat, userLoc.lng]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  
                  {/* User marker (Blue Pulse) */}
                  <Marker position={[userLoc.lat, userLoc.lng]} icon={userIcon}>
                    <Popup>
                      <div className="font-bold text-blue-600 text-center">You are here</div>
                    </Popup>
                  </Marker>
                  
                  {/* Listing markers (Green Pins) */}
                  {listings.map(listing => listing.location && listing.location.lat && (
                    <Marker key={listing._id} position={[listing.location.lat, listing.location.lng]} icon={foodIcon}>
                      <Popup>
                        <div className="font-bold text-green-700">{listing.title}</div>
                        <div className="text-sm text-gray-600">{listing.quantity} {listing.unit}</div>
                        <div className="text-xs text-gray-500 mt-1 mb-2 max-w-[150px] truncate">{listing.pickupAddress}</div>
                        <button onClick={() => { navigate(`/food/${listing._id}`); }} className="text-white text-xs font-bold mt-2 w-full text-center block bg-green-600 py-1.5 rounded hover:bg-green-700">Track & View</button>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                  Please enable location services to view the map.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NGODashboard;
