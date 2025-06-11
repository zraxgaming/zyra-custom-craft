
import React from 'react';
import { Navigate } from 'react-router-dom';

const Products = () => {
  // Redirect to AdminProducts page
  return <Navigate to="/admin/products" replace />;
};

export default Products;
