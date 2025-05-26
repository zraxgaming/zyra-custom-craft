
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'Organization' | 'Product' | 'WebSite' | 'BreadcrumbList' | 'Review';
  data: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      ...data
    };

    return JSON.stringify(baseData);
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {generateStructuredData()}
      </script>
    </Helmet>
  );
};

export default StructuredData;
