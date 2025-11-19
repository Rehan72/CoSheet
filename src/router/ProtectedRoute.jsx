import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Layout from "../Layout";


const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const isAuthenticated = true;

  useEffect(() => {
    // Simulate loading check (replace with actual authentication check)
    const checkAuth = async () => {
      // Add any async authentication logic here
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading instead of null

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Layout>{children}</Layout>;
};


export default ProtectedRoute;
