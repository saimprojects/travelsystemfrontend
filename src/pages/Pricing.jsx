// src/pages/Pricing.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Zap, Award, Calendar, HelpCircle } from 'lucide-react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const packages = [
    {
      name: "Starter",
      description: "Perfect for small agencies just getting started",
      monthlyPrice: "1,399",
      yearlyPrice: "13,990",
      icon: <Calendar className="w-6 h-6" />,
      features: [
        "Up to 3 agents",
        "Basic booking management",
        "Client database",
        "Email support",
        "Basic reports",
        "Mobile access"
      ],
      limitations: [
        "No API access",
        "No multi-branch",
        "Basic analytics"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "gray"
    },
    {
      name: "Professional",
      description: "Ideal for growing agencies with multiple services",
      monthlyPrice: "4,599",
      yearlyPrice: "45,990",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "Up to 10 agents",
        "Advanced booking system",
        "Umrah & Hajj packages",
        "Visa processing",
        "Ticketing system",
        "Multi-branch support",
        "Priority support",
        "API access",
        "Advanced analytics",
        "Commission automation"
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: true,
      color: "blue",
      savings: "Save 1000/month"
    },
    {
      name: "Enterprise",
      description: "For large agencies with complex requirements",
      monthlyPrice: "50,000",
      yearlyPrice: "500,000",
      icon: <Award className="w-6 h-6" />,
      features: [
        "Unlimited agents",
        "Unlimited branches",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "SLA guarantee",
        "Custom development",
        "White labeling",
        "Training sessions",
        "API access",
        "Advanced security"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
      color: "purple",
      savings: "Save 5499+/year"
    }
  ];

  const faqs = [
    {
      question: "Can I change plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "Is there a setup fee?",
      answer: "No, there are no setup fees. You only pay for your subscription."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, bank transfers, and JazzCash/EasyPaisa for Pakistani customers."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 14-day money-back guarantee if you're not satisfied with our service."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Choose the perfect plan for your agency. No hidden fees.
          </p>
          
          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center bg-blue-500/30 rounded-full p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                billingCycle === 'monthly'
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-blue-500/50'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                billingCycle === 'yearly'
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-blue-500/50'
              }`}
            >
              Yearly <span className="text-xs ml-1">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${
                  pkg.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="p-8">
                  <div className={`w-12 h-12 rounded-lg bg-${pkg.color}-100 flex items-center justify-center mb-4`}>
                    <div className={`text-${pkg.color}-600`}>{pkg.icon}</div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      PKR {billingCycle === 'monthly' ? pkg.monthlyPrice : pkg.yearlyPrice}
                    </span>
                    <span className="text-gray-500 ml-2">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  
                  {pkg.savings && (
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold inline-block mb-6">
                      {pkg.savings}
                    </div>
                  )}
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-gray-600">
                        <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-1" size={18} />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {pkg.limitations.map((limitation, i) => (
                      <li key={i} className="flex items-start text-gray-400">
                        <span className="mr-2">✕</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to={pkg.name === 'Enterprise' ? '/contact' : '/register-agency'}
                    className={`block text-center px-6 py-3 rounded-lg font-semibold transition ${
                      pkg.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {pkg.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  <HelpCircle className="text-blue-600 mr-2" size={20} />
                  {faq.question}
                </h3>
                <p className="text-gray-600 ml-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need a Custom Plan?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Contact us for a tailored solution that fits your specific requirements
          </p>
          <Link
            to="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Talk to Sales
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Pricing;