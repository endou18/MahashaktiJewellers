import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check login status from localStorage
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    setIsLoading(false);  // Finished loading
  }, []);  // Only run once, when the component mounts

  // Show a loading state until the login status is determined
  if (isLoading) {
    return <div>Loading...</div>;  // Optional: Replace with a spinner or better loading UI
  }

  // If not logged in, redirect to login (prevent access to protected routes)
  if (!isLoggedIn) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If logged in, allow access to the protected route
  return children;
};

export default ProtectedRoute;
