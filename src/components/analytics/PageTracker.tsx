
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTrackPageView } from '@/hooks/use-analytics';

const PageTracker = () => {
  const location = useLocation();
  const trackPageView = useTrackPageView();

  useEffect(() => {
    trackPageView.mutate(location.pathname);
  }, [location.pathname]);

  return null;
};

export default PageTracker;
