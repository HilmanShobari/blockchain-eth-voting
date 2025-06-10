import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LoadingPage from './LoadingPage';

const withLoading = (WrappedComponent) => {
  return function WithLoadingComponent(props) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const handleStart = () => {
        setIsLoading(true);
      };

      const handleComplete = () => {
        setIsLoading(false);
      };

      const handleError = () => {
        setIsLoading(false);
      };

      // Add event listeners
      router.events.on('routeChangeStart', handleStart);
      router.events.on('routeChangeComplete', handleComplete);
      router.events.on('routeChangeError', handleError);

      // Clean up event listeners
      return () => {
        router.events.off('routeChangeStart', handleStart);
        router.events.off('routeChangeComplete', handleComplete);
        router.events.off('routeChangeError', handleError);
      };
    }, [router]);

    if (isLoading) {
      return <LoadingPage message="Loading Page..." />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withLoading; 