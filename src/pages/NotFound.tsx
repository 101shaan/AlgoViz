import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
      <div className="absolute">
        <h2 className="text-2xl font-bold bg-white dark:bg-gray-900 px-4 py-2 rounded-lg mb-4">
          Page Not Found
        </h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mt-16 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
      >
        <Home className="w-5 h-5" /> Go Home
      </button>
    </div>
  );
};

export default NotFound;