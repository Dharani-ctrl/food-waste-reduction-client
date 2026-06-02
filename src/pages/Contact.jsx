import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Message sent successfully! We will get back to you soon.', { icon: '📨' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="w-full flex-1 bg-gray-50 pb-16">
      {/* Hero Section */}
      <div className="bg-green-600 text-white py-16 text-center px-4">
        <h1 className="text-4xl font-extrabold mb-4">Get in Touch</h1>
        <p className="text-green-100 text-lg max-w-2xl mx-auto">
          Have questions about donating food, registering your NGO, or partnering with us? We're here to help you make an impact.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0"><Mail size={24} /></div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                <p className="text-sm text-gray-500 mb-2">Our friendly team is here to help.</p>
                <a href="mailto:foodsaverteam@gmail.com" className="text-green-600 font-semibold hover:underline">foodsaverteam@gmail.com</a>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl shrink-0"><Phone size={24} /></div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                <p className="text-sm text-gray-500 mb-2">Mon-Fri from 8am to 5pm.</p>
                <p className="text-green-600 font-semibold">+91 98765 43210</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0"><MapPin size={24} /></div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Headquarters</h3>
                <p className="text-sm text-gray-500">
                  123 Green Avenue, Tech Park<br />
                  Chennai, Tamil Nadu 600001<br />
                  India
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-8 border border-gray-100 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -z-10 opacity-50"></div>
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="text-green-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Send a Message</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full rounded-lg border-gray-300 border p-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full rounded-lg border-gray-300 border p-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input required name="subject" value={formData.subject} onChange={handleChange} type="text" className="w-full rounded-lg border-gray-300 border p-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors" placeholder="How can we help?" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea required name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full rounded-lg border-gray-300 border p-3 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors resize-none" placeholder="Write your message here..."></textarea>
              </div>
              
              <button disabled={loading} type="submit" className={`w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {loading ? 'Sending...' : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
