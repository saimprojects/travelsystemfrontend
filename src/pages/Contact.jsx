import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, Globe, MapPin,
  Send, CheckCircle, AlertCircle, User, MessageSquare
} from 'lucide-react';

const CONTACT_CARDS = [
  { icon: Mail, gradient: 'from-blue-500 to-blue-600', title: 'Email Us', value: 'saimpkf@gmail.com', href: 'mailto:saimpkf@gmail.com' },
  { icon: Phone, gradient: 'from-emerald-500 to-teal-500', title: 'Call Us', value: '+92 313 1471263', href: 'tel:+923131471263' },
  { icon: Globe, gradient: 'from-violet-500 to-violet-600', title: 'Website', value: 'minorgroup.site', href: 'https://minorgroup.site' },
  { icon: MapPin, gradient: 'from-amber-500 to-orange-500', title: 'Location', value: 'Pakistan 🇵🇰', href: null },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://formsubmit.co/ajax/saimpkf@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: `Contact Form: ${formData.subject}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'Not provided',
          subject: formData.subject,
          message: formData.message,
          _template: 'table',
          _captcha: 'false',
          _next: window.location.href,
        }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setSubmitStatus({ type: 'success', message: 'Message sent! We\'ll get back to you soon.' });
        setTimeout(() => setFormData({ name: '', email: '', phone: '', subject: '', message: '' }), 2000);
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
    <div className="bg-slate-950 text-white overflow-x-hidden">

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-blue-600/8 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6"
          >
            <MessageSquare className="w-3 h-3" /> Get in Touch
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5"
          >
            Let's Start a
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent"> Conversation</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg"
          >
            Have questions? We respond within 24 hours — usually much faster.
          </motion.p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CONTACT_CARDS.map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                {card.href ? (
                  <a
                    href={card.href}
                    target={card.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="block bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 text-center hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200 group"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:-translate-y-0.5 transition-transform`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-xs font-semibold text-slate-500 mb-1">{card.title}</div>
                    <div className="text-xs text-white font-medium break-all">{card.value}</div>
                  </a>
                ) : (
                  <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 text-center">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                      <card.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-xs font-semibold text-slate-500 mb-1">{card.title}</div>
                    <div className="text-xs text-white font-medium">{card.value}</div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-1">Send Us a Message</h2>
            <p className="text-slate-500 text-sm mb-7">We read every message and respond personally.</p>

            {submitStatus && (
              <div className={`mb-6 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm ${
                submitStatus.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {submitStatus.type === 'success'
                  ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  : <AlertCircle className="w-4 h-4 flex-shrink-0" />
                }
                {submitStatus.message}
              </div>
            )}

            <form
              action="https://formsubmit.co/saimpkf@gmail.com"
              method="POST"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value={typeof window !== 'undefined' ? window.location.href : ''} />
              <input type="hidden" name="_subject" value="New Contact Form Submission - TravelSaaS" />

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Your Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange} required
                      placeholder="Your full name"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange} required
                      placeholder="your@email.com"
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Subject *</label>
                <input
                  type="text" name="subject" value={formData.subject} onChange={handleChange} required
                  placeholder="What's this about?"
                  className="w-full px-3 py-2.5 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Message *</label>
                <textarea
                  name="message" value={formData.message} onChange={handleChange} required rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full px-3 py-2.5 text-sm bg-white/[0.05] border border-white/[0.08] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.07] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
