import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Plane, AlertCircle, Lock, Shield, X, Phone, Mail,
  Ban, AlertTriangle, Eye, EyeOff, Globe, MapPin, Star,
} from 'lucide-react';

// ── Decorative destination cards shown on the left panel ──────────────────────
const DESTINATIONS = [
  { city: 'Makkah',    country: 'Saudi Arabia', flag: '🕋', color: 'from-amber-500 to-yellow-400',  delay: '0s'   },
  { city: 'Dubai',     country: 'UAE',          flag: '🏙️', color: 'from-sky-500 to-cyan-400',      delay: '0.4s' },
  { city: 'Istanbul',  country: 'Turkey',       flag: '🕌', color: 'from-red-500 to-rose-400',      delay: '0.8s' },
  { city: 'London',    country: 'UK',           flag: '🏰', color: 'from-blue-600 to-indigo-500',   delay: '1.2s' },
  { city: 'Baku',      country: 'Azerbaijan',   flag: '🌊', color: 'from-teal-500 to-emerald-400',  delay: '1.6s' },
];

const Login = () => {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [agencyStatus, setAgencyStatus]       = useState('');
  const [statusMessage, setStatusMessage]     = useState('');
  const [agencyDetails, setAgencyDetails]     = useState({});
  const { login } = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAgencyStatus('');
    setStatusMessage('');
    setShowStatusModal(false);

    try {
      const success = await login(email, password);
      if (success) { navigate('/dashboard'); return; }
      setError('Login failed. Please check your credentials.');
    } catch (err) {
      const errorDetail  = err.response?.data?.detail || '';
      const errorMessage = errorDetail.toLowerCase();

      if (
        errorMessage.includes('inactive') || errorMessage.includes('suspended') ||
        errorMessage.includes('locked')   || errorMessage.includes('blocked')  ||
        errorMessage.includes('pending')  || errorMessage.includes('not active') ||
        errorMessage.includes('agency status')
      ) {
        let status = 'restricted';
        let customMessage = '';
        if (errorMessage.includes('inactive'))            { status = 'inactive';  customMessage = 'Your agency account is currently INACTIVE. Please contact the administrator.'; }
        else if (errorMessage.includes('suspended'))      { status = 'suspended'; customMessage = 'Your agency account has been SUSPENDED due to policy violations.'; }
        else if (errorMessage.includes('locked') || errorMessage.includes('blocked')) { status = 'locked'; customMessage = 'Your agency account has been LOCKED for security reasons.'; }
        else if (errorMessage.includes('pending'))        { status = 'pending';   customMessage = 'Your agency account is PENDING APPROVAL. Please wait for review.'; }
        else                                              { status = 'restricted'; customMessage = 'Your agency account access is RESTRICTED.'; }

        const agencyData = err.response?.data || {};
        setAgencyDetails({ name: agencyData.agency_name || 'Unknown Agency', id: agencyData.agency_id || 'N/A', status: agencyData.agency_status || status });
        setAgencyStatus(status);
        setStatusMessage(customMessage + `\n\n${errorDetail}`);
        setShowStatusModal(true);
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (err.response?.status === 403) {
        const data = err.response?.data || {};
        setAgencyStatus(data.agency_status || 'forbidden');
        setStatusMessage(data.detail || 'Access forbidden. Your agency account does not have permission.');
        setAgencyDetails({ name: data.agency_name || 'Unknown Agency', id: data.agency_id || 'N/A', status: data.agency_status || 'forbidden' });
        setShowStatusModal(true);
      } else if (err.response?.status === 400) {
        setError(errorDetail || 'Please check your credentials and try again.');
      } else if (!err.response) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setAgencyStatus('');
    setStatusMessage('');
    setAgencyDetails({});
    setPassword('');
  };

  const getStatusConfig = () => {
    const configs = {
      inactive:   { icon: <Ban className="w-10 h-10 text-amber-400" />,     title: 'ACCOUNT INACTIVE',   color: 'bg-amber-50 border-amber-200 text-amber-800',   badgeColor: 'bg-amber-100 text-amber-800',   bgColor: 'from-amber-500 to-orange-600',  contactTitle: 'Reactivation Required',    steps: ['Contact system administrator', 'Provide agency registration details', 'Complete any pending payments', 'Wait for reactivation confirmation'] },
      suspended:  { icon: <Lock className="w-10 h-10 text-red-400" />,      title: 'ACCOUNT SUSPENDED',  color: 'bg-red-50 border-red-200 text-red-800',         badgeColor: 'bg-red-100 text-red-800',       bgColor: 'from-red-600 to-rose-700',      contactTitle: 'Urgent: Account Suspended', steps: ['Contact administrator immediately', 'Provide explanation', 'Follow resolution procedure', 'Wait for reinstatement'] },
      locked:     { icon: <Lock className="w-10 h-10 text-red-400" />,      title: 'ACCOUNT LOCKED',     color: 'bg-red-50 border-red-200 text-red-800',         badgeColor: 'bg-red-100 text-red-800',       bgColor: 'from-red-700 to-rose-800',      contactTitle: 'Security Lock Applied',     steps: ['Account locked for security', 'Multiple failed attempts detected', 'Contact administrator to unlock', 'Verify your identity'] },
      pending:    { icon: <Shield className="w-10 h-10 text-blue-400" />,   title: 'PENDING APPROVAL',   color: 'bg-blue-50 border-blue-200 text-blue-800',      badgeColor: 'bg-blue-100 text-blue-800',     bgColor: 'from-blue-500 to-indigo-600',   contactTitle: 'Under Review',              steps: ['Registration is being reviewed', 'Process takes 24-48 hours', 'Check email for updates', 'Contact support for inquiry'] },
      forbidden:  { icon: <AlertTriangle className="w-10 h-10 text-purple-400" />, title: 'ACCESS FORBIDDEN', color: 'bg-purple-50 border-purple-200 text-purple-800', badgeColor: 'bg-purple-100 text-purple-800', bgColor: 'from-purple-600 to-violet-700', contactTitle: 'Permission Denied',         steps: ['Account lacks required permissions', 'Contact administrator', 'Verify your user role', 'Request access upgrade'] },
      restricted: { icon: <AlertCircle className="w-10 h-10 text-gray-400" />, title: 'ACCESS RESTRICTED', color: 'bg-gray-50 border-gray-200 text-gray-800',       badgeColor: 'bg-gray-100 text-gray-800',     bgColor: 'from-gray-600 to-slate-700',    contactTitle: 'Access Limitations',        steps: ['Temporary restrictions applied', 'Contact support', 'Check maintenance notices', 'Verify subscription'] },
    };
    return configs[agencyStatus] || configs.restricted;
  };

  return (
    <div className="min-h-screen flex overflow-hidden">

      {/* ══════════════════════════════════════════════
          LEFT PANEL — Travel Visual
      ══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[58%] relative flex-col overflow-hidden">

        {/* Sky gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d2347] to-[#1a3a6b]" />

        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width:  Math.random() > 0.8 ? '2px' : '1px',
                height: Math.random() > 0.8 ? '2px' : '1px',
                top:    `${Math.random() * 70}%`,
                left:   `${Math.random() * 100}%`,
                opacity: Math.random() * 0.6 + 0.2,
                animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Aurora glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-cyan-400/8 blur-3xl" />

        {/* Flight path arc SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 700 900" preserveAspectRatio="xMidYMid slice">
          <path
            d="M 80 700 Q 200 300 500 180 Q 620 140 660 100"
            fill="none"
            stroke="rgba(148,163,184,0.15)"
            strokeWidth="1.5"
            strokeDasharray="8 6"
          />
          {/* Animated plane dot on path */}
          <circle r="4" fill="#f59e0b" opacity="0.9">
            <animateMotion dur="8s" repeatCount="indefinite"
              path="M 80 700 Q 200 300 500 180 Q 620 140 660 100" />
          </circle>
          {/* Secondary path */}
          <path
            d="M 40 800 Q 350 500 650 200"
            fill="none"
            stroke="rgba(99,179,237,0.08)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-10">

          {/* Logo top */}
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-tight">Travel Agency</div>
              <div className="text-blue-300 text-xs tracking-widest uppercase">Management System</div>
            </div>
          </div>

          {/* Center hero text */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                <Globe className="w-3 h-3" /> World-class Travel Management
              </span>
            </div>
            <h1 className="text-5xl font-black text-white leading-tight mt-4 mb-4">
              Your Gateway<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                to the World
              </span>
            </h1>
            <p className="text-blue-200 text-base leading-relaxed max-w-sm">
              Manage bookings, clients, invoices and your entire travel agency from one powerful dashboard.
            </p>

            {/* Stats row */}
            <div className="flex gap-6 mt-8">
              {[
                { val: '500+', label: 'Agencies' },
                { val: '50K+', label: 'Bookings' },
                { val: '99.9%', label: 'Uptime' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black text-white">{s.val}</div>
                  <div className="text-blue-400 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Destination cards */}
          <div className="mt-auto">
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Popular Destinations
            </p>
            <div className="flex gap-2 flex-wrap">
              {DESTINATIONS.map((d) => (
                <div
                  key={d.city}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/8 border border-white/10 backdrop-blur-sm"
                  style={{ animation: `fadeInUp 0.6s ease both`, animationDelay: d.delay }}
                >
                  <span className="text-base">{d.flag}</span>
                  <div>
                    <div className="text-white text-xs font-semibold leading-tight">{d.city}</div>
                    <div className="text-blue-400 text-[10px]">{d.country}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom tagline */}
          <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/10">
            <div className="flex">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
            </div>
            <p className="text-blue-300 text-xs">Trusted by travel agencies across Pakistan</p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          RIGHT PANEL — Login Form
      ══════════════════════════════════════════════ */}
      <div className="w-full lg:w-[42%] flex flex-col justify-center bg-white px-8 sm:px-12 lg:px-14 py-12 relative">

        {/* Mobile-only brand header */}
        <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div className="text-gray-900 font-bold text-xl">Travel Agency Portal</div>
        </div>

        {/* Form header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Secure Agency Portal
          </div>
          <h2 className="text-3xl font-black text-gray-900 leading-tight">Welcome back</h2>
          <p className="text-gray-500 mt-2 text-sm">Sign in to your agency dashboard</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto flex-shrink-0 text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                autoComplete="email"
                placeholder="you@agency.com"
                className="w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder:text-gray-400 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full pl-11 pr-12 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-sm placeholder:text-gray-400 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying Agency...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Plane className="w-4 h-4" />
                Sign In to Dashboard
              </span>
            )}
          </button>
        </form>

        {/* Trust signals */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-green-500" /> Secure Login
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-500" /> Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" /> Active Agencies Only
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Travel Agency SaaS. All rights reserved.
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          AGENCY STATUS MODAL (logic unchanged)
      ══════════════════════════════════════════════ */}
      {showStatusModal && agencyStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300 overflow-hidden">
            {/* Status Header */}
            <div className={`bg-gradient-to-r ${getStatusConfig().bgColor} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                    {getStatusConfig().icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{getStatusConfig().title}</h2>
                    <p className="text-sm opacity-80 mt-0.5">Agency Access Blocked</p>
                  </div>
                </div>
                <button onClick={closeStatusModal} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{agencyDetails.name || 'Agency'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">ID: {agencyDetails.id || 'N/A'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusConfig().badgeColor}`}>
                  {agencyStatus.toUpperCase()}
                </span>
              </div>

              <div className={`p-4 rounded-xl border mb-4 ${getStatusConfig().color}`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm mb-2">{getStatusConfig().contactTitle}</p>
                    <ul className="space-y-1 text-xs">
                      {getStatusConfig().steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="mt-0.5 flex-shrink-0">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <a href="mailto:admin@travelagency.com" className="flex flex-col items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100">
                  <Mail className="w-5 h-5 mb-1.5" />
                  <span className="text-xs font-medium">Email Admin</span>
                </a>
                <a href="tel:+923001234567" className="flex flex-col items-center justify-center p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors border border-green-100">
                  <Phone className="w-5 h-5 mb-1.5" />
                  <span className="text-xs font-medium">Call Support</span>
                </a>
              </div>

              <button
                onClick={closeStatusModal}
                className="w-full p-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm"
              >
                Close & Try Again
              </button>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400">
              Ref: AGN-{Date.now().toString().slice(-8)} &nbsp;·&nbsp; {new Date().toLocaleTimeString('en-PK')}
            </div>
          </div>
        </div>
      )}

      {/* Global animation keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50%       { opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};

export default Login;
