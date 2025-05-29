
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
  siteName?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Zyra Custom Craft - Premium Customizable Products',
  description = 'Discover premium customizable products at Zyra Custom Craft. Transform ordinary items into personalized masterpieces with our expert crafting services.',
  url = 'https://shopzyra.vercel.app',
  image = 'https://shopzyra.vercel.app/og-image.jpg',
  type = 'website',
  siteName = 'Zyra Custom Craft'
}) => {
  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@ZyraCustomCraft" />

      {/* Additional SEO */}
      <meta name="author" content="Zyra Custom Craft" />
      <meta name="keywords" content="custom products, personalized gifts, crafting, UAE, customization, premium quality" />
      <meta name="theme-color" content="#9333ea" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteName,
          "url": url,
          "description": description,
          "logo": `${url}/logo.png`,
          "sameAs": [
            "https://facebook.com/zyracustomcraft",
            "https://instagram.com/zyracustomcraft",
            "https://twitter.com/zyracustomcraft"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
