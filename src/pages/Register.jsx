import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Leaf, UserPlus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const location = useLocation();
  const [role, setRole] = useState('donor');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: '', city: '',
    donorType: 'restaurant', ngoRegNumber: '', serviceArea: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam && ['donor', 'ngo'].includes(roleParam)) {
      setRole(roleParam);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const dataToSubmit = { ...formData, role };
      // Clean up fields based on role
      if (role !== 'donor') delete dataToSubmit.donorType;
      if (role !== 'ngo') {
        delete dataToSubmit.ngoRegNumber;
        delete dataToSubmit.serviceArea;
      }
      
      await register(dataToSubmit);
      
      // Show success message and redirect
      toast.success('Registration successful! Redirecting...', { icon: '🎉' });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to register');
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-green-600 py-6 px-8 flex flex-col items-center justify-center text-white">
          <Leaf className="h-10 w-10 mb-2" />
          <h2 className="text-3xl font-extrabold">Create an Account</h2>
          <p className="text-green-100 mt-1">Join ZeroWaste to make a difference</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-6 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 border border-green-200 rounded-lg p-3 mb-6 text-sm">
              {success}
            </div>
          )}
          
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">I am registering as a:</label>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={() => setRole('donor')}
                className={`px-6 py-3 rounded-lg font-medium border-2 transition-all ${role === 'donor' ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'border-gray-200 text-gray-500 hover:border-green-300'}`}
              >
                Food Donor
              </button>
              <button
                type="button"
                onClick={() => setRole('ngo')}
                className={`px-6 py-3 rounded-lg font-medium border-2 transition-all ${role === 'ngo' ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' : 'border-gray-200 text-gray-500 hover:border-green-300'}`}
              >
                NGO / Receiver
              </button>
            </div>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name / Organization Name</label>
                <input name="name" type="text" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-3 focus:border-green-500 focus:ring focus:ring-green-200 outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <input name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-3 focus:border-green-500 focus:ring focus:ring-green-200 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative mt-1">
                  <input name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm border p-3 pr-10 focus:border-green-500 focus:ring focus:ring-green-200 outline-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-green-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-3 focus:border-green-500 focus:ring focus:ring-green-200 outline-none" />
              </div>

              {role === 'donor' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Donor Type</label>
                  <select name="donorType" value={formData.donorType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-3 focus:border-green-500 focus:ring focus:ring-green-200 outline-none bg-white">
                    <option value="restaurant">Restaurant</option>
                    <option value="hotel">Hotel</option>
                    <option value="grocery">Grocery Store</option>
                    <option value="household">Household</option>
                    <option value="event">Event Organizer</option>
                  </select>
                </div>
              )}

              {role === 'ngo' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">NGO Registration Number</label>
                    <input name="ngoRegNumber" type="text" required value={formData.ngoRegNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-3 focus:border-green-500 focus:ring focus:ring-green-200 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service Area (e.g. Downtown, North Zone)</label>
                    <input name="serviceArea" type="text" required value={formData.serviceArea} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-3 focus:border-green-500 focus:ring focus:ring-green-200 outline-none" />
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input name="address" type="text" required value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-3 focus:border-green-500 focus:ring focus:ring-green-200 outline-none" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input name="city" type="text" required value={formData.city} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-3 focus:border-green-500 focus:ring focus:ring-green-200 outline-none" />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating account...' : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Register as {role.charAt(0).toUpperCase() + role.slice(1)}
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
