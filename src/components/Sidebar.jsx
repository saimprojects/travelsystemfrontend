// // components/Sidebar.jsx
// import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import {
//   LayoutDashboard,
//   Settings,
//   Briefcase,
//   Users,
//   BookOpen,
//   Calendar,
//   BarChart3,
//   LogOut,
//   ChevronRight,
//   Building2,
// } from 'lucide-react';

// const Sidebar = () => {
//   const { user, logout } = useAuth();
//   const location = useLocation();

//   const navigation = [
//     { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['agency_owner', 'manager', 'agent', 'accountant'] },
//     { name: 'Settings', href: '/settings', icon: Settings, roles: ['agency_owner', 'manager'] },
//     { name: 'Services', href: '/services', icon: Briefcase, roles: ['agency_owner', 'manager', 'agent'] },
//     { name: 'Clients', href: '/clients', icon: Users, roles: ['agency_owner', 'manager', 'agent'] },
//     { name: 'Bookings', href: '/bookings', icon: BookOpen, roles: ['agency_owner', 'manager', 'agent'] },
//     { name: 'Onboard', href: '/onboard', icon: Calendar, roles: ['agency_owner', 'manager', 'agent'] },
//     { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['agency_owner', 'manager', 'accountant'] },
//   ];

//   const filteredNavigation = navigation.filter((item) =>
//     item.roles.includes(user?.role)
//   );

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div className="flex flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen animate-in slide-in-from-left-4 duration-500">
//       {/* Logo Section with animation */}
//       <div className="flex items-center justify-center h-16 bg-gray-800/50 border-b border-gray-700">
//         <Building2 className="w-8 h-8 mr-3 text-blue-400 animate-pulse" />
//         <h1 className="text-xl font-bold text-white">Travel Agency</h1>
//       </div>

//       {/* Navigation Menu */}
//       <div className="flex-1 overflow-y-auto py-6">
//         <nav className="px-4 space-y-1">
//           {filteredNavigation.map((item) => {
//             const Icon = item.icon;
//             const active = isActive(item.href);
            
//             return (
//               <Link
//                 key={item.name}
//                 to={item.href}
//                 className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
//                   active
//                     ? 'bg-blue-600/20 text-blue-300 border-l-4 border-blue-500 shadow-lg'
//                     : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:border-l-4 hover:border-gray-600'
//                 }`}
//               >
//                 <Icon className={`w-5 h-5 mr-3 ${active ? 'text-blue-400' : 'text-gray-400'}`} />
//                 <span className="font-medium">{item.name}</span>
                
//                 {/* Animated chevron for active state */}
//                 {active && (
//                   <ChevronRight className="ml-auto w-4 h-4 text-blue-400 animate-in slide-in-from-left-2 duration-300" />
//                 )}
                
//                 {/* Hover indicator */}
//                 {!active && (
//                   <div className="ml-auto w-1 h-1 rounded-full bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 )}
//               </Link>
//             );
//           })}
//         </nav>
//       </div>

//       {/* User Profile & Logout Section */}
//       <div className="p-4 bg-gray-800/30 border-t border-gray-700 animate-in fade-in-50 duration-700">
//         <div className="mb-4 px-3 py-3 bg-gray-800/40 rounded-lg">
//           <p className="text-xs text-gray-400 mb-1">Logged in as</p>
//           <p className="font-medium text-white">{user?.username}</p>
//           <p className="text-xs text-gray-400 mt-1">{user?.role_display}</p>
//         </div>
        
//         <button
//           onClick={logout}
//           className="flex items-center justify-center w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-red-600/20 rounded-lg transition-all duration-200 group border border-gray-700 hover:border-red-500/50"
//         >
//           <LogOut className="w-5 h-5 mr-3 group-hover:animate-pulse" />
//           <span className="font-medium">Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// components/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Settings,
  Briefcase,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  LogOut,
  ChevronRight,
  Building2,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['agency_owner', 'manager', 'agent', 'accountant'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['agency_owner', 'manager'] },
    { name: 'Services', href: '/services', icon: Briefcase, roles: ['agency_owner', 'manager', 'agent'] },
    { name: 'Clients', href: '/clients', icon: Users, roles: ['agency_owner', 'manager', 'agent'] },
    { name: 'Bookings', href: '/bookings', icon: BookOpen, roles: ['agency_owner', 'manager', 'agent'] },
    { name: 'Onboard', href: '/onboard', icon: Calendar, roles: ['agency_owner', 'manager', 'agent'] },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['agency_owner', 'manager', 'accountant'] },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role)
  );

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={`flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Toggle Section */}
      <div className="flex items-center justify-between h-16 bg-gray-800/50 border-b border-gray-700 px-4">
        {!isCollapsed ? (
          <>
            <div className="flex items-center">
              <Building2 className="w-8 h-8 mr-3 text-blue-400" />
              <h1 className="text-xl font-bold text-white truncate">Travel Agency</h1>
            </div>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-5 h-5 text-gray-300" />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center w-full">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
              title="Expand sidebar"
            >
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="px-4 space-y-1">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center rounded-lg transition-all duration-200 group ${
                  active
                    ? 'bg-blue-600/20 text-blue-300 border-l-4 border-blue-500 shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:border-l-4 hover:border-gray-600'
                } ${isCollapsed ? 'justify-center px-3 py-4' : 'px-4 py-3'}`}
                title={isCollapsed ? item.name : ''}
              >
                <Icon 
                  className={`${active ? 'text-blue-400' : 'text-gray-400'} ${
                    isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'
                  }`} 
                />
                
                {/* Text only shown when expanded */}
                {!isCollapsed && (
                  <>
                    <span className="font-medium">{item.name}</span>
                    
                    {/* Animated chevron for active state */}
                    {active && (
                      <ChevronRight className="ml-auto w-4 h-4 text-blue-400 animate-in slide-in-from-left-2 duration-300" />
                    )}
                    
                    {/* Hover indicator */}
                    {!active && (
                      <div className="ml-auto w-1 h-1 rounded-full bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Logout Section */}
      <div className="p-4 bg-gray-800/30 border-t border-gray-700">
        {!isCollapsed ? (
          <>
            <div className="mb-4 px-3 py-3 bg-gray-800/40 rounded-lg">
              <p className="text-xs text-gray-400 mb-1">Logged in as</p>
              <p className="font-medium text-white truncate">{user?.username}</p>
              <p className="text-xs text-gray-400 mt-1 truncate">{user?.role_display}</p>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center justify-center w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-red-600/20 rounded-lg transition-all duration-200 group border border-gray-700 hover:border-red-500/50"
            >
              <LogOut className="w-5 h-5 mr-3 group-hover:animate-pulse" />
              <span className="font-medium">Logout</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {/* Collapsed User Info */}
            <div className="flex flex-col items-center px-3 py-3 bg-gray-800/40 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mb-2">
                <span className="text-xs font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate" title={user?.role_display}>
                {user?.role_display?.split(' ')[0]}
              </p>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center justify-center p-3 text-gray-300 hover:text-white hover:bg-red-600/20 rounded-lg transition-all duration-200 group border border-gray-700 hover:border-red-500/50"
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:animate-pulse" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;