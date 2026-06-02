const fs = require('fs');

let content = fs.readFileSync('src/pages/DonorDashboard.jsx', 'utf8');

// Replace the ADD LISTING TAB content with a multi-step form
const addListingTabStart = `{/* ADD LISTING TAB */}`;
const addListingTabEnd = `{/* REQUESTS TAB */}`;

const multiStepFormCode = `{/* ADD LISTING TAB */}
        {activeTab === 'add' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><PlusCircle className="text-green-600" /> Create Food Listing</h2>

              {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}
              {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 font-medium">{success}</div>}

              {/* Progress Bar */}
              <div className="mb-8 flex justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: \`\${(step - 1) * 33.33}%\` }}></div>
                
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={\`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 \${step >= s ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-500'}\`}>
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional for now)</label>
                        <input name="image" value={formData.image || ''} onChange={handleFormChange} className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-green-500 outline-none" placeholder="https://example.com/image.jpg" />
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
                      <div><strong className="text-gray-700">Type:</strong> {formData.listingType === 'low-cost' ? \`Low Cost ($\${formData.price})\` : 'Free Donation'}</div>
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
                    <button type="submit" disabled={loading} className={\`px-8 py-2 bg-green-600 text-white rounded-lg font-bold shadow-md hover:bg-green-700 transition-colors \${loading ? 'opacity-70' : ''}\`}>
                      {loading ? 'Publishing...' : 'Publish Food Listing'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* REQUESTS TAB */}`;

const startIndex = content.indexOf(addListingTabStart);
const endIndex = content.indexOf(addListingTabEnd);

if (startIndex !== -1 && endIndex !== -1) {
    content = content.slice(0, startIndex) + multiStepFormCode + content.slice(endIndex + addListingTabEnd.length);
}

// Add state for step
content = content.replace(
    "const [activeTab, setActiveTab] = useState('listings');",
    "const [activeTab, setActiveTab] = useState('listings');\n  const [step, setStep] = useState(1);"
);

// Reset step when active tab changes
content = content.replace(
    "if (activeTab === 'add' && user) {",
    "if (activeTab === 'add' && user) {\n      setStep(1);"
);

// Handle image correctly in API payload
content = content.replace(
    "await axios.post('http://localhost:5000/api/donor/food', formData, config);",
    "const payload = { ...formData, images: formData.image ? [formData.image] : [] };\n      await axios.post('http://localhost:5000/api/donor/food', payload, config);"
);


fs.writeFileSync('src/pages/DonorDashboard.jsx', content);
console.log('DonorDashboard.jsx updated');
