// HomePage.jsx (Updated Version)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, X, CheckCircle, Users, 
  BarChart3, Shield, Globe, Clock,
  DollarSign, FileText, Settings, 
  TrendingUp, Star
} from 'lucide-react';
import RegisterPopup from '../components/RegisterPopup'; // Import the popup

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Register Popup */}
      <RegisterPopup 
        isOpen={isRegisterPopupOpen} 
        onClose={() => setIsRegisterPopupOpen(false)} 
      />

      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-blue-600">TAM</span>
                <span className="ml-1 text-sm text-gray-500 hidden sm:inline">Travel Agency Management</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link to="/features" className="text-gray-700 hover:text-blue-600">Features</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
              
              {/* Register Agency Button - Opens Popup */}
              <button 
                onClick={() => setIsRegisterPopupOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Register Agency
              </button>
              
              {/* Login Button - Redirects to /login */}
              <Link 
                to="/login" 
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
              >
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <Link to="/" className="block py-2 text-gray-700">Home</Link>
              <Link to="/features" className="block py-2 text-gray-700">Features</Link>
              <Link to="/pricing" className="block py-2 text-gray-700">Pricing</Link>
              <Link to="/about" className="block py-2 text-gray-700">About</Link>
              <Link to="/contact" className="block py-2 text-gray-700">Contact</Link>
              
              {/* Mobile Register Button - Opens Popup */}
              <button 
                onClick={() => {
                  setIsRegisterPopupOpen(true);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-blue-600 font-semibold"
              >
                Register Agency
              </button>
              
              {/* Mobile Login Button */}
              <Link 
                to="/login" 
                className="block py-2 text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                All-in-One Travel Agency Management System for{' '}
                <span className="text-blue-600">Umrah, Hajj & Visa Businesses</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Streamline bookings, manage agents, track payments, automate commissions, 
                and grow your travel business — all from one powerful cloud platform.
              </p>
              
              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {/* Register Button in Hero - Opens Popup */}
                <button 
                  onClick={() => setIsRegisterPopupOpen(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
                >
                  🚀 Start Free Demo
                </button>
                <Link 
                  to="/consultation" 
                  className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
                >
                  📞 Book a Consultation
                </Link>
              </div>
              
              {/* Trust Line */}
              <p className="mt-6 text-sm text-gray-500">
                ✨ Trusted by Travel Agencies Across Pakistan & International Markets
              </p>
            </div>
            
            {/* Right Image Placeholder */}
            <div className="hidden md:block">
              <div className="bg-white p-4 rounded-2xl shadow-xl">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-8 text-white">
                  <div className="text-center">
                    <span className="text-4xl font-bold">TAM</span>
                    <p className="mt-2">Your Complete Travel Business OS</p>
                    
                    {/* Quick Action Buttons in Hero Image */}
                    <div className="mt-6 flex gap-3 justify-center">
                      <button
                        onClick={() => setIsRegisterPopupOpen(true)}
                        className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100"
                      >
                        Register Agency
                      </button>
                      <Link
                        to="/login"
                        className="bg-transparent border border-white text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white hover:text-blue-600"
                      >
                        Login
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
            Running a Travel Agency Shouldn't Be This Complicated
          </h2>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Manual booking records in Excel",
              "Lost payment tracking",
              "No commission automation",
              "Confusion between agents & accountants",
              "No real-time reporting",
              "Data scattered across WhatsApp & notebooks"
            ].map((problem, index) => (
              <div key={index} className="bg-red-50 p-6 rounded-xl">
                <div className="flex items-start">
                  <span className="text-red-500 mr-3">❌</span>
                  <p className="text-gray-700">{problem}</p>
                </div>
              </div>
            ))}
          </div>
          
          <p className="mt-8 text-center text-lg font-semibold text-blue-600">
            TAM solves all of this with one centralized system.
          </p>

          {/* Add Register Button after Problem Section */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsRegisterPopupOpen(true)}
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Register Your Agency Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Meet TAM – Your Complete Travel Business Operating System
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              TAM is a cloud-based Travel Agency Management System built specifically for:
              Umrah & Hajj operators, Visa processing agencies, Ticketing businesses, 
              and Multi-agent travel companies.
            </p>
            <p className="mt-2 text-blue-600 font-semibold">
              It centralizes operations, automates workflows, and increases profitability.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Every Role
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Owner Dashboard */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <BarChart3 className="text-blue-600 mr-3" size={28} />
                <h3 className="text-xl font-bold text-gray-900">Owner Dashboard</h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Full business overview",
                  "Revenue analytics",
                  "Agency performance insights",
                  "Multi-branch control",
                  "Role-based access management"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle className="text-green-500 mr-2" size={18} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Manager Panel */}
            <div className="bg-indigo-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Users className="text-indigo-600 mr-3" size={28} />
                <h3 className="text-xl font-bold text-gray-900">Manager Panel</h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Booking approvals",
                  "Package creation",
                  "Client management",
                  "Agent monitoring",
                  "Task tracking"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle className="text-green-500 mr-2" size={18} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Agent Panel */}
            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <Users className="text-purple-600 mr-3" size={28} />
                <h3 className="text-xl font-bold text-gray-900">Agent Panel</h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Create & manage bookings",
                  "Add customer details",
                  "Track assigned packages",
                  "Monitor commission status"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle className="text-green-500 mr-2" size={18} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Accountant Panel */}
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <DollarSign className="text-green-600 mr-3" size={28} />
                <h3 className="text-xl font-bold text-gray-900">Accountant Panel</h3>
              </div>
              <ul className="space-y-2">
                {[
                  "Payment tracking",
                  "Expense management",
                  "Commission automation",
                  "Financial reporting",
                  "Profit & loss overview"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700">
                    <CheckCircle className="text-green-500 mr-2" size={18} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <Globe className="mx-auto text-blue-600 mb-3" size={32} />
              <h4 className="font-semibold">Umrah & Hajj Booking</h4>
            </div>
            <div className="text-center p-4">
              <FileText className="mx-auto text-blue-600 mb-3" size={32} />
              <h4 className="font-semibold">Ticketing & Visa</h4>
            </div>
            <div className="text-center p-4">
              <TrendingUp className="mx-auto text-blue-600 mb-3" size={32} />
              <h4 className="font-semibold">Advanced Analytics</h4>
            </div>
            <div className="text-center p-4">
              <Shield className="mx-auto text-blue-600 mb-3" size={32} />
              <h4 className="font-semibold">Secure Admin Control</h4>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            How TAM Works in 3 Simple Steps
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Setup Your Agency</h3>
              <p className="text-gray-600">Create your agency profile and invite your team.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Manage Bookings & Payments</h3>
              <p className="text-gray-600">Track clients, assign agents, manage commissions automatically.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Monitor Growth</h3>
              <p className="text-gray-600">Use analytics dashboard to scale and optimize operations.</p>
            </div>
          </div>

          {/* Register Button in How It Works */}
          <div className="mt-10 text-center">
            <button
              onClick={() => setIsRegisterPopupOpen(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Start Your 7-Day Free Trial
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose TAM */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose TAM?
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Built specifically for travel agencies",
              "Scalable SaaS architecture",
              "Role-based access control",
              "Cloud-based (Access Anywhere)",
              "Fast & Secure",
              "Designed for Pakistani & International Markets",
              "Dedicated support",
              "Real-time updates"
            ].map((reason, i) => (
              <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={20} />
                <span className="text-gray-700">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-12 md:py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Perfect For Every Travel Business
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Small Travel Agencies",
              "Large Umrah Operators",
              "Visa Consultants",
              "Multi-Branch Agencies",
              "Growing Travel Startups",
              "Ticketing Companies",
              "Hajj Operators",
              "Tour Operators"
            ].map((audience, i) => (
              <div key={i} className="bg-blue-500 p-4 rounded-lg">
                <p className="font-semibold">{audience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Placeholder */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">
            Flexible Plans for Every Agency
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Choose the perfect plan for your business needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {['Starter', 'Professional', 'Enterprise'].map((plan, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-2">{plan}</h3>
                <p className="text-gray-600 mb-4">For {plan.toLowerCase()} agencies</p>
                <p className="text-3xl font-bold text-blue-600 mb-4">Contact Us</p>
                <button
                  onClick={() => setIsRegisterPopupOpen(true)}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Clients Say
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="text-gray-700 italic">"TAM transformed how we manage our Umrah bookings."</p>
              <p className="mt-4 font-semibold">- Muhammad Ali, Umrah Operator</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-current" size={20} />
                ))}
              </div>
              <p className="text-gray-700 italic">"Our revenue tracking became 100% transparent."</p>
              <p className="mt-4 font-semibold">- Sarah Ahmed, Travel Agency Owner</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Digitize Your Travel Agency?
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            Stop managing your business manually. Start using TAM today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsRegisterPopupOpen(true)}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              🚀 Request Demo
            </button>
            <Link 
              to="/contact" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              📞 Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TAM</h3>
              <p className="text-gray-400">Travel Agency Management System</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button 
                    onClick={() => setIsRegisterPopupOpen(true)}
                    className="hover:text-white"
                  >
                    Register Agency
                  </button>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 TAM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;