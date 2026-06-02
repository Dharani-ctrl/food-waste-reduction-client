import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Users, HeartHandshake, Utensils, LayoutDashboard, BarChart3, Search, CheckCircle, Trash2, ShieldBan, Shield, ArrowUpDown, Download, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || "https://food-waste-reduction-server-vert.vercel.app/";
const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for dynamic data
  const [stats, setStats] = useState({ totalUsers: 0, totalNGOs: 0, activeDonations: 0, completedDonations: 0 });
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Protection: Redirect if not admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch data based on active tab
  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        if (activeTab === 'overview') {
          const res = await axios.get(`${API_URL}/api/admin/stats`, config);
          setStats(res.data);
        } else if (activeTab === 'users') {
          const res = await axios.get(`${API_URL}/api/admin/users`, config);
          setUsers(res.data);
        } else if (activeTab === 'listings') {
          const res = await axios.get(`${API_URL}/api/admin/listings`, config);
          setListings(res.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user]);

  // Action Handlers
  const handleUserStatus = async (id, isBlocked) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_URL}/api/admin/users/${id}/status`, { isBlocked }, config);
      setUsers(users.map(u => u._id === id ? { ...u, isBlocked } : u));
      toast.success(isBlocked ? 'User blocked' : 'User unblocked');
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/api/admin/users/${id}`, config);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
    }
  };

  const handleListingStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`${API_URL}/api/admin/listings/${id}/status`, { status }, config);
      setListings(listings.map(l => l._id === id ? { ...l, status } : l));
      toast.success(`Listing marked as ${status}`);
    } catch (error) {
      toast.error('Failed to update listing');
      console.error('Error updating listing:', error);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`${API_URL}/api/admin/listings/${id}`, config);
      setListings(listings.filter(l => l._id !== id));
      toast.success('Listing deleted successfully');
    } catch (error) {
      toast.error('Failed to delete listing');
      console.error('Error deleting listing:', error);
    }
  };

  if (!user || user.role !== 'admin') return null;

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  // Dynamic Chart Data
  const categoryData = listings.reduce((acc, listing) => {
    const cat = listing.category || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const categoryChartData = Object.keys(categoryData).map(k => ({ name: k.charAt(0).toUpperCase() + k.slice(1), value: categoryData[k] }));

  const cityData = listings.reduce((acc, listing) => {
    const city = listing.city || 'Unknown';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});
  const cityChartData = Object.keys(cityData).map(k => ({ name: k, value: cityData[k] }));
  
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="flex flex-col md:flex-row w-full h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white shadow-md flex flex-col shrink-0 z-10 md:h-full">
        <div className="p-6 border-b border-gray-100 hidden md:block">
          <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          <p className="text-sm text-gray-500">Welcome, {user.name}</p>
        </div>
        <nav className="flex flex-row md:flex-col p-4 gap-2 overflow-x-auto hide-scrollbar md:flex-1 w-full">
          <button onClick={() => setActiveTab('overview')} className={`shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold transition-all ${activeTab === 'overview' ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard size={20} /> <span className="hidden sm:inline">Dashboard Overview</span><span className="sm:hidden">Overview</span>
          </button>
          <button onClick={() => setActiveTab('users')} className={`shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold transition-all ${activeTab === 'users' ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            <HeartHandshake size={20} /> Manage Users
          </button>
          <button onClick={() => setActiveTab('listings')} className={`shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold transition-all ${activeTab === 'listings' ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Utensils size={20} /> Food Listings
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-bold transition-all ${activeTab === 'analytics' ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            <BarChart3 size={20} /> <span className="hidden sm:inline">Analytics & Reports</span><span className="sm:hidden">Analytics</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 relative">
        {loading && <div className="absolute top-0 left-0 w-full h-1 bg-green-200 overflow-hidden"><div className="w-1/2 h-full bg-green-600 animate-pulse rounded-r-full"></div></div>}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveTab('overview')} className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-green-600">
                  <ArrowUpDown className="rotate-90" size={20} />
                </button>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h2>
              </div>
              <div className="hidden sm:block text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">Live Data Sync</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white transform hover:-translate-y-1 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20"><Users size={100} /></div>
                <div className="relative z-10">
                  <p className="text-blue-100 font-semibold mb-1">Total Users</p>
                  <p className="text-4xl font-extrabold">{stats.totalUsers}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl shadow-lg text-white transform hover:-translate-y-1 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20"><HeartHandshake size={100} /></div>
                <div className="relative z-10">
                  <p className="text-emerald-100 font-semibold mb-1">Registered NGOs</p>
                  <p className="text-4xl font-extrabold">{stats.totalNGOs}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-2xl shadow-lg text-white transform hover:-translate-y-1 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20"><Utensils size={100} /></div>
                <div className="relative z-10">
                  <p className="text-amber-100 font-semibold mb-1">Active Listings</p>
                  <p className="text-4xl font-extrabold">{stats.activeDonations}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white transform hover:-translate-y-1 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 opacity-20"><CheckCircle size={100} /></div>
                <div className="relative z-10">
                  <p className="text-purple-100 font-semibold mb-1">Completed Donations</p>
                  <p className="text-4xl font-extrabold">{stats.completedDonations}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div className="flex items-start gap-4">
                <button onClick={() => setActiveTab('overview')} className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-green-600 mt-1">
                  <ArrowUpDown className="rotate-90" size={20} />
                </button>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Manage Users</h2>
                  <p className="text-gray-500 mt-1">View, block, or delete platform users.</p>
                </div>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm w-64" 
                />
                <Search className="absolute left-4 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wider">
                    <th className="p-5 font-bold">User Name</th>
                    <th className="p-5 font-bold">Email Address</th>
                    <th className="p-5 font-bold">Role</th>
                    <th className="p-5 font-bold">Status</th>
                    <th className="p-5 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan="5" className="p-12 text-center text-gray-500">No users found matching your search.</td></tr>
                  ) : filteredUsers.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-5 text-gray-900 font-semibold">{u.name}</td>
                      <td className="p-5 text-gray-600">{u.email}</td>
                      <td className="p-5">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold capitalize">{u.role}</span>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${!u.isBlocked ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {!u.isBlocked ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="p-5 flex justify-center gap-3">
                        {u.role !== 'admin' && (
                          <>
                            {!u.isBlocked ? (
                              <button onClick={() => handleUserStatus(u._id, true)} className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-xl transition-colors tooltip" title="Block User"><ShieldBan size={18} /></button>
                            ) : (
                              <button onClick={() => handleUserStatus(u._id, false)} className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-colors tooltip" title="Unblock User"><Shield size={18} /></button>
                            )}
                            <button onClick={() => handleDeleteUser(u._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors tooltip" title="Delete User"><Trash2 size={18} /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LISTINGS TAB */}
        {activeTab === 'listings' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-start gap-4 mb-6">
              <button onClick={() => setActiveTab('overview')} className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-green-600 mt-1">
                <ArrowUpDown className="rotate-90" size={20} />
              </button>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Food Listings</h2>
                <p className="text-gray-500 mt-1">Manage all active and past food donations.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wider">
                    <th className="p-5 font-bold">Donor Name</th>
                    <th className="p-5 font-bold">Listing Title</th>
                    <th className="p-5 font-bold">Category</th>
                    <th className="p-5 font-bold">Status</th>
                    <th className="p-5 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listings.length === 0 ? (
                    <tr><td colSpan="5" className="p-12 text-center text-gray-500">No active listings to moderate.</td></tr>
                  ) : listings.map(l => (
                    <tr key={l._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-5 text-gray-900 font-semibold">{l.donorId?.name || 'Unknown'}</td>
                      <td className="p-5 text-gray-600">{l.title}</td>
                      <td className="p-5 text-gray-600 capitalize">{l.category}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          l.status === 'requested' ? 'bg-yellow-100 text-yellow-700' : 
                          l.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          l.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="p-5 flex justify-center gap-3">
                        {l.status === 'requested' && (
                          <button onClick={() => handleListingStatus(l._id, 'active')} className="p-2 text-green-600 hover:bg-green-100 rounded-xl tooltip transition-colors" title="Reactivate"><CheckCircle size={18} /></button>
                        )}
                        <button onClick={() => handleListingStatus(l._id, 'expired')} className="p-2 text-orange-600 hover:bg-orange-100 rounded-xl tooltip transition-colors" title="Mark Expired"><XCircle size={18} /></button>
                        <button onClick={() => handleDeleteListing(l._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-xl tooltip transition-colors" title="Delete"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ANALYTICS & REPORTS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveTab('overview')} className="md:hidden p-2 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-green-600">
                    <ArrowUpDown className="rotate-90" size={20} />
                  </button>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Analytics & Reports</h2>
                </div>
                <p className="text-gray-500 mt-1">Real-time dynamic data visualization.</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm font-bold">
                  <Download size={18} /> CSV
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <BarChart3 size={20} className="text-green-600" /> Donations by Category
                </h3>
                <div className="h-72 w-full">
                  {categoryChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <BarChart3 size={20} className="text-blue-600" /> Donations by City
                </h3>
                <div className="h-72 w-full">
                  {cityChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cityChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#f3f4f6'}} />
                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">No data available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
