import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI, bookingsAPI } from '../services/api';
import { Users, BookOpen, DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, MoreVertical, Eye, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, bookingsRes] = await Promise.all([
        analyticsAPI.getAnalytics({ period: selectedPeriod }),
        bookingsAPI.getBookings({ page_size: 5 }),
      ]);
      
      setAnalytics(analyticsRes.data);
      setRecentBookings(bookingsRes.data.results || bookingsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Function to format PKR currency
  const formatPKR = (amount) => {
    if (!amount) return '₨ 0';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₨ ${num.toLocaleString('en-PK')}`;
  };

  // Function to get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 animate-in fade-in-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Bookings',
      value: analytics?.total_bookings || 0,
      change: analytics?.booking_change || 0,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      link: '/bookings',
    },
    {
      name: 'Total Customers',
      value: analytics?.total_customers || 0,
      change: analytics?.customer_change || 0,
      icon: Users,
      color: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      link: '/clients',
    },
    {
      name: 'Total Sales',
      value: formatPKR(analytics?.amounts?.total_sales || 0),
      change: analytics?.sales_change || 0,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      link: '/analytics',
    },
    {
      name: 'Total Received',
      value: formatPKR(analytics?.amounts?.total_received || 0),
      change: analytics?.revenue_change || 0,
      icon: TrendingUp,
      color: 'from-amber-500 to-amber-600',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      link: '/analytics',
    },
  ];

  const periodOptions = [
    { value: 'daily', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'yearly', label: 'This Year' },
  ];

  const quickActions = [
    { label: 'Create Booking', icon: BookOpen, path: '/bookings?action=create', color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'Add Client', icon: Users, path: '/clients?action=create', color: 'bg-green-500 hover:bg-green-600' },
    { label: 'Add Service', icon: TrendingUp, path: '/services?action=create', color: 'bg-purple-500 hover:bg-purple-600' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      {/* Header with Greeting & Period Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 animate-in slide-in-from-left-4 duration-500">
            {getGreeting()}, {user?.first_name || user?.username}!
          </h1>
          <p className="text-gray-600 mt-2 animate-in slide-in-from-left-4 duration-700">
            Here's what's happening with your agency today
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm animate-in slide-in-from-right-4 duration-500">
          <Calendar className="w-4 h-4 text-gray-500 ml-2" />
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border-0 focus:ring-0 text-sm text-gray-700 font-medium bg-transparent"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in-50 duration-500">
        {quickActions.map((action, index) => (
          <Link
            key={action.label}
            to={action.path}
            className={`${action.color} text-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 animate-in slide-in-from-bottom-2`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Quick Action</p>
                <p className="text-lg font-semibold mt-1">{action.label}</p>
              </div>
              <action.icon className="w-8 h-8 opacity-90" />
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Grid with animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;
          
          return (
            <Link
              key={stat.name}
              to={stat.link}
              className="block"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-in fade-in-50 group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.iconBg} animate-in zoom-in-50 duration-300`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                  
                  {/* Change indicator */}
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      isPositive 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {isPositive ? (
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(stat.change)}%
                    </div>
                    <span className="text-xs text-gray-500">
                      {isPositive ? 'increase' : 'decrease'} from last period
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Bookings Section */}
      {user?.role !== 'accountant' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in-50 duration-700">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
              <p className="text-sm text-gray-500 mt-1">Latest customer bookings</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={fetchDashboardData}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Refresh
              </button>
              <Link 
                to="/bookings"
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-1 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4 mr-1" />
                View All
              </Link>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/50">
                <tr className="animate-in fade-in-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking, index) => (
                    <tr 
                      key={booking.id}
                      className="hover:bg-gray-50/50 transition-colors duration-150 animate-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {booking.client_details?.name?.charAt(0) || 'C'}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.client_details?.name || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.client_details?.email || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {booking.service_details?.service_name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          booking.booking_status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.booking_status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            booking.booking_status === 'confirmed'
                              ? 'bg-green-500'
                              : booking.booking_status === 'pending'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}></div>
                          {booking.booking_status_display}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          booking.payment_status === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : booking.payment_status === 'HALF_PAID'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                            booking.payment_status === 'PAID'
                              ? 'bg-green-500'
                              : booking.payment_status === 'HALF_PAID'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          }`}></div>
                          {booking.payment_status_display}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatPKR(booking.total_amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link 
                          to={`/bookings/${booking.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm font-medium">No bookings yet</p>
                        <p className="text-xs mt-1">Start by creating your first booking</p>
                        <Link
                          to="/bookings?action=create"
                          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Create Booking
                        </Link>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {recentBookings.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
              <Link 
                to="/bookings"
                className="flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-700 w-full text-center py-2 hover:bg-blue-50/50 rounded-lg transition-colors"
              >
                View all bookings
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      )}




    </div>
  );
};

export default Dashboard;