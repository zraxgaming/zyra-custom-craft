
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface OpenGraphProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

const OpenGraph: React.FC<OpenGraphProps> = ({
  title = "Zyra - Premium E-commerce Platform",
  description = "Discover premium products at Zyra - your destination for quality, customization, and style.",
  image = "/icon-512.png",
  url = "https://zyra.lovable.app",
  type = "website",
  siteName = "Zyra"
}) => {
  return (
    <Helmet>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default OpenGraph;
