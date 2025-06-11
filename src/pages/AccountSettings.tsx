
import React from 'react';
import { Navigate } from 'react-router-dom';

const AccountSettings = () => {
  // Redirect to Profile page since we moved all account functionality there
  return <Navigate to="/profile" replace />;
};

export default AccountSettings;
