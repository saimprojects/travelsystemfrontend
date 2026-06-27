import { Link } from 'react-router-dom';
import { Plane, Mail, Phone, Globe, Twitter, Linkedin, Github } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', to: '/features' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Login', to: '/login' },
  ],
  Company: [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
  Contact: [
    { label: 'saimpkf@gmail.com', href: 'mailto:saimpkf@gmail.com', icon: Mail },
    { label: '+92 313 1471263', href: 'tel:+923131471263', icon: Phone },
    { label: 'minorgroup.site', href: 'https://minorgroup.site', icon: Globe },
  ],
};

export default function Footer({ onRegisterOpen }) {
  return (
    <footer className="bg-slate-950 border-t border-white/[0.06]">
      {/* CTA band */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-violet-600/10 to-blue-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white">Ready to grow your agency?</h3>
            <p className="text-slate-400 mt-1 text-sm">Join 500+ agencies already using TravelSaaS.</p>
          </div>
          <button
            onClick={onRegisterOpen}
            className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-violet-500 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-px"
          >
            Start Free Today
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Plane className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Travel<span className="text-blue-400">SaaS</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Pakistan's most powerful travel agency management platform. Manage bookings, clients, services & invoices in one place.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { icon: Twitter, href: '#' },
                { icon: Linkedin, href: '#' },
                { icon: Github, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.Product.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-500 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.Company.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-500 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.Contact.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-white transition-colors group"
                  >
                    <l.icon className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} TravelSaaS by <a href="https://minorgroup.site" className="hover:text-slate-400 transition-colors" target="_blank" rel="noreferrer">minorgroup.site</a>. All rights reserved.</p>
          <p>Built for Pakistan's Travel Industry 🇵🇰</p>
        </div>
      </div>
    </footer>
  );
}
