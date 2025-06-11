
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  // Redirect to the correct ProductDetail route
  return <Navigate to={`/product-detail/${id}`} replace />;
};

export default ProductDetails;
