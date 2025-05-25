
import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  author?: string;
  siteName?: string;
  locale?: string;
  alternateLanguages?: { locale: string; url: string }[];
  structuredData?: object;
  noIndex?: boolean;
  canonical?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Zyra - Premium E-commerce Platform",
  description = "Discover premium products at Zyra - your destination for quality, customization, and style. Shop personalized products with fast delivery.",
  keywords = "e-commerce, premium products, customization, online shopping, personalized items",
  image = "/icon-512.png",
  url = "https://zyra.lovable.app",
  type = "website",
  author = "Zyra Team",
  siteName = "Zyra",
  locale = "en_US",
  alternateLanguages = [],
  structuredData,
  noIndex = false,
  canonical
}) => {
  const fullTitle = title.includes("Zyra") ? title : `${title} | Zyra`;
  const imageUrl = image.startsWith("http") ? image : `${url}${image}`;
  const currentUrl = canonical || url;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
      <meta name="language" content={locale.split("_")[0]} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:creator" content="@zyra" />
      <meta name="twitter:site" content="@zyra" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#8B5CF6" />
      <meta name="msapplication-TileColor" content="#8B5CF6" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Alternate Languages */}
      {alternateLanguages.map((lang) => (
        <link
          key={lang.locale}
          rel="alternate"
          hrefLang={lang.locale}
          href={lang.url}
        />
      ))}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": siteName,
          "url": url,
          "logo": `${url}/icon-512.png`,
          "sameAs": [
            "https://facebook.com/zyra",
            "https://twitter.com/zyra",
            "https://instagram.com/zyra"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-0123",
            "contactType": "customer service",
            "availableLanguage": ["English"]
          }
        })}
      </script>
      
      {/* Website Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": siteName,
          "url": url,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${url}/shop?search={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
