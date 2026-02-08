import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import { Plane, AlertCircle, Lock, Shield, X, Phone, Mail, Ban, AlertTriangle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [agencyStatus, setAgencyStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [agencyDetails, setAgencyDetails] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAgencyStatus('');
    setStatusMessage('');
    setShowStatusModal(false);

    try {
      console.log('Login attempt with email:', email);
      
      // Directly call the AuthContext login function
      const success = await login(email, password);
      
      if (success) {
        navigate('/dashboard');
        return;
      }
      
      // If login returns false but no error was thrown, show generic error
      alert('Login failed. Please check your credentials.');
      
    } catch (error) {
      console.error('Login error:', error);
      console.error('Full error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Check for agency status errors from backend
      const errorDetail = error.response?.data?.detail || '';
      const errorMessage = errorDetail.toLowerCase();
      
      // Check for specific agency status keywords
      if (errorMessage.includes('inactive') || 
          errorMessage.includes('suspended') ||
          errorMessage.includes('locked') ||
          errorMessage.includes('blocked') ||
          errorMessage.includes('pending') ||
          errorMessage.includes('not active') ||
          errorMessage.includes('agency status')) {
        
        // Extract agency status from error message
        let status = 'restricted';
        let customMessage = '';
        
        if (errorMessage.includes('inactive')) {
          status = 'inactive';
          customMessage = 'Your agency account is currently INACTIVE. The account has been deactivated either by the administrator or due to subscription expiry.';
        } else if (errorMessage.includes('suspended')) {
          status = 'suspended';
          customMessage = 'Your agency account has been SUSPENDED. This is due to policy violations, security concerns, or non-payment issues.';
        } else if (errorMessage.includes('locked') || errorMessage.includes('blocked')) {
          status = 'locked';
          customMessage = 'Your agency account has been LOCKED. Account has been locked for security reasons or multiple failed login attempts.';
        } else if (errorMessage.includes('pending')) {
          status = 'pending';
          customMessage = 'Your agency account is PENDING APPROVAL. Your registration is under review by the administrator.';
        } else {
          status = 'restricted';
          customMessage = 'Your agency account access is RESTRICTED. The account status does not allow login at this time.';
        }
        
        // Extract agency details if available
        const agencyData = error.response?.data || {};
        setAgencyDetails({
          name: agencyData.agency_name || 'Unknown Agency',
          id: agencyData.agency_id || 'N/A',
          status: agencyData.agency_status || status
        });
        
        setAgencyStatus(status);
        setStatusMessage(customMessage + `\n\nError details: ${errorDetail}`);
        setShowStatusModal(true);
        
      } else if (error.response?.status === 401) {
        // Regular invalid credentials
        alert('Invalid email or password. Please try again.');
      } else if (error.response?.status === 403) {
        // Forbidden - likely agency status issue
        const data = error.response?.data || {};
        setAgencyStatus(data.agency_status || 'forbidden');
        setStatusMessage(data.detail || 'Access forbidden. Your agency account does not have permission to access the system at this time.');
        setAgencyDetails({
          name: data.agency_name || 'Unknown Agency',
          id: data.agency_id || 'N/A',
          status: data.agency_status || 'forbidden'
        });
        setShowStatusModal(true);
      } else if (error.response?.status === 400) {
        // Bad request
        alert(errorDetail || 'Please check your credentials and try again.');
      } else if (error.response?.status === 500) {
        // Server error - check Django console for details
        alert('Server error (500). Please contact administrator.');
        console.error('Django Server Error - Check Django console!');
      } else if (!error.response) {
        // Network error
        alert('Account Suspended Network error. Please check your connection and try again.');
      } else {
        // Other errors
        alert('Login failed. Please try again.');
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
    
    // Clear password field
    setPassword('');
  };

  const getStatusConfig = () => {
    const configs = {
      'inactive': {
        icon: <Ban className="w-12 h-12 text-amber-500" />,
        title: 'ACCOUNT INACTIVE',
        color: 'bg-amber-50 border-amber-200 text-amber-800',
        badgeColor: 'bg-amber-100 text-amber-800',
        bgColor: 'from-amber-400 to-amber-600',
        contactTitle: 'Account Reactivation Required',
        steps: [
          'Contact system administrator immediately',
          'Provide your agency registration details',
          'Complete any pending payments if applicable',
          'Wait for reactivation confirmation email'
        ]
      },
      'suspended': {
        icon: <Lock className="w-12 h-12 text-red-500" />,
        title: 'ACCOUNT SUSPENDED',
        color: 'bg-red-50 border-red-200 text-red-800',
        badgeColor: 'bg-red-100 text-red-800',
        bgColor: 'from-red-500 to-red-700',
        contactTitle: 'Urgent: Account Suspension',
        steps: [
          'This is a serious violation of terms',
          'Contact administrator IMMEDIATELY',
          'Provide explanation for suspension reason',
          'Follow suspension resolution procedure'
        ]
      },
      'locked': {
        icon: <Lock className="w-12 h-12 text-red-500" />,
        title: 'ACCOUNT LOCKED',
        color: 'bg-red-50 border-red-200 text-red-800',
        badgeColor: 'bg-red-100 text-red-800',
        bgColor: 'from-red-600 to-red-800',
        contactTitle: 'Security Lock Applied',
        steps: [
          'Account locked due to security concerns',
          'Multiple failed login attempts detected',
          'Contact administrator to unlock',
          'Verify your identity for security clearance'
        ]
      },
      'pending': {
        icon: <Shield className="w-12 h-12 text-blue-500" />,
        title: 'PENDING APPROVAL',
        color: 'bg-blue-50 border-blue-200 text-blue-800',
        badgeColor: 'bg-blue-100 text-blue-800',
        bgColor: 'from-blue-500 to-blue-700',
        contactTitle: 'Registration Under Review',
        steps: [
          'Your registration is being reviewed',
          'This process takes 24-48 hours',
          'Check your email for updates',
          'Contact support for status inquiry'
        ]
      },
      'forbidden': {
        icon: <AlertTriangle className="w-12 h-12 text-purple-500" />,
        title: 'ACCESS FORBIDDEN',
        color: 'bg-purple-50 border-purple-200 text-purple-800',
        badgeColor: 'bg-purple-100 text-purple-800',
        bgColor: 'from-purple-600 to-purple-800',
        contactTitle: 'Permission Denied',
        steps: [
          'Your account lacks required permissions',
          'Contact administrator for access rights',
          'Verify your user role and permissions',
          'Request access level upgrade if needed'
        ]
      },
      'restricted': {
        icon: <AlertCircle className="w-12 h-12 text-gray-500" />,
        title: 'ACCESS RESTRICTED',
        color: 'bg-gray-50 border-gray-200 text-gray-800',
        badgeColor: 'bg-gray-100 text-gray-800',
        bgColor: 'from-gray-600 to-gray-800',
        contactTitle: 'Access Limitations',
        steps: [
          'Temporary access restrictions applied',
          'Contact support for resolution',
          'Check for system maintenance notices',
          'Verify your subscription status'
        ]
      }
    };
    
    return configs[agencyStatus] || configs.restricted;
  };

  const formatStatusMessage = (message) => {
    return message.split('\n').map((line, index) => (
      <p key={index} className={index > 0 ? 'mt-2' : ''}>
        {line}
      </p>
    ));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-700 to-pink-700 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative border border-gray-200">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full shadow-xl">
            <Plane className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agency Portal
          </h1>
          <p className="text-gray-600 mb-2">Secure Login System</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-6">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Active Agencies Only
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              placeholder="Enter agency email"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              placeholder="Enter password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3.5 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verifying Agency Status...
              </div>
            ) : (
              'Verify & Login'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              <AlertCircle className="w-4 h-4 inline mr-1 text-blue-500" />
              System checks agency status automatically
            </p>
            <p className="text-xs text-gray-500">
              Only ACTIVE agency accounts can proceed
            </p>
          </div>
        </div>
      </div>

      {/* Agency Status Modal */}
      {showStatusModal && agencyStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-300 overflow-hidden">
            {/* Status Header with Gradient */}
            <div className={`bg-gradient-to-r ${getStatusConfig().bgColor} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    {getStatusConfig().icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{getStatusConfig().title}</h2>
                    <p className="text-sm opacity-90 mt-1">Agency Access Blocked</p>
                  </div>
                </div>
                <button
                  onClick={closeStatusModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Status Details */}
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Agency Details</h3>
                    <p className="text-sm text-gray-600">
                      {agencyDetails.name || 'Agency Name Not Available'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusConfig().badgeColor}`}>
                    {agencyStatus.toUpperCase()}
                  </span>
                </div>
                
                <div className={`p-4 rounded-xl ${getStatusConfig().color} mb-4`}>
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-2">{getStatusConfig().contactTitle}</p>
                      <div className="space-y-1.5 text-sm">
                        {getStatusConfig().steps.map((step, index) => (
                          <div key={index} className="flex items-start">
                            <span className="text-gray-600 mr-2">•</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-gray-700 text-sm">
                  <p className="font-medium mb-1">Status Message:</p>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    {formatStatusMessage(statusMessage)}
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Immediate Support Required:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <a 
                      href="mailto:admin@travelagency.com?subject=AGENCY%20STATUS%20ISSUE"
                      className="flex flex-col items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 border border-blue-200"
                    >
                      <Mail className="w-5 h-5 mb-2" />
                      <span className="text-xs">Email Admin</span>
                    </a>
                    <a 
                      href="tel:+923001234567"
                      className="flex flex-col items-center justify-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 border border-green-200"
                    >
                      <Phone className="w-5 h-5 mb-2" />
                      <span className="text-xs">Call Support</span>
                    </a>
                  </div>
                </div>
                
                <div className="text-center text-xs text-gray-500 space-y-1">
                  <p>Reference ID: AGN-{Date.now().toString().slice(-8)}</p>
                  <p>Time: {new Date().toLocaleTimeString('en-PK')}</p>
                </div>
                
                <button
                  onClick={closeStatusModal}
                  className="w-full p-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold"
                >
                  Close & Try Again
                </button>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="text-center text-xs text-gray-500">
                <p>© {new Date().getFullYear()} Travel Agency SaaS. All rights reserved.</p>
                <p className="mt-1">Unauthorized access is strictly prohibited</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;