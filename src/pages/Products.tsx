
import React from 'react';
import { Navigate } from 'react-router-dom';

const Products = () => {
  // Redirect to Shop page since we moved all product functionality there
  return <Navigate to="/shop" replace />;
};

export default Products;
