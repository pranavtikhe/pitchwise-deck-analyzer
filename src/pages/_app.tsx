import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '@/styles/globals.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);

    if (!token && !location.pathname.startsWith('/auth/')) {
      navigate('/auth/login');
    }

    if (token && location.pathname.startsWith('/auth/')) {
      navigate('/');
    }
  }, [location.pathname, navigate]);

  return null;
}

export default App; 