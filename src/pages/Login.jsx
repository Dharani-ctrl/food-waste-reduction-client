import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Leaf, LogIn, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(formData.email, formData.password);
      toast.success('Welcome back!', {
        icon: '👋',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      // Redirect based on role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'ngo') navigate('/ngo');
      else navigate('/donor');
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-green-600 py-6 px-8 flex flex-col items-center justify-center text-white">
          <Leaf className="h-12 w-12 mb-2" />
          <h2 className="text-3xl font-extrabold">Welcome Back</h2>
          <p className="text-green-100 mt-1">Sign in to continue making an impact</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg p-3 mb-6 text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                name="email"
                type="text"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-3 focus:border-green-500 focus:ring focus:ring-green-200 transition-colors outline-none"
                placeholder="you@example.com (or admin)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm border p-3 pr-10 focus:border-green-500 focus:ring focus:ring-green-200 transition-colors outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-green-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in...' : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
