import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
  PlusCircle,
  List,
  Bell,
  MapPin,
  Clock,
  Trash2,
  CheckCircle,
  Tag,
  ArrowUpDown
} from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || "https://food-waste-reduction-server-vert.vercel.app";

const DonorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('listings');
  const [step, setStep] = useState(1);

  // Data State
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'cooked', quantity: '', unit: 'servings',
    expiryDateTime: '', listingType: 'donation', price: '', pickupAddress: '', city: ''
  });

  useEffect(() => {
    if (!user) navigate('/login');
    else if (user.role !== 'donor') navigate('/');
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user || user.role !== 'donor') return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (activeTab === 'listings') {
        const res = await axios.get(`${API_URL}/api/donor/my-listings`, config);
        setListings(res.data);
      } else if (activeTab === 'requests') {
        const res = await axios.get(`${API_URL}/api/donor/requests`, config);
        setRequests(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Pre-fill address for form if switching to 'add'
    if (activeTab === 'add' && user) {
      setStep(1);
      setFormData(prev => ({
        ...prev,
        pickupAddress: user.address || '',
        city: user.city || ''
      }));
    }
  }, [activeTab, user]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = { ...formData, images: formData.image ? [formData.image] : [] };
      await axios.post(`${API_URL}/api/donor/food`, payload, config);
      setSuccess('Food listed successfully! Volunteers will see it soon.');
      toast.success('Food listed successfully!', { icon: '🍲' });
      setFormData({
        title: '', description: '', quantity: '', category: 'cooked',
        expiryDateTime: '', address: '', city: '', pickupInstructions: '', image: ''
      });
      setTimeout(() => {
        setActiveTab('listings');
        setSuccess('');
      }, 2000);
    } catch (err) {
      toast.error('Failed to create listing');
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/api/donor/food/${id}`, config);
      setListings(listings.filter(l => l._id !== id));
      toast.success('Listing deleted');
    } catch (err) {
      toast.error('Failed to delete listing');
      console.error(err);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_URL}/api/donor/requests/${requestId}`, { status }, config);
      // Refresh requests to show updated status
      const res = await axios.get(`${API_URL}/api/donor/requests`, config);
      setRequests(res.data);
      toast.success(`Request ${status} successfully!`);
    } catch (err) {
      toast.error('Failed to update request');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'donor') return null;

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white shadow-md flex flex-col shrink-0 md:min-h-full">
        {/* Header — only visible on desktop */}
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <h2 className="text-xl font-bold text-gray-800">Donor Panel</h2>
          <p className="text-sm text-gray-500">{user.name}</p>
        </div>
        {/* Horizontal on mobile, vertical on desktop */}
        <nav className="flex flex-row md:flex-col p-3 md:p-4 gap-2 overflow-x-auto hide-scrollbar md:flex-1">
          <button onClick={() => setActiveTab('listings')} className={`shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-left font-semibold whitespace-nowrap transition-colors ${activeTab === 'listings' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <List size={18} /> My Listings
          </button>
          <button onClick={() => setActiveTab('add')} className={`shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-left font-semibold whitespace-nowrap transition-colors ${activeTab === 'add' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <PlusCircle size={18} /> Add Food
          </button>
          <button onClick={() => setActiveTab('requests')} className={`shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-left font-semibold whitespace-nowrap transition-colors ${activeTab === 'requests' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Bell size={18} /> Pickup Requests
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {loading && activeTab !== 'add' && <div className="text-green-600 animate-pulse mb-4">Loading data...</div>}

        {/* MY LISTINGS TAB */}
        {activeTab === 'listings' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveTab('listings')} className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-green-600">
                  <ArrowUpDown className="rotate-90" size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">My Food Listings</h1>
              </div>
              <button onClick={() => setActiveTab('add')} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 shadow-sm transition-colors w-full sm:w-auto justify-center">
                <PlusCircle size={18} /> New Listing
              </button>
            </div>

            {listings.length === 0 && !loading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <List size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">No Active Listings</h2>
                <p className="text-gray-500 mb-6">You haven't listed any surplus food yet.</p>
                <button onClick={() => setActiveTab('add')} className="bg-green-100 text-green-700 px-6 py-2 rounded-lg font-medium hover:bg-green-200">Get Started</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map(listing => (
                  <div key={listing._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    <div className="p-5 flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${listing.status === 'active' ? 'bg-blue-100 text-blue-700' :
                            listing.status === 'requested' ? 'bg-yellow-100 text-yellow-700' :
                              listing.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                          {listing.status}
                        </span>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded capitalize">{listing.category}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2"><Tag size={16} className="text-gray-400" /> {listing.quantity} {listing.unit}</div>
                        <CountdownTimer expiryDate={listing.expiryDateTime} />
                        <div className="flex items-start gap-2"><MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" /> <span className="line-clamp-1">{listing.pickupAddress}, {listing.city}</span></div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="font-bold text-green-700">{listing.listingType === 'low-cost' ? `₹${listing.price}` : 'Free Donation'}</span>
                      <button onClick={() => handleDeleteListing(listing._id)} className="text-red-500 hover:text-red-700 tooltip" title="Delete Listing">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD LISTING TAB */}
        {activeTab === 'add' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setActiveTab('listings')} className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-green-600">
                  <ArrowUpDown className="rotate-90" size={20} />
                </button>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><PlusCircle className="text-green-600" /> Create Food Listing</h2>
              </div>

              {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}
              {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 font-medium">{success}</div>}

              {/* Progress Bar */}
              <div className="mb-8 flex justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${(step - 1) * 33.33}%` }}></div>
                
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= s ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                    {s}
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-lg font-bold border-b pb-2">Step 1: Food Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input name="title" required value={formData.title} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. 50 Servings of Veg Biryani" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" rows="3" value={formData.description} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-green-500 outline-none" placeholder="Details about the food..."></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select name="category" value={formData.category} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                          <option value="cooked">Cooked Food</option>
                          <option value="raw">Raw/Uncooked Ingredients</option>
                          <option value="packaged">Packaged Food</option>
                          <option value="beverages">Beverages</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
                        <select name="listingType" value={formData.listingType} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                          <option value="donation">Free Donation</option>
                          <option value="low-cost">Low-Cost Sale</option>
                        </select>
                      </div>
                      {formData.listingType === 'low-cost' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                          <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-lg font-bold border-b pb-2">Step 2: Quantity & Expiry</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input type="number" name="quantity" required min="1" value={formData.quantity} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-green-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                        <select name="unit" value={formData.unit} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-green-500 outline-none bg-white">
                          <option value="servings">Servings / Plates</option>
                          <option value="kg">Kilograms (kg)</option>
                          <option value="items">Items / Packets</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date & Time</label>
                        <input type="datetime-local" name="expiryDateTime" required value={formData.expiryDateTime} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-green-500 outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Food Image (Optional)</label>
                        <div className="flex items-center gap-4">
                           <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 border border-gray-300 p-2 rounded-lg cursor-pointer" />
                           {formData.image && <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-gray-200"><img src={formData.image} alt="Preview" className="w-full h-full object-cover"/></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-lg font-bold border-b pb-2">Step 3: Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                        <input name="pickupAddress" required value={formData.pickupAddress} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-green-500 outline-none" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input name="city" required value={formData.city} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-green-500 outline-none" />
                      </div>
                      <div className="md:col-span-2">
                         <p className="text-sm text-gray-500">Your location will be shared with the requested NGO to find you on the map.</p>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <h3 className="text-lg font-bold border-b pb-2">Step 4: Review</h3>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                      <div><strong className="text-gray-700">Title:</strong> {formData.title}</div>
                      <div><strong className="text-gray-700">Description:</strong> {formData.description}</div>
                      <div><strong className="text-gray-700">Category:</strong> <span className="capitalize">{formData.category}</span></div>
                      <div><strong className="text-gray-700">Quantity:</strong> {formData.quantity} {formData.unit}</div>
                      <div><strong className="text-gray-700">Type:</strong> {formData.listingType === 'low-cost' ? `Low Cost (₹${formData.price})` : 'Free Donation'}</div>
                      <div><strong className="text-gray-700">Expiry:</strong> {formData.expiryDateTime && new Date(formData.expiryDateTime).toLocaleString()}</div>
                      <div><strong className="text-gray-700">Location:</strong> {formData.pickupAddress}, {formData.city}</div>
                    </div>
                  </div>
                )}

                <div className="pt-6 flex justify-between border-t border-gray-100">
                  {step > 1 ? (
                    <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors">Back</button>
                  ) : (
                    <button type="button" onClick={() => setActiveTab('listings')} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                  )}
                  
                  {step < 4 ? (
                    <button type="button" onClick={() => setStep(step + 1)} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors">Next Step</button>
                  ) : (
                    <button type="submit" disabled={loading} className={`px-8 py-2 bg-green-600 text-white rounded-lg font-bold shadow-md hover:bg-green-700 transition-colors ${loading ? 'opacity-70' : ''}`}>
                      {loading ? 'Publishing...' : 'Publish Food Listing'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* REQUESTS TAB */}
        {activeTab === 'requests' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setActiveTab('listings')} className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-green-600">
                <ArrowUpDown className="rotate-90" size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">Pickup Requests from NGOs</h2>
            </div>

            {requests.length === 0 && !loading ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <Bell size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No pickup requests yet. We will notify you when an NGO requests your food.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requests.map(req => {
                  // Guard: skip or show fallback if referenced docs were deleted
                  const ngo = req.ngoId;
                  const listing = req.listingId;
                  if (!ngo || !listing) {
                    return (
                      <div key={req._id} className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-center gap-4 text-gray-500">
                        <Tag size={20} className="text-red-300 shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-700">Request #{req._id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-gray-400 mt-1">The associated food listing or NGO record has been deleted.</p>
                        </div>
                        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${req.status === 'requested' ? 'bg-yellow-100 text-yellow-700' : req.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {req.status.toUpperCase()}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div key={req._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                      {/* Status Ribbon */}
                      <div className={`absolute top-0 right-0 px-4 py-1 rounded-bl-xl font-bold text-xs shadow-sm ${
                        req.status === 'requested' ? 'bg-yellow-400 text-yellow-900' :
                        req.status === 'confirmed' ? 'bg-blue-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {req.status.toUpperCase()}
                      </div>

                      <div className="mb-4 pt-2">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-bold text-xl border border-green-100 shadow-inner">
                            {ngo.name?.charAt(0).toUpperCase() ?? '?'}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{ngo.name ?? 'Unknown NGO'}</h3>
                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              Reg: {ngo.ngoRegNumber ?? 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4 text-sm">
                          <div className="flex items-start gap-2 mb-2">
                            <Tag size={16} className="text-gray-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-gray-500 font-medium text-xs mb-0.5">Requested Food</p>
                              <p className="font-bold text-gray-800">
                                {listing.title ?? 'Untitled'}{' '}
                                <span className="text-green-600">
                                  ({listing.quantity ?? '?'} {listing.unit ?? ''})
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock size={16} className="text-gray-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-gray-500 font-medium text-xs mb-0.5">Requested On</p>
                              <p className="font-semibold text-gray-700">{new Date(req.requestedAt).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 text-sm border-t border-gray-100 pt-4">
                          <p className="text-gray-500 font-medium text-xs mb-1">NGO Contact Details</p>
                          <p className="text-gray-800 font-medium">📞 {ngo.phone ?? 'N/A'}</p>
                          <p className="text-gray-600">✉️ {ngo.email ?? 'N/A'}</p>
                        </div>
                      </div>

                      {req.status === 'requested' && (
                        <div className="flex gap-3 mt-auto pt-4">
                          <button onClick={() => handleRequestAction(req._id, 'confirmed')} className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-green-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                            Accept Request
                          </button>
                          <button onClick={() => handleRequestAction(req._id, 'cancelled')} className="px-4 py-3 border-2 border-red-100 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 hover:border-red-200 transition-colors">
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DonorDashboard;
