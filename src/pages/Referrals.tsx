
import React from 'react';
import { Navigate } from 'react-router-dom';

const Referrals = () => {
  // Redirect to Profile page since we moved referrals functionality there
  return <Navigate to="/profile" replace />;
};

export default Referrals;
