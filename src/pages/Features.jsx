import { useOutletContext } from 'react-router-dom';
import {
  BarChart3, Globe, FileText, Plane, Users,
  CreditCard, Shield, Zap, CheckCircle, ArrowRight,
  Settings, Bell
} from 'lucide-react';

const FEATURE_GROUPS = [
  {
    icon: BarChart3,
    gradient: 'from-blue-500 to-blue-600',
    title: 'Dashboard & Analytics',
    items: ['Real-time business overview', 'Revenue analytics & forecasting', 'Agency performance metrics', 'Multi-branch consolidation', 'Custom report generation'],
  },
  {
    icon: Globe,
    gradient: 'from-emerald-500 to-teal-500',
    title: 'Umrah & Hajj Management',
    items: ['Package creation & management', 'Hotel & transport booking', 'Visa tracking system', 'Document upload & verification', 'Group management', 'Makkah & Madinah hotel mapping'],
  },
  {
    icon: FileText,
    gradient: 'from-violet-500 to-violet-600',
    title: 'Visa Processing',
    items: ['Visa application tracking', 'Document checklist management', 'Status update notifications', 'Embassy appointment scheduling', 'Visa expiry alerts'],
  },
  {
    icon: Plane,
    gradient: 'from-sky-500 to-blue-500',
    title: 'Ticketing System',
    items: ['Flight search & booking', 'PNR management', 'Ticket issuance', 'Flight status tracking', 'Multi-airline support'],
  },
  {
    icon: Users,
    gradient: 'from-orange-500 to-amber-500',
    title: 'Agent Management',
    items: ['Multi-role access control', 'Agent performance tracking', 'Commission automation', 'Team collaboration tools', 'Activity logs & audit trails'],
  },
  {
    icon: CreditCard,
    gradient: 'from-pink-500 to-rose-500',
    title: 'Payment Processing',
    items: ['Multiple payment methods', 'Installment plans', 'Full/half payment tracking', 'Invoice generation (5 templates)', 'Refund management'],
  },
  {
    icon: Settings,
    gradient: 'from-slate-500 to-slate-600',
    title: 'Client Management',
    items: ['Customer database', 'Booking history', 'Communication logs', 'Document management', 'Client notes & reminders'],
  },
  {
    icon: Shield,
    gradient: 'from-indigo-500 to-indigo-600',
    title: 'Security & Compliance',
    items: ['Role-based access control', 'End-to-end data encryption', 'GDPR compliance', 'Full audit trails', 'Two-factor authentication'],
  },
];

const INTEGRATIONS = [
  { name: 'WhatsApp', emoji: '💬' },
  { name: 'Email', emoji: '📧' },
  { name: 'SMS', emoji: '📱' },
  { name: 'Payment Gateway', emoji: '💳' },
  { name: 'Google Calendar', emoji: '📅' },
  { name: 'Excel Export', emoji: '📊' },
  { name: 'PDF Generator', emoji: '📄' },
  { name: 'Cloud Storage', emoji: '☁️' },
];

export default function Features() {
  const { onRegisterOpen } = useOutletContext();

  return (
    <div className="bg-slate-950 text-white overflow-x-hidden">

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '72px 72px'
        }} />
        <div className="relative max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6"
          >
            <Zap className="w-3 h-3" /> Full Feature List
          </div>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5"
          >
            Powerful Features for
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Modern Travel Agencies
            </span>
          </h1>
          <p
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Everything you need to run, manage, and scale your travel business — in one integrated platform.
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {FEATURE_GROUPS.map((fg) => (
              <div
                key={fg.title}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${fg.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <fg.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-3">{fg.title}</h3>
                <ul className="space-y-2">
                  {fg.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 px-4 sm:px-6 border-y border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-5xl mx-auto text-center">
          <div
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
              <Bell className="w-3 h-3" /> Integrations
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Connects With Your
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent"> Favourite Tools</span>
            </h2>
            <p className="text-slate-400 text-sm">Seamless integrations so your workflow never misses a beat.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {INTEGRATIONS.map((item) => (
              <div
                key={item.name}
                className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 text-center hover:bg-white/[0.06] transition-colors"
              >
                <span className="text-2xl mb-2 block">{item.emoji}</span>
                <span className="text-xs text-slate-400 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Ready to Transform
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent"> Your Agency?</span>
            </h2>
            <p className="text-slate-400 mb-8">Join hundreds of travel agencies already leveraging TravelSaaS.</p>
            <button
              onClick={onRegisterOpen}
              className="group inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
