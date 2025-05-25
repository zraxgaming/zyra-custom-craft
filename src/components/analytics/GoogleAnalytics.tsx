
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

export default GoogleAnalytics;
