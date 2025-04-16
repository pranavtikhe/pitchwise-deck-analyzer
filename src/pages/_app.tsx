import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);

    // If not authenticated and not on auth pages, redirect to login
    if (!token && !router.pathname.startsWith('/auth/')) {
      router.push('/auth/login');
    }

    // If authenticated and on auth pages, redirect to main app
    if (token && router.pathname.startsWith('/auth/')) {
      router.push('/');
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}

export default MyApp; 