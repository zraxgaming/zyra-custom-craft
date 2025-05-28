
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website'
}) => {
  const location = useLocation();
  const currentUrl = `https://shopzyra.vercel.app${location.pathname}`;
  
  const defaultTitle = 'Zyra Custom Craft - Premium Custom Products & Gifts';
  const defaultDescription = 'Discover premium custom products and personalized gifts at Zyra Custom Craft. Quality craftsmanship, unique designs, and exceptional service for all your custom needs.';
  const defaultKeywords = 'custom products, personalized gifts, custom craft, premium quality, unique designs, personalized items, custom printing, bespoke products';
  const defaultImage = 'https://shopzyra.vercel.app/og-image.jpg';

  const seoTitle = title ? `${title} | Zyra Custom Craft` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoImage = image || defaultImage;
  const seoUrl = url || currentUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content="Zyra Custom Craft" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content="Zyra Custom Craft" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* PWA Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Zyra Craft" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Zyra Custom Craft",
          "url": "https://shopzyra.vercel.app",
          "logo": "https://shopzyra.vercel.app/logo.png",
          "description": seoDescription,
          "sameAs": []
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
