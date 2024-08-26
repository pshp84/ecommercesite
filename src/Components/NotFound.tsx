import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-6xl font-extrabold text-gray-700">404</div>
      <h1 className="text-3xl font-semibold mt-4">Page Not Found</h1>
      <p className="text-lg text-gray-600 mt-2">Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
