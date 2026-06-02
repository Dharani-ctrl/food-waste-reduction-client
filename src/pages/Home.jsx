import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, MapPin, Clock, ArrowRight, ShieldCheck, Utensils } from 'lucide-react';

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/40 mix-blend-overlay"></div>
          {/* Abstract circles for background decoration */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-green-200/50 blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-emerald-200/50 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium mb-6 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
            Join the movement against food waste
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 max-w-4xl leading-tight">
            Share food, <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">share hope.</span><br />
            Let's build a zero-waste world.
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
            Connect surplus food from restaurants, events, and households directly to NGOs and people in need. Stop wasting, start feeding.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-green-700 shadow-xl shadow-green-200 transition-all transform hover:-translate-y-1">
              Start Donating
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="inline-flex items-center justify-center bg-white text-green-700 border-2 border-green-100 px-8 py-4 rounded-full text-lg font-bold hover:border-green-200 hover:bg-green-50 transition-all">
              Login to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white relative z-20 -mt-16 mx-4 sm:mx-8 md:mx-auto max-w-5xl rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="flex flex-col items-center p-8 text-center">
            <div className="bg-green-100 p-4 rounded-2xl mb-4 text-green-600">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">500+</h3>
            <p className="text-gray-500 font-medium">Registered NGOs</p>
          </div>
          <div className="flex flex-col items-center p-8 text-center">
            <div className="bg-emerald-100 p-4 rounded-2xl mb-4 text-emerald-600">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">50k+</h3>
            <p className="text-gray-500 font-medium">Meals Rescued</p>
          </div>
          <div className="flex flex-col items-center p-8 text-center">
            <div className="bg-teal-100 p-4 rounded-2xl mb-4 text-teal-600">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">1000+</h3>
            <p className="text-gray-500 font-medium">Active Donors</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How ZeroWaste Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">A simple, transparent, and quick process to ensure food reaches the right people before it expires.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-green-50 rounded-3xl transform group-hover:scale-105 transition-transform duration-300 -z-10"></div>
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-green-600 font-bold text-2xl border-4 border-green-100">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">List Surplus Food</h3>
                <p className="text-gray-600">Donors (restaurants, events, households) list available food with quantity and expiry details.</p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-green-50 rounded-3xl transform group-hover:scale-105 transition-transform duration-300 -z-10"></div>
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-green-600 font-bold text-2xl border-4 border-green-100">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">NGOs Get Notified</h3>
                <p className="text-gray-600">Nearby verified NGOs browse listings on the map and request a pickup for the required quantity.</p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute inset-0 bg-green-50 rounded-3xl transform group-hover:scale-105 transition-transform duration-300 -z-10"></div>
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-green-600 font-bold text-2xl border-4 border-green-100">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Pickup & Distribute</h3>
                <p className="text-gray-600">NGOs pick up the food and distribute it to those in need, updating the status to completed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-green-800 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-green-800 opacity-50 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <ShieldCheck className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-6">Ready to make an impact?</h2>
          <p className="text-green-100 text-lg mb-10">Whether you have surplus food to give, or you're an NGO ready to distribute, your contribution matters.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register?role=donor" className="bg-white text-green-900 px-8 py-4 rounded-full font-bold hover:bg-green-50 transition-colors shadow-lg">
              I want to Donate Food
            </Link>
            <Link to="/register?role=ngo" className="bg-green-700 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 transition-colors border border-green-600">
              I am an NGO
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
