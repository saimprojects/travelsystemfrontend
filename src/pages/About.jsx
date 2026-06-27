import { motion } from 'framer-motion';
import { Target, Award, Heart, Users, Mail, Phone, Globe, Sparkles, CheckCircle } from 'lucide-react';

const VALUES = [
  { icon: Heart, color: 'from-rose-500 to-pink-500', title: 'Customer First', desc: 'Every feature we build starts with a real agency pain point.' },
  { icon: Award, color: 'from-amber-500 to-orange-500', title: 'Innovation', desc: 'Constantly evolving — from invoice templates to AI-powered insights.' },
  { icon: Users, color: 'from-blue-500 to-violet-500', title: 'Integrity', desc: 'Transparent pricing, honest support, and no hidden surprises.' },
  { icon: Target, color: 'from-emerald-500 to-teal-500', title: 'Excellence', desc: 'We ship things we\'re proud of — every time.' },
];

const MILESTONES = [
  { year: '2023', event: 'TravelSaaS founded by Muhammad Saim' },
  { year: '2024', event: 'Launched with 5 invoice templates & multi-role access' },
  { year: '2025', event: '500+ agencies onboarded across Pakistan' },
  { year: '2026', event: 'Enterprise tier + API launched' },
];

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function About() {
  return (
    <div className="bg-slate-950 text-white overflow-x-hidden">

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-600/8 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6"
          >
            <Sparkles className="w-3 h-3" /> Our Story
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5"
          >
            Built for Pakistan's
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Travel Industry
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            We started because we saw travel agencies drowning in spreadsheets, WhatsApp chaos,
            and manual invoices. We built the system we wished existed.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
          {[
            {
              icon: Target, gradient: 'from-blue-500 to-violet-500', title: 'Our Mission',
              text: 'To revolutionize the travel agency industry by providing an all-in-one, cloud-based management system that simplifies operations, automates workflows, and drives growth for travel businesses of all sizes.',
            },
            {
              icon: Award, gradient: 'from-amber-500 to-orange-500', title: 'Our Vision',
              text: 'To become the leading SaaS platform for travel agencies across Pakistan and beyond, enabling thousands of businesses to digitize their operations and scale efficiently.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8"
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">{item.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Developer Card */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-violet-600/10 to-slate-900/80" />
            <div className="absolute inset-0 border border-white/[0.1] rounded-3xl" />
            <div className="relative p-8 md:p-12">
              {/* Top */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-blue-500/30">
                  <Users className="w-9 h-9 text-white" />
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-1">Muhammad Saim</h2>
                <p className="text-blue-400 font-semibold text-sm mb-1">Founder & Lead Developer</p>
                <a href="https://minorgroup.site" target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                  minorgroup.site ↗
                </a>
              </div>

              <p className="text-slate-300 text-center text-sm leading-relaxed max-w-lg mx-auto mb-8">
                With a passion for technology and a deep understanding of the travel industry, Muhammad Saim
                founded TravelSaaS to bridge the gap between traditional agency operations and modern digital
                solutions. His vision: empower travel businesses with tools that make management seamless and growth inevitable.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/[0.07] pt-8">
                {[
                  { icon: Mail, label: 'saimpkf@gmail.com', href: 'mailto:saimpkf@gmail.com' },
                  { icon: Phone, label: '+92 313 1471263', href: 'tel:+923131471263' },
                  { icon: Globe, label: 'minorgroup.site', href: 'https://minorgroup.site' },
                ].map((c, i) => (
                  <a
                    key={i}
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="flex flex-col items-center gap-2 text-center text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                      <c.icon className="w-4 h-4 text-blue-400" />
                    </div>
                    {c.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 sm:px-6 border-y border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Our
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent"> Journey</span>
            </h2>
          </motion.div>
          <div className="relative pl-8">
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-white/[0.07]" />
            {MILESTONES.map((m, i) => (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative mb-7 last:mb-0"
              >
                <div className="absolute -left-8 top-0.5 w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-xs text-blue-400 font-bold mb-1">{m.year}</div>
                <div className="text-sm text-slate-300">{m.event}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Our Core
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> Values</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 text-center"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <v.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{v.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
