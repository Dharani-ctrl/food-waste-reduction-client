import React from 'react';
import { ShieldCheck, Eye, Lock, Database, Globe } from 'lucide-react';

const Privacy = () => (
  <div className="w-full flex justify-center py-16 px-4 bg-gray-50">
    <div className="max-w-3xl w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-xl"><ShieldCheck size={28} className="text-green-600" /></div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-0.5">Last updated: January 2026</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {[
          {
            icon: <Eye size={20} className="text-blue-500" />,
            title: '1. Information We Collect',
            content: 'We collect information you provide directly to us when creating an account — including your name, email address, phone number, organization name, and location. For donors, we collect food listing details. For NGOs, we collect registration numbers and service area information.'
          },
          {
            icon: <Database size={20} className="text-purple-500" />,
            title: '2. How We Use Your Information',
            content: 'Your information is used solely to facilitate food donations and pickups on the ZeroWaste platform. This includes matching donors with nearby NGOs, sending email notifications about accepted donations, and generating anonymized impact reports. We never sell your data to third parties.'
          },
          {
            icon: <Lock size={20} className="text-green-500" />,
            title: '3. Data Security',
            content: 'All passwords are encrypted using industry-standard bcrypt hashing. Communications between your browser and our servers are secured via HTTPS. We implement regular security audits and follow OWASP security best practices to protect your data.'
          },
          {
            icon: <Globe size={20} className="text-orange-500" />,
            title: '4. Third-Party Services',
            content: 'ZeroWaste uses third-party services including email delivery (Nodemailer/Gmail) for notification emails. These services only receive the minimum data needed to deliver notifications and are bound by their own privacy policies.'
          },
          {
            icon: <ShieldCheck size={20} className="text-teal-500" />,
            title: '5. Your Rights',
            content: 'You have the right to access, update, or delete your account data at any time by contacting us at foodsaverteam@gmail.com. You may opt out of email notifications via account settings. We will respond to all data requests within 30 days.'
          },
          {
            icon: <Eye size={20} className="text-red-400" />,
            title: '6. Cookies',
            content: 'ZeroWaste uses browser localStorage to keep you logged in. We do not use tracking cookies or third-party advertising cookies. Your session data is stored locally and cleared when you log out.'
          },
        ].map((section, i) => (
          <div key={i} className="px-8 py-6 flex gap-4">
            <div className="shrink-0 w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 mt-0.5">
              {section.icon}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 mb-2">{section.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-green-50 rounded-2xl border border-green-100">
        <p className="text-green-800 text-sm font-medium">
          📬 Questions about this policy? Email us at{' '}
          <a href="mailto:foodsaverteam@gmail.com" className="font-bold underline hover:text-green-600">foodsaverteam@gmail.com</a>
        </p>
      </div>
    </div>
  </div>
);

export default Privacy;
