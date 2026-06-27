import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, X, Zap, Award, Calendar, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';

const PACKAGES = [
  {
    id: 'weekly',
    name: 'Starter',
    desc: 'Perfect for small agencies getting started',
    monthlyPrice: '1,399',
    yearlyPrice: '13,990',
    period: { monthly: 'week', yearly: 'year' },
    icon: Calendar,
    gradient: 'from-slate-500 to-slate-600',
    features: ['Up to 3 agents', 'Basic booking management', 'Client database', 'Email support', 'Basic reports', 'Mobile access'],
    limitations: ['No API access', 'No multi-branch', 'Basic analytics only'],
    popular: false,
  },
  {
    id: 'monthly',
    name: 'Professional',
    desc: 'Ideal for growing agencies with multiple services',
    monthlyPrice: '4,599',
    yearlyPrice: '45,990',
    period: { monthly: 'month', yearly: 'year' },
    icon: Zap,
    gradient: 'from-blue-600 to-violet-600',
    features: ['Up to 10 agents', 'Advanced booking system', 'Umrah & Hajj packages', 'Visa processing', 'Ticketing system', 'Multi-branch support', 'Priority support', 'API access', 'Advanced analytics', 'Commission automation'],
    limitations: [],
    popular: true,
    badge: 'Most Popular',
    savings: 'Save PKR 1,000/month',
  },
  {
    id: 'yearly',
    name: 'Enterprise',
    desc: 'For large agencies with complex requirements',
    monthlyPrice: '50,000',
    yearlyPrice: '500,000',
    period: { monthly: 'month', yearly: 'year' },
    icon: Award,
    gradient: 'from-amber-500 to-orange-500',
    features: ['Unlimited agents', 'Unlimited branches', 'Custom integrations', 'Dedicated account manager', '24/7 phone support', 'SLA guarantee', 'Custom development', 'White labeling', 'Training sessions', 'API access', 'Advanced security'],
    limitations: [],
    popular: false,
    savings: 'Save PKR 5,499+/year',
  },
];

const FAQS = [
  { q: 'Can I change plans later?', a: 'Yes, upgrade or downgrade at any time. Changes apply to your next billing cycle.' },
  { q: 'Is there a setup fee?', a: 'No setup fees at all. You only pay for your subscription.' },
  { q: 'What payment methods do you accept?', a: 'All major credit cards, bank transfers, and JazzCash/EasyPaisa for Pakistani customers.' },
  { q: 'Do you offer refunds?', a: 'Yes — 14-day money-back guarantee if you\'re not satisfied.' },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function Pricing() {
  const { onRegisterOpen } = useOutletContext();
  const [billing, setBilling] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="bg-slate-950 text-white overflow-x-hidden">

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-6"
          >
            <Sparkles className="w-3 h-3" /> Simple, Transparent Pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5"
          >
            Plans for Every
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> Agency Size</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg mb-8"
          >
            No hidden fees. Cancel anytime. Start with a free 7-day trial.
          </motion.p>

          {/* Billing toggle */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-1 bg-white/[0.05] border border-white/[0.08] rounded-full p-1"
          >
            {['monthly', 'yearly'].map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  billing === b
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {b === 'monthly' ? 'Monthly' : 'Yearly'}
                {b === 'yearly' && <span className="ml-1.5 text-xs text-emerald-400 font-semibold">–20%</span>}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-2xl overflow-hidden ${
                  pkg.popular
                    ? 'border border-blue-500/50 shadow-2xl shadow-blue-500/20'
                    : 'border border-white/[0.07]'
                } bg-white/[0.03]`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                )}
                {pkg.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 border border-blue-500/30 text-blue-300">
                      {pkg.badge}
                    </span>
                  </div>
                )}
                <div className="p-7">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${pkg.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <pkg.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                  <p className="text-slate-500 text-sm mb-5">{pkg.desc}</p>
                  <div className="mb-2">
                    <span className="text-4xl font-extrabold text-white">
                      PKR {billing === 'monthly' ? pkg.monthlyPrice : pkg.yearlyPrice}
                    </span>
                    <span className="text-slate-500 text-sm ml-1.5">/{pkg.period[billing]}</span>
                  </div>
                  {pkg.savings && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5">
                      {pkg.savings}
                    </div>
                  )}

                  <div className={`mt-5 ${!pkg.savings ? 'mt-7' : ''}`}>
                    <button
                      onClick={onRegisterOpen}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 text-sm ${
                        pkg.popular
                          ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5'
                          : 'bg-white/[0.06] border border-white/[0.1] text-slate-300 hover:bg-white/[0.1] hover:text-white'
                      }`}
                    >
                      {pkg.id === 'yearly' ? 'Contact Sales' : 'Start Free Trial'}
                    </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-2.5">
                    {pkg.features.map((f, j) => (
                      <div key={j} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </div>
                    ))}
                    {pkg.limitations.map((l, j) => (
                      <div key={j} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 border-y border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Frequently Asked
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent"> Questions</span>
            </h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-white flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <span className={`text-slate-500 text-lg leading-none transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed pl-9">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Need a Custom Plan?
            </h2>
            <p className="text-slate-400 mb-8">Contact us for a tailored solution that fits your specific requirements.</p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Talk to Sales
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
