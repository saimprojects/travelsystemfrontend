import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, User, Building2, Phone, Mail, Smartphone,
  CheckCircle, AlertCircle, Calendar, Zap, Award, ArrowRight
} from 'lucide-react';

const PACKAGES = [
  {
    id: 'weekly',
    name: 'Starter',
    price: '1,399',
    period: 'week',
    savings: null,
    icon: Calendar,
    gradient: 'from-slate-500 to-slate-600',
    features: ['All Access Features', '7 Days Full Access', 'Basic Support'],
  },
  {
    id: 'monthly',
    name: 'Professional',
    price: '4,599',
    period: 'month',
    savings: 'Save PKR 1,000',
    icon: Zap,
    gradient: 'from-blue-600 to-violet-600',
    features: ['All Access Features', '30 Days Full Access', 'Priority Support', 'Multi-Branch Access'],
    popular: true,
  },
  {
    id: 'yearly',
    name: 'Enterprise',
    price: '50,000',
    period: 'year',
    savings: 'Save PKR 5,499+',
    icon: Award,
    gradient: 'from-amber-500 to-orange-500',
    features: ['All Access Features', '365 Days Full Access', '24/7 Premium Support', 'Unlimited Branches', 'API Access'],
  },
];

const getPackageDetails = (v) => ({
  weekly: 'Starter — 1,399 PKR/week — All Access 7 Days',
  monthly: 'Professional — 4,599 PKR/month — All Access + Priority Support',
  yearly: 'Enterprise — 50,000 PKR/year — All Access + Unlimited',
}[v] || v);

export default function RegisterPopup({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ yourName: '', agencyName: '', whatsappNumber: '', phoneNumber: '', package: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'whatsappNumber' && !prev.phoneNumber) next.phoneNumber = value;
      return next;
    });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.yourName.trim()) errs.yourName = 'Name is required';
    if (!formData.agencyName.trim()) errs.agencyName = 'Agency name is required';
    if (!formData.whatsappNumber.trim()) errs.whatsappNumber = 'WhatsApp number is required';
    else if (!/^[0-9+\-\s]+$/.test(formData.whatsappNumber)) errs.whatsappNumber = 'Invalid phone format';
    if (!formData.package) errs.package = 'Please select a package';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Invalid email format';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://formsubmit.co/ajax/saimpkf@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `New Agency Registration: ${formData.agencyName}`,
          name: formData.yourName,
          agency_name: formData.agencyName,
          whatsapp_number: formData.whatsappNumber,
          phone_number: formData.phoneNumber || formData.whatsappNumber,
          selected_package: getPackageDetails(formData.package),
          email: formData.email,
          _template: 'table',
          _captcha: 'false',
          _next: window.location.href,
        }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setSubmitStatus({ type: 'success', message: 'Registration successful! We\'ll contact you shortly.' });
        setTimeout(() => {
          setFormData({ yourName: '', agencyName: '', whatsappNumber: '', phoneNumber: '', package: '', email: '' });
          onClose();
        }, 2500);
      } else {
        setSubmitStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
      }
    } catch {
      setSubmitStatus({ type: 'error', message: 'Network error. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Panel */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 flex items-center justify-center py-8">
              <motion.div
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.97 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative w-full max-w-2xl bg-slate-900 border border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Top gradient strip */}
                <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.07]">
                  <div>
                    <h2 className="text-xl font-bold text-white">Register Your Agency</h2>
                    <p className="text-sm text-slate-400 mt-0.5">Start your 7-day free trial — no credit card needed</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-7">
                  <form
                    action="https://formsubmit.co/saimpkf@gmail.com"
                    method="POST"
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_captcha" value="false" />
                    <input type="hidden" name="_next" value={typeof window !== 'undefined' ? window.location.href : ''} />
                    <input type="hidden" name="_subject" value="New Agency Registration — TravelSaaS" />

                    {/* Status */}
                    <AnimatePresence>
                      {submitStatus && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm ${
                            submitStatus.type === 'success'
                              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/10 border border-red-500/20 text-red-400'
                          }`}
                        >
                          {submitStatus.type === 'success'
                            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            : <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          }
                          {submitStatus.message}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Package Selection */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Select Plan <span className="text-red-400">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {PACKAGES.map((pkg) => (
                          <label key={pkg.id} className="cursor-pointer">
                            <input
                              type="radio" name="package" value={pkg.id}
                              checked={formData.package === pkg.id}
                              onChange={handleChange}
                              className="sr-only"
                              required
                            />
                            <div className={`relative rounded-xl border p-3.5 transition-all duration-200 ${
                              formData.package === pkg.id
                                ? 'border-blue-500/60 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                                : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]'
                            }`}>
                              {pkg.popular && (
                                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white text-[10px] font-bold whitespace-nowrap">
                                  Popular
                                </div>
                              )}
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${pkg.gradient} flex items-center justify-center mb-2.5 shadow-md`}>
                                <pkg.icon className="w-4 h-4 text-white" />
                              </div>
                              <div className="text-sm font-bold text-white">{pkg.name}</div>
                              <div className="text-xs text-slate-400 mt-0.5">PKR {pkg.price}<span className="text-slate-600">/{pkg.period}</span></div>
                              {pkg.savings && (
                                <div className="mt-1.5 text-[10px] font-semibold text-emerald-400">{pkg.savings}</div>
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                      {errors.package && <p className="mt-1.5 text-xs text-red-400">{errors.package}</p>}
                    </div>

                    {/* Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: 'yourName', label: 'Your Name', icon: User, type: 'text', placeholder: 'Full name', required: true },
                        { name: 'agencyName', label: 'Agency Name', icon: Building2, type: 'text', placeholder: 'Agency name', required: true },
                        { name: 'whatsappNumber', label: 'WhatsApp Number', icon: Smartphone, type: 'tel', placeholder: '+92 300 1234567', required: true },
                        { name: 'phoneNumber', label: 'Phone (Optional)', icon: Phone, type: 'tel', placeholder: 'Same as WhatsApp if empty', required: false },
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">
                            {field.label} {field.required && <span className="text-red-400">*</span>}
                          </label>
                          <div className="relative">
                            <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              required={field.required}
                              placeholder={field.placeholder}
                              className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl text-white placeholder-slate-600 focus:outline-none transition-colors ${
                                errors[field.name]
                                  ? 'bg-red-500/5 border border-red-500/40 focus:border-red-500/60'
                                  : 'bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 focus:bg-white/[0.06]'
                              }`}
                            />
                          </div>
                          {errors[field.name] && <p className="mt-1 text-xs text-red-400">{errors[field.name]}</p>}
                        </div>
                      ))}

                      {/* Email — full width */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                          <input
                            type="email" name="email" value={formData.email} onChange={handleChange} required
                            placeholder="your@email.com"
                            className={`w-full pl-9 pr-3 py-2.5 text-sm rounded-xl text-white placeholder-slate-600 focus:outline-none transition-colors ${
                              errors.email
                                ? 'bg-red-500/5 border border-red-500/40 focus:border-red-500/60'
                                : 'bg-white/[0.04] border border-white/[0.08] focus:border-blue-500/50 focus:bg-white/[0.06]'
                            }`}
                          />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                        isSubmitting
                          ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Registering Agency...
                        </>
                      ) : (
                        <>
                          Register Agency
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
