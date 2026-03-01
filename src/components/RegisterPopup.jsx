// components/RegisterPopup.jsx
import React, { useState, useEffect } from 'react';
import { 
  User, Building2, Phone, Mail, Lock, 
  Eye, EyeOff, CheckCircle, AlertCircle, X,
  Smartphone, Calendar, Zap, Award
} from 'lucide-react';

const RegisterPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    yourName: '',
    agencyName: '',
    whatsappNumber: '',
    phoneNumber: '',
    package: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'whatsappNumber' && !formData.phoneNumber) {
      setFormData(prev => ({
        ...prev,
        phoneNumber: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.yourName.trim()) {
      newErrors.yourName = 'Name is required';
    }

    if (!formData.agencyName.trim()) {
      newErrors.agencyName = 'Agency name is required';
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else if (!/^[0-9+\-\s]+$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = 'Invalid phone number format';
    }

    if (!formData.package) {
      newErrors.package = 'Please select a package';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const formspreeData = {
      ...formData,
      _subject: `New Agency Registration: ${formData.agencyName}`,
      package_details: getPackageDetails(formData.package)
    };

    try {
      const response = await fetch('https://formspree.io/f/meelwlgv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formspreeData)
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Registration successful! We will contact you soon.'
        });
        
        // Reset form after 2 seconds and close popup
        setTimeout(() => {
          setFormData({
            yourName: '',
            agencyName: '',
            whatsappNumber: '',
            phoneNumber: '',
            package: '',
            email: '',
            password: '',
            confirmPassword: ''
          });
          onClose();
        }, 2000);
      } else {
        setSubmitStatus({
          type: 'error',
          message: 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPackageDetails = (packageValue) => {
    const packages = {
      weekly: 'Weekly Package - 1399 PKR - All Access for One Week',
      monthly: 'Monthly Package - 4599 PKR - All Access (Save 1000 PKR)',
      yearly: 'Yearly Access - 50,000 PKR - All Access (Save 5499+ PKR)'
    };
    return packages[packageValue] || packageValue;
  };

  const packages = [
    {
      id: 'weekly',
      name: 'Weekly Package',
      price: '1,399',
      period: 'week',
      savings: null,
      icon: <Calendar className="w-5 h-5" />,
      features: [
        'All Access Features',
        '7 Days Full Access',
        'Basic Support'
      ],
      highlight: false
    },
    {
      id: 'monthly',
      name: 'Monthly Package',
      price: '4,599',
      period: 'month',
      savings: 'Save 1,000',
      icon: <Zap className="w-5 h-5" />,
      features: [
        'All Access Features',
        '30 Days Full Access',
        'Priority Support',
        'Multi-Branch Access'
      ],
      highlight: true
    },
    {
      id: 'yearly',
      name: 'Yearly Access',
      price: '50,000',
      period: 'year',
      savings: 'Save 5,499+',
      icon: <Award className="w-5 h-5" />,
      features: [
        'All Access Features',
        '365 Days Full Access',
        '24/7 Premium Support',
        'Unlimited Branches',
        'API Access'
      ],
      highlight: false
    }
  ];

  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Popup Container - Centered with animation */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 flex items-center justify-center">
          {/* Popup Content with Slide-up Animation */}
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Register Your Agency</h2>
                <p className="text-sm text-gray-600">Start your 7-day free trial</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Success/Error Message */}
                {submitStatus && (
                  <div className={`p-4 rounded-lg ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    <div className="flex items-center">
                      {submitStatus.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 mr-2" />
                      ) : (
                        <AlertCircle className="w-5 h-5 mr-2" />
                      )}
                      {submitStatus.message}
                    </div>
                  </div>
                )}

                {/* Package Selection - Horizontal Scroll on Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Package <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {packages.map((pkg) => (
                      <label
                        key={pkg.id}
                        className={`cursor-pointer transition-all duration-200 ${
                          formData.package === pkg.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="package"
                          value={pkg.id}
                          checked={formData.package === pkg.id}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <div className={`p-3 rounded-lg border-2 ${
                          formData.package === pkg.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <div className="flex items-center mb-2">
                            <div className={`p-1.5 rounded-lg mr-2 ${
                              formData.package === pkg.id ? 'bg-blue-500 text-white' : 'bg-gray-100'
                            }`}>
                              {pkg.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm">{pkg.name}</h3>
                              <p className="text-lg font-bold">
                                {pkg.price} <span className="text-xs font-normal">PKR</span>
                              </p>
                            </div>
                          </div>
                          {pkg.savings && (
                            <span className="inline-block bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                              {pkg.savings}
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.package && (
                    <p className="mt-1 text-sm text-red-500">{errors.package}</p>
                  )}
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Your Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="yourName"
                        value={formData.yourName}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.yourName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {errors.yourName && (
                      <p className="mt-1 text-xs text-red-500">{errors.yourName}</p>
                    )}
                  </div>

                  {/* Agency Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agency Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="agencyName"
                        value={formData.agencyName}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.agencyName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter agency name"
                      />
                    </div>
                    {errors.agencyName && (
                      <p className="mt-1 text-xs text-red-500">{errors.agencyName}</p>
                    )}
                  </div>

                  {/* WhatsApp Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.whatsappNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., +92 300 1234567"
                      />
                    </div>
                    {errors.whatsappNumber && (
                      <p className="mt-1 text-xs text-red-500">{errors.whatsappNumber}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Same as WhatsApp if left empty"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-9 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Minimum 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-9 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Re-enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition ${
                    isSubmitting 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Register Agency'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default RegisterPopup;