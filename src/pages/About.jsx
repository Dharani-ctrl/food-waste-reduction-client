import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Heart, Users, Truck, ShieldCheck, Globe, ArrowRight, Recycle, HeartHandshake, BarChart3 } from 'lucide-react';

const About = () => {
  const stats = [
    { value: '10,000+', label: 'Meals Rescued', icon: <HeartHandshake size={28} className="text-green-500" /> },
    { value: '500+', label: 'Food Donors', icon: <Heart size={28} className="text-orange-500" /> },
    { value: '120+', label: 'NGO Partners', icon: <Users size={28} className="text-blue-500" /> },
    { value: '30 Tons', label: 'Waste Prevented', icon: <Recycle size={28} className="text-teal-500" /> },
  ];

  const steps = [
    {
      num: '01', icon: <Leaf size={32} className="text-green-600" />,
      title: 'Donors List Food',
      desc: 'Restaurants, hotels, grocery stores, and households post surplus food with expiry details and pickup location.',
    },
    {
      num: '02', icon: <Globe size={32} className="text-blue-600" />,
      title: 'NGOs Browse & Request',
      desc: 'Registered NGOs discover nearby donations in real-time and send pickup requests with a single click.',
    },
    {
      num: '03', icon: <Truck size={32} className="text-orange-600" />,
      title: 'Pickup & Deliver',
      desc: 'Donors confirm the request. The NGO collects the food and distributes it to those in need.',
    },
    {
      num: '04', icon: <BarChart3 size={32} className="text-purple-600" />,
      title: 'Track Impact',
      desc: 'Every donation is logged. Donors and admins can track meals saved, waste reduced, and real-world impact.',
    },
  ];

  const values = [
    { icon: <ShieldCheck size={24} className="text-green-600" />, title: 'Transparency', desc: 'Every listing, request, and delivery is tracked and visible to all stakeholders.' },
    { icon: <Heart size={24} className="text-red-500" />, title: 'Compassion', desc: 'We believe no edible food should be wasted while anyone goes hungry.' },
    { icon: <Globe size={24} className="text-blue-500" />, title: 'Sustainability', desc: 'Reducing food waste directly cuts greenhouse gas emissions and conserves resources.' },
    { icon: <Users size={24} className="text-purple-500" />, title: 'Community', desc: 'Building bridges between food surplus and food scarcity in local communities.' },
  ];

  return (
    <div className="w-full">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-teal-500 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold mb-6 border border-white/30">
            <Leaf size={16} /> Food Waste Reduction Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Turning Surplus Food<br />
            <span className="text-yellow-300">Into Second Chances</span>
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            ZeroWaste is a technology-driven platform that connects food donors with NGOs to rescue surplus food, reduce environmental waste, and feed communities in need — all in real time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=donor" className="bg-white text-green-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 justify-center">
              Become a Donor <ArrowRight size={18} />
            </Link>
            <Link to="/register?role=ngo" className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors flex items-center gap-2 justify-center">
              Register Your NGO
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="mb-3">{s.icon}</div>
                <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-sm font-medium text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-green-600 font-bold text-sm uppercase tracking-widest">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-6 leading-tight">
                Zero Food Waste,<br />Zero Hunger
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                In India alone, an estimated <strong>68 million tonnes</strong> of food is wasted every year, while over 190 million people go to bed hungry. ZeroWaste exists to close that gap.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We provide a seamless, verified pipeline between food businesses generating surplus and the NGOs that can distribute it — eliminating friction, eliminating waste.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every meal rescued is a step toward a more sustainable planet and a more equitable society.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-600 text-white p-6 rounded-2xl">
                <p className="text-4xl font-extrabold mb-2">40%</p>
                <p className="text-green-100 text-sm">of all food produced globally is wasted</p>
              </div>
              <div className="bg-orange-500 text-white p-6 rounded-2xl mt-6">
                <p className="text-4xl font-extrabold mb-2">8%</p>
                <p className="text-orange-100 text-sm">of global greenhouse emissions from food waste</p>
              </div>
              <div className="bg-blue-600 text-white p-6 rounded-2xl">
                <p className="text-4xl font-extrabold mb-2">1 in 9</p>
                <p className="text-blue-100 text-sm">people worldwide suffer from hunger</p>
              </div>
              <div className="bg-teal-600 text-white p-6 rounded-2xl mt-6">
                <p className="text-4xl font-extrabold mb-2">₹0</p>
                <p className="text-teal-100 text-sm">cost to donors and NGOs — always free</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-green-600 font-bold text-sm uppercase tracking-widest">The Process</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">How ZeroWaste Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow group">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-green-600 text-white text-xs font-extrabold rounded-full flex items-center justify-center shadow">
                  {step.num}
                </div>
                <div className="mb-4 mt-2">{step.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-green-600 font-bold text-sm uppercase tracking-widest">What We Stand For</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="shrink-0 w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-teal-500 text-white px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Make a Difference?</h2>
          <p className="text-green-100 text-lg mb-8">
            Join hundreds of donors and NGOs already fighting food waste across India. It's free, fast, and impactful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=donor" className="bg-white text-green-700 px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              Join as Donor
            </Link>
            <Link to="/register?role=ngo" className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">
              Join as NGO
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
