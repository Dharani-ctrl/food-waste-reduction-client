const fs = require('fs');
let content = fs.readFileSync('src/pages/NGODashboard.jsx', 'utf8');

// Add imports
content = content.replace(
  "import { \n  Search, \n  MapPin, \n  Clock, \n  Filter, \n  List, \n  CheckCircle,\n  Truck,\n  HeartHandshake\n} from 'lucide-react';",
  "import { Search, MapPin, Clock, Filter, List, CheckCircle, Truck, HeartHandshake, Map as MapIcon } from 'lucide-react';\nimport { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';\nimport L from 'leaflet';\n\n// Fix leaflet icon issue\ndelete L.Icon.Default.prototype._getIconUrl;\nL.Icon.Default.mergeOptions({\n  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',\n  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',\n  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',\n});"
);

// Add location state
content = content.replace(
  "const [filters, setFilters] = useState({ city: '', category: 'all', listingType: 'all' });",
  "const [filters, setFilters] = useState({ city: '', category: 'all', listingType: 'all', distance: '' });\n  const [userLoc, setUserLoc] = useState(null);"
);

// Add location fetch effect
content = content.replace(
  "useEffect(() => {\n    if (!user) navigate('/login');\n    else if (user.role !== 'ngo') navigate('/');\n  }, [user, navigate]);",
  "useEffect(() => {\n    if (!user) navigate('/login');\n    else if (user.role !== 'ngo') navigate('/');\n    \n    if (navigator.geolocation) {\n      navigator.geolocation.getCurrentPosition(\n        (position) => setUserLoc({ lat: position.coords.latitude, lng: position.coords.longitude }),\n        (err) => console.log(err)\n      );\n    }\n  }, [user, navigate]);"
);

// Distance calculation
content = content.replace(
  "const res = await axios.get(queryUrl, config);\n      setListings(res.data);",
  `const res = await axios.get(queryUrl, config);
      let data = res.data;
      if (filters.distance && userLoc) {
        data = data.filter(item => {
          if (!item.location || !item.location.lat) return false;
          const R = 6371; // km
          const dLat = (item.location.lat - userLoc.lat) * Math.PI / 180;
          const dLng = (item.location.lng - userLoc.lng) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(userLoc.lat * Math.PI / 180) * Math.cos(item.location.lat * Math.PI / 180) *
                    Math.sin(dLng/2) * Math.sin(dLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const d = R * c;
          return d <= parseInt(filters.distance);
        });
      }
      setListings(data);`
);

// Add Sidebar nav map button
content = content.replace(
  "<List size={20} /> My Requests\n          </button>",
  "<List size={20} /> My Requests\n          </button>\n          <button onClick={() => setActiveTab('map')} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium whitespace-nowrap transition-colors ${activeTab === 'map' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>\n            <MapIcon size={20} /> Map View\n          </button>"
);

// Add map view tab content at the end before </main>
content = content.replace(
  "</main>",
  `{/* MAP TAB */}
        {activeTab === 'map' && (
          <div className="space-y-6 max-w-6xl mx-auto h-[600px] flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Donations Near You</h1>
            <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
              {userLoc ? (
                <MapContainer center={[userLoc.lat, userLoc.lng]} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  
                  {/* User marker */}
                  <Marker position={[userLoc.lat, userLoc.lng]}>
                    <Popup>Your Location</Popup>
                  </Marker>
                  
                  {/* Listing markers */}
                  {listings.map(listing => listing.location && listing.location.lat && (
                    <Marker key={listing._id} position={[listing.location.lat, listing.location.lng]}>
                      <Popup>
                        <div className="font-bold">{listing.title}</div>
                        <div className="text-sm">{listing.quantity} {listing.unit}</div>
                        <button onClick={() => { setActiveTab('browse'); }} className="text-green-600 text-xs font-bold mt-2">View details</button>
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
      </main>`
);

// Add distance filter input
content = content.replace(
  "<div className=\"flex-1 w-full\">\n                <label className=\"block text-xs font-medium text-gray-500 mb-1\">Type</label>",
  "<div className=\"flex-1 w-full\">\n                <label className=\"block text-xs font-medium text-gray-500 mb-1\">Max Distance</label>\n                <select name=\"distance\" value={filters.distance} onChange={handleFilterChange} className=\"w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white\">\n                  <option value=\"\">Any distance</option>\n                  <option value=\"5\">Within 5 km</option>\n                  <option value=\"10\">Within 10 km</option>\n                  <option value=\"20\">Within 20 km</option>\n                  <option value=\"50\">Within 50 km</option>\n                </select>\n              </div>\n              <div className=\"flex-1 w-full\">\n                <label className=\"block text-xs font-medium text-gray-500 mb-1\">Type</label>"
);

fs.writeFileSync('src/pages/NGODashboard.jsx', content);
console.log('NGODashboard.jsx updated successfully!');
