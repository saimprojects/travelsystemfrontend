// components/PageLoader.jsx
const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated loader */}
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Text with fade animation */}
        <p className="mt-6 text-gray-600 font-medium animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;