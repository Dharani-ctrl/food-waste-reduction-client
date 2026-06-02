import React from 'react';
import { Bell, CheckCircle, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

const Notifications = () => {
  // Mock data for alerts as there is no backend table for notifications yet
  const alerts = [
    { id: 1, type: 'success', title: 'Pickup Confirmed', message: 'Green Restaurant has confirmed your pickup request for 50 Servings of Veg Biryani.', time: '2 hours ago' },
    { id: 2, type: 'info', title: 'New Donation Nearby', message: 'A new donation of Packaged Foods is available within 5km of your service area.', time: '5 hours ago' },
    { id: 3, type: 'warning', title: 'Food Expiring Soon', message: 'The Raw Vegetables you requested will expire in 2 hours. Please complete the pickup.', time: '1 day ago' },
    { id: 4, type: 'admin', title: 'System Update', message: 'Welcome to ZeroWaste! Thank you for registering your NGO.', time: '3 days ago' },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <div className="p-2 bg-green-50 rounded-full text-green-500"><CheckCircle size={20} /></div>;
      case 'info': return <div className="p-2 bg-blue-50 rounded-full text-blue-500"><Info size={20} /></div>;
      case 'warning': return <div className="p-2 bg-yellow-50 rounded-full text-yellow-500"><AlertTriangle size={20} /></div>;
      case 'admin': return <div className="p-2 bg-purple-50 rounded-full text-purple-500"><ShieldCheck size={20} /></div>;
      default: return <div className="p-2 bg-gray-50 rounded-full text-gray-500"><Bell size={20} /></div>;
    }
  };

  const getBgClass = (type) => {
    switch(type) {
      case 'success': return 'bg-green-50 border-green-100';
      case 'info': return 'bg-blue-50 border-blue-100';
      case 'warning': return 'bg-yellow-50 border-yellow-100';
      case 'admin': return 'bg-purple-50 border-purple-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="w-full flex-1 flex justify-center py-8 bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[600px] border border-gray-100 relative">
        {/* Top Header similar to Mobile UI */}
        <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Notifications</h1>
            <p className="text-sm font-medium text-gray-500 mt-0.5">2 unread messages</p>
          </div>
          <button className="text-sm flex items-center gap-1.5 font-bold text-gray-400 hover:text-green-600 transition-colors">
            <CheckCircle size={16} /> Read All
          </button>
        </div>
        
        {/* Notification List */}
        <div className="flex-1 overflow-y-auto">
          {alerts.map((alert, index) => (
            <div key={alert.id} className={`px-6 py-5 flex items-start gap-4 cursor-pointer transition-colors border-b border-gray-50 hover:bg-gray-50 ${index < 2 ? 'bg-green-50/20' : 'bg-white'}`}>
              <div className="shrink-0 mt-0.5">
                {getIcon(alert.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-base ${index < 2 ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>{alert.title}</h3>
                  {index < 2 && <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-1.5 shadow-sm"></div>}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-2 pr-4">{alert.message}</p>
                <span className="text-xs font-semibold text-gray-400">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
