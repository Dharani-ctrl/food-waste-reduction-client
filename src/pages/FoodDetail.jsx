import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Clock, MapPin, List, ArrowLeft, HeartHandshake, Info } from 'lucide-react';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestStatus, setRequestStatus] = useState(''); // requested, null, processing
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // We can use the existing NGO endpoint if it allows fetch by ID, but there isn't one directly.
        // Wait, backend doesn't have /api/ngo/listings/:id. Let's just fetch all and find, or we can add an endpoint.
        // For simplicity and since we don't want to modify backend routes unless needed, let's fetch all and filter.
        const res = await axios.get(`http://localhost:5000/api/ngo/listings`, config);
        const found = res.data.find(l => l._id === id);
        if (found) {
          setListing(found);
        } else {
          setError('Food listing not found or no longer available.');
        }
      } catch (err) {
        setError('Failed to load food details.');
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'ngo') {
      fetchListing();
    } else {
      navigate('/login');
    }
  }, [id, user, navigate]);

  useEffect(() => {
    if (!listing) return;
    
    const updateCountdown = () => {
      const expiry = new Date(listing.expiryDateTime).getTime();
      const now = new Date().getTime();
      const diff = expiry - now;
      
      if (diff <= 0) {
        setTimeLeft('Expired');
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [listing]);

  const handleRequest = async () => {
    try {
      setRequestStatus('processing');
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`http://localhost:5000/api/ngo/request/${listing._id}`, {}, config);
      setRequestStatus('requested');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request pickup');
      setRequestStatus('');
    }
  };

  if (loading) return <div className="p-12 text-center text-green-600 font-bold">Loading...</div>;
  if (error) return <div className="p-12 text-center text-red-600 font-bold">{error}</div>;
  if (!listing) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 my-8 w-full">
      <Link to="/ngo" className="inline-flex items-center gap-2 text-green-600 font-bold hover:text-green-800 mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>
      
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Image */}
        <div className="w-full md:w-2/5 bg-gray-100 min-h-[300px] relative flex items-center justify-center">
          {listing.images && listing.images.length > 0 ? (
            <img src={listing.images[0]} alt={listing.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="text-gray-400 flex flex-col items-center gap-2">
               <Info size={48} />
               <span>No Image Provided</span>
            </div>
          )}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-gray-800 uppercase shadow-sm">
            {listing.category}
          </div>
          <div className={`absolute top-4 right-4 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold uppercase shadow-sm ${listing.listingType === 'donation' ? 'bg-green-500/90 text-white' : 'bg-blue-500/90 text-white'}`}>
            {listing.listingType === 'donation' ? 'FREE' : `$${listing.price}`}
          </div>
        </div>
        
        {/* Right Side: Details */}
        <div className="w-full md:w-3/5 p-8 flex flex-col">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{listing.title}</h1>
          <p className="text-gray-500 mb-6 leading-relaxed">{listing.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-green-50 p-4 rounded-2xl flex flex-col justify-center border border-green-100">
                <div className="flex items-center gap-2 text-green-700 font-semibold mb-1"><List size={18}/> Quantity</div>
                <div className="text-2xl font-bold text-gray-900">{listing.quantity} {listing.unit}</div>
             </div>
             
             <div className="bg-red-50 p-4 rounded-2xl flex flex-col justify-center border border-red-100">
                <div className="flex items-center gap-2 text-red-700 font-semibold mb-1"><Clock size={18}/> Expires In</div>
                <div className="text-xl font-bold text-red-600 font-mono tracking-tighter">{timeLeft}</div>
             </div>
          </div>
          
          <div className="space-y-4 mb-8 flex-1">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><Info size={20} /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Donor Information</p>
                <p className="font-bold text-gray-900">{listing.donorId?.name}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><MapPin size={20} /></div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Pickup Location</p>
                <p className="font-bold text-gray-900">{listing.pickupAddress}, {listing.city}</p>
              </div>
            </div>
          </div>
          
          {requestStatus === 'requested' ? (
            <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-bold">
              Pickup Requested! Check your dashboard.
            </div>
          ) : (
            <button 
              onClick={handleRequest} 
              disabled={timeLeft === 'Expired' || requestStatus === 'processing'}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${timeLeft === 'Expired' ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 shadow-xl shadow-green-200 hover:-translate-y-1'}`}
            >
              <HeartHandshake size={24} />
              {requestStatus === 'processing' ? 'Processing...' : (timeLeft === 'Expired' ? 'Listing Expired' : 'Request This Donation')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
