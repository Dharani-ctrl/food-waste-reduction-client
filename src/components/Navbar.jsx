import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Leaf, Menu, X, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="font-bold text-2xl text-green-700">ZeroWaste</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-green-600 font-medium transition-colors">About Us</Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={user.role === 'admin' ? '/admin' : user.role === 'ngo' ? '/ngo' : '/donor'}
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link to="/notifications" className="text-gray-500 hover:text-green-600 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-green-600 font-medium hover:text-green-700 transition-colors">Login</Link>
                <Link to="/register" className="bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-green-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md">Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md">About Us</Link>

            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : user.role === 'ngo' ? '/ngo' : '/donor'}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md"
                >
                  Dashboard
                </Link>
                <Link to="/notifications" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md flex items-center gap-2">
                  <Bell className="w-5 h-5" /> Notifications
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-4 flex flex-col gap-3 px-3">
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center border border-green-600 text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 shadow-md">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
