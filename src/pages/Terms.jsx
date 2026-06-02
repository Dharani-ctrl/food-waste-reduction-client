import React from 'react';
import { FileText, CheckCircle, XCircle, AlertTriangle, Scale } from 'lucide-react';

const Terms = () => (
  <div className="w-full flex justify-center py-16 px-4 bg-gray-50">
    <div className="max-w-3xl w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-xl"><FileText size={28} className="text-blue-600" /></div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Terms of Service</h1>
          <p className="text-sm text-gray-500 mt-0.5">Last updated: January 2026</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
        {[
          {
            icon: <CheckCircle size={20} className="text-green-500" />,
            title: '1. Acceptance of Terms',
            content: 'By registering on ZeroWaste, you agree to be bound by these Terms of Service. ZeroWaste is a free platform that facilitates food donations between food donors (restaurants, hotels, households, grocery stores) and registered NGOs. Misuse of the platform will result in immediate account suspension.'
          },
          {
            icon: <Scale size={20} className="text-blue-500" />,
            title: '2. Donor Responsibilities',
            content: 'Food donors must ensure all listed food is fit for human consumption at the time of listing. Donors must accurately describe the food type, quantity, expiry date/time, and pickup location. Donors are responsible for packaging food safely. Listing food that is already expired, spoiled, or unsafe is strictly prohibited and may result in account termination.'
          },
          {
            icon: <CheckCircle size={20} className="text-teal-500" />,
            title: '3. NGO Responsibilities',
            content: 'NGOs must be registered under applicable Indian law (e.g., under the Societies Registration Act or as a Section 8 Company). NGOs must ensure timely pickup of accepted donations and distribute food to intended beneficiaries. Misappropriation of donated food is a violation of these terms and may be reported to relevant authorities.'
          },
          {
            icon: <AlertTriangle size={20} className="text-yellow-500" />,
            title: '4. Food Safety Disclaimer',
            content: 'ZeroWaste is a coordination platform only. We do not physically handle, inspect, or guarantee the safety of food listed on the platform. Donors bear responsibility for food quality at the time of donation. Recipients should inspect food before distribution. ZeroWaste is not liable for any health issues arising from donated food.'
          },
          {
            icon: <XCircle size={20} className="text-red-400" />,
            title: '5. Prohibited Conduct',
            content: 'Users may not: list food for commercial resale, create fake accounts, spam other users, list harmful or adulterated food, impersonate another organization, or use the platform for any purpose other than food donation and rescue. Violations will result in permanent account banning.'
          },
          {
            icon: <Scale size={20} className="text-purple-500" />,
            title: '6. Limitation of Liability',
            content: 'ZeroWaste provides this platform "as is" without warranties. We are not liable for any direct, indirect, or consequential damages arising from use of the platform, including but not limited to failed pickups, food safety issues, or data loss. These terms are governed by the laws of India.'
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

      <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
        <p className="text-blue-800 text-sm font-medium">
          ⚖️ Questions about these terms? Contact us at{' '}
          <a href="mailto:foodsaverteam@gmail.com" className="font-bold underline hover:text-blue-600">foodsaverteam@gmail.com</a>
        </p>
      </div>
    </div>
  </div>
);

export default Terms;
