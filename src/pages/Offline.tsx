import React from 'react';

const Offline: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <h1 className="text-4xl font-bold text-purple-700 mb-4">You are offline</h1>
    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Please check your internet connection and try again.</p>
    <img src="/placeholder.svg" alt="Offline" className="w-48 h-48" />
  </div>
);

export default Offline;
