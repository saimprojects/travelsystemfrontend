// src/pages/Features.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Globe, Clock, DollarSign, 
  Users, BarChart3, FileText, Settings,
  CheckCircle, Smartphone, Laptop,
  Cloud, Lock, Zap, Headphones,
  Award, TrendingUp, Calendar,
  Plane, CreditCard, Download
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      category: "Dashboard & Analytics",
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      items: [
        "Real-time business overview",
        "Revenue analytics & forecasting",
        "Agency performance metrics",
        "Multi-branch consolidation",
        "Custom report generation"
      ]
    },
    {
      category: "Umrah & Hajj Management",
      icon: <Globe className="w-8 h-8 text-green-600" />,
      items: [
        "Package creation & management",
        "Hotel & transport booking",
        "Visa tracking system",
        "Document upload & verification",
        "Group management",
        "Makkah & Madinah hotel mapping"
      ]
    },
    {
      category: "Visa Processing",
      icon: <FileText className="w-8 h-8 text-purple-600" />,
      items: [
        "Visa application tracking",
        "Document checklist",
        "Status updates",
        "Embassy appointment scheduling",
        "Visa expiry alerts"
      ]
    },
    {
      category: "Ticketing System",
      icon: <Plane className="w-8 h-8 text-indigo-600" />,
      items: [
        "Flight search & booking",
        "PNR management",
        "Ticket issuance",
        "Flight status tracking",
        "Multi-airline support"
      ]
    },
    {
      category: "Agent Management",
      icon: <Users className="w-8 h-8 text-orange-600" />,
      items: [
        "Multi-role access control",
        "Agent performance tracking",
        "Commission automation",
        "Team collaboration tools",
        "Activity logs"
      ]
    },
    {
      category: "Payment Processing",
      icon: <CreditCard className="w-8 h-8 text-red-600" />,
      items: [
        "Multiple payment methods",
        "Installment plans",
        "Payment tracking",
        "Invoice generation",
        "Refund management"
      ]
    },
    {
      category: "Client Management",
      icon: <Users className="w-8 h-8 text-teal-600" />,
      items: [
        "Customer database",
        "Booking history",
        "Communication logs",
        "Document management",
        "Loyalty program"
      ]
    },
    {
      category: "Security & Compliance",
      icon: <Shield className="w-8 h-8 text-gray-600" />,
      items: [
        "Role-based access",
        "Data encryption",
        "GDPR compliance",
        "Audit trails",
        "Two-factor authentication"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for Modern Travel Agencies
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Everything you need to manage your travel business efficiently in one integrated platform
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.category}</h3>
                </div>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start text-gray-600">
                      <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-1" size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
            <p className="text-lg text-gray-600">Connect with your favorite tools and services</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "WhatsApp", icon: "💬" },
              { name: "Email", icon: "📧" },
              { name: "SMS", icon: "📱" },
              { name: "Payment Gateway", icon: "💳" },
              { name: "Google Calendar", icon: "📅" },
              { name: "Dropbox", icon: "📁" },
              { name: "Excel Export", icon: "📊" },
              { name: "PDF Generator", icon: "📄" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-lg text-center shadow-sm">
                <span className="text-3xl mb-2 block">{item.icon}</span>
                <span className="text-gray-700 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Agency?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of travel agencies already using TAM
          </p>
          <Link
            to="/register-agency"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Features;