import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, BarChart3, Users, FileText,
  Shield, CheckCircle, Star, Zap, Globe,
  TrendingUp, CreditCard, Plane
} from 'lucide-react';

const STATS = [
  { value: '500+', label: 'Agencies Active' },
  { value: '50K+', label: 'Bookings Managed' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '4.9★', label: 'Avg. Rating' },
];

const FEATURES = [
  {
    icon: BarChart3,
    color: 'from-blue-500 to-blue-600',
    title: 'Live Analytics Dashboard',
    desc: 'Real-time revenue tracking, booking trends, and performance insights at a glance.',
  },
  {
    icon: Users,
    color: 'from-violet-500 to-violet-600',
    title: 'Role-Based Team Access',
    desc: 'Owner, Manager, Agent, and Accountant roles — each with tailored access controls.',
  },
  {
    icon: FileText,
    color: 'from-amber-500 to-orange-500',
    title: '5 Invoice Templates',
    desc: 'Professional invoices in Classic, Gold Voucher, Dark Pro, Minimal, and Corporate styles.',
  },
  {
    icon: Globe,
    color: 'from-emerald-500 to-teal-500',
    title: 'Umrah & Hajj Packages',
    desc: 'Manage packages with inclusions, visa tracking, hotel mapping, and group handling.',
  },
  {
    icon: CreditCard,
    color: 'from-pink-500 to-rose-500',
    title: 'Payment Tracking',
    desc: 'Half-paid, full-paid, refunds — commission automation built in.',
  },
  {
    icon: Shield,
    color: 'from-slate-500 to-slate-600',
    title: 'Enterprise Security',
    desc: 'Encrypted data, audit logs, two-factor authentication, GDPR compliance.',
  },
];

const STEPS = [
  { num: '01', title: 'Register Your Agency', desc: 'Create your agency profile, invite your team, and set up your brand in minutes.' },
  { num: '02', title: 'Manage Bookings & Clients', desc: 'Add services, create bookings, track payments, and generate professional invoices.' },
  { num: '03', title: 'Scale With Confidence', desc: 'Use analytics to spot trends, optimize operations, and grow your revenue.' },
];

const TESTIMONIALS = [
  {
    name: 'Muhammad Ali',
    role: 'Owner, Al-Hayat Travels',
    text: 'TravelSaaS completely transformed how we manage our Umrah packages. What used to take hours now takes minutes.',
    stars: 5,
  },
  {
    name: 'Sarah Ahmed',
    role: 'Manager, Sky Wings Agency',
    text: 'The invoice templates are stunning. Our clients are seriously impressed with how professional everything looks.',
    stars: 5,
  },
  {
    name: 'Bilal Raza',
    role: 'Accountant, Hira Travels',
    text: 'Payment tracking and commission automation saved us 3+ hours every week. Absolute game changer.',
    stars: 5,
  },
];

const fadeUp = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };

export default function HomePage() {
  const { onRegisterOpen } = useOutletContext();

  return (
    <div className="bg-slate-950 text-white overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px]" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '72px 72px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-medium text-slate-300 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Trusted by 500+ travel agencies across Pakistan
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
          >
            The Operating System
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              for Travel Agencies
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Manage bookings, clients, invoices, and your entire team — in one beautiful,
            cloud-based platform built for Pakistan's travel industry.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onRegisterOpen}
              className="group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Free Today
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <Link
              to="/features"
              className="flex items-center gap-2 px-7 py-3.5 bg-white/[0.05] border border-white/[0.1] text-slate-300 font-semibold rounded-xl hover:bg-white/[0.08] hover:text-white transition-all duration-200"
            >
              Explore Features
            </Link>
          </motion.div>

          {/* Hero card mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-16 relative mx-auto max-w-4xl"
          >
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/50">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-slate-900/80">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
                <div className="ml-4 flex-1 max-w-xs h-5 rounded bg-white/[0.05] border border-white/[0.06]" />
              </div>
              {/* Fake dashboard */}
              <div className="p-6">
                <div className="grid grid-cols-4 gap-4 mb-5">
                  {['Total Bookings', 'Revenue', 'Active Clients', 'Pending'].map((label, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                      <div className="text-xs text-slate-500 mb-1">{label}</div>
                      <div className={`text-xl font-bold ${i === 0 ? 'text-blue-400' : i === 1 ? 'text-emerald-400' : i === 2 ? 'text-violet-400' : 'text-amber-400'}`}>
                        {['1,248', 'PKR 4.2M', '389', '24'][i]}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-28 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-end gap-1.5 px-4 pb-3 pt-4 overflow-hidden">
                  {[40, 60, 45, 80, 65, 90, 75, 88, 72, 95, 82, 100].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t" style={{
                      height: `${h}%`,
                      background: i % 3 === 0 ? 'rgba(99,102,241,0.5)' : i % 3 === 1 ? 'rgba(59,130,246,0.4)' : 'rgba(139,92,246,0.35)'
                    }} />
                  ))}
                </div>
              </div>
            </div>
            {/* Glow under card */}
            <div className="absolute -bottom-4 inset-x-8 h-12 bg-blue-500/15 blur-2xl rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-1">
                  {s.value}
                </div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
              <Zap className="w-3 h-3" /> Everything You Need
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Built for Every Role
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                in Your Agency
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              From the owner's analytics to the agent's booking flow — every workflow is covered.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 bg-white/[0.015] border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-4">
              <TrendingUp className="w-3 h-3" /> Simple Setup
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Up & Running
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent"> in Minutes</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[calc(100%-1rem)] w-8 h-px bg-white/[0.1]" />
                )}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-4">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <button
              onClick={onRegisterOpen}
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Your Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
              <Star className="w-3 h-3 fill-amber-400" /> Customer Stories
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Agencies Love
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> TravelSaaS</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {Array(t.stars).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">"{t.text}"</p>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-violet-600/20 to-slate-900/80" />
            <div className="absolute inset-0 border border-white/[0.1] rounded-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-blue-500/20 blur-3xl" />

            <div className="relative px-8 py-16 text-center">
              <Plane className="w-10 h-10 text-blue-400 mx-auto mb-5" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Ready to Digitize
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  Your Agency?
                </span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Stop managing your business on WhatsApp and Excel. Join 500+ agencies already running on TravelSaaS.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onRegisterOpen}
                  className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Register Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/[0.06] border border-white/[0.12] text-slate-300 font-semibold rounded-xl hover:bg-white/[0.1] hover:text-white transition-all duration-200"
                >
                  Contact Sales
                </Link>
              </div>
              <p className="mt-6 text-xs text-slate-600 flex items-center justify-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                No credit card required · Free 7-day trial
              </p>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
