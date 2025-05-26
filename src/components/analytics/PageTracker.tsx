
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTrackPageView } from '@/hooks/use-analytics';

const PageTracker = () => {
  const location = useLocation();
  const { trackPageView } = useTrackPageView();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  return null;
};

export default PageTracker;
