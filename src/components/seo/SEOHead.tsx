
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
  siteName?: string;
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  noIndex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Zyra Custom Craft - Premium Customizable Products & Personalized Gifts',
  description = 'Discover premium customizable products at Zyra Custom Craft. From custom printing to bespoke designs, we create unique items tailored to your vision with exceptional quality and fast delivery in UAE.',
  url = 'https://shopzyra.vercel.app',
  image = 'https://shopzyra.vercel.app/og-image.jpg',
  type = 'website',
  siteName = 'Zyra Custom Craft',
  keywords = 'custom products, personalized gifts, crafting, UAE, customization, premium quality, custom printing, bespoke design, unique items, personalized products, Dubai crafts, custom merchandise',
  author = 'Zyra Custom Craft Team',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  noIndex = false
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": url,
    "description": description,
    "logo": `${url}/logo.png`,
    "image": image,
    "sameAs": [
      "https://facebook.com/zyracustomcraft",
      "https://instagram.com/zyracustomcraft",
      "https://twitter.com/zyracustomcraft",
      "https://linkedin.com/company/zyracustomcraft"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+971-50-123-4567",
      "contactType": "customer service",
      "areaServed": "UAE",
      "availableLanguage": ["English", "Arabic"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dubai",
      "addressCountry": "UAE"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <link rel="canonical" href={url} />
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="geo.region" content="AE" />
      <meta name="geo.placename" content="Dubai" />
      <meta name="geo.position" content="25.276987;55.296249" />
      <meta name="ICBM" content="25.276987, 55.296249" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={`${siteName} - Premium Custom Products`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="ar_AE" />
      
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@ZyraCustomCraft" />
      <meta name="twitter:creator" content="@ZyraCustomCraft" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={`${siteName} - Premium Custom Products`} />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#9333ea" />
      <meta name="msapplication-TileColor" content="#9333ea" />
      <meta name="application-name" content={siteName} />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* DNS Prefetch and Preconnect */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//api.ziina.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicons and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#9333ea" />
      
      {/* PWA Manifest */}
      <link rel="manifest" href="/manifest.json" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Additional Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": siteName,
          "description": description,
          "url": url,
          "telephone": "+971-50-123-4567",
          "priceRange": "$$",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dubai",
            "addressCountry": "UAE"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 25.276987,
            "longitude": 55.296249
          },
          "openingHours": "Mo-Sa 09:00-18:00",
          "paymentAccepted": "Credit Card, Debit Card, PayPal, Ziina",
          "currenciesAccepted": "AED, USD"
        })}
      </script>

      {/* Website Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": siteName,
          "url": url,
          "description": description,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${url}/shop?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
