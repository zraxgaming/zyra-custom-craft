
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Zyra Custom Craft - Personalized Crafts & Gifts",
  description = "Create unique personalized crafts and gifts at Zyra Custom Craft. Custom mugs, t-shirts, phone cases, and more with high-quality materials and fast delivery.",
  keywords = "custom crafts, personalized gifts, custom mugs, custom t-shirts, personalized phone cases, UAE crafts, custom printing",
  image = "https://shopzyra.vercel.app/og-image.jpg",
  url = "https://shopzyra.vercel.app",
  type = "website"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Zyra Custom Craft" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Zyra Custom Craft" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Schema.org markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Zyra Custom Craft",
          "description": description,
          "url": url,
          "logo": image,
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "AE"
          },
          "sameAs": [
            "https://www.facebook.com/zyracustomcraft",
            "https://www.instagram.com/zyracustomcraft"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
