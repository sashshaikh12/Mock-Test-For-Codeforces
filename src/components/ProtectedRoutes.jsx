import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export const ProtectedRoutes = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [testOngoing, setTestOngoing] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkUserAndTest = async () => {
      try {
        // First check if user is authenticated
        const authResult = await fetch("http://localhost:5000/is-auth", {
          method: "post",
          credentials: "include",
        });
        
        if (authResult.status !== 200) {
          setAuth(false);
          setLoading(false);
          return;
        }
        
        setAuth(true);
        
        // Then check if there's an ongoing test
        const testResult = await fetch("http://localhost:5000/is-test-ongoing", {
          method: "post",
          credentials: "include",
        });
        
        const testData = await testResult.json();
        setTestOngoing(testResult.status === 200);
        setLoading(false);
      } catch (error) {
        console.error("Auth/test check error:", error);
        setAuth(false);
        setLoading(false);
      }
    };
    
    checkUserAndTest();
  }, []);

  // Show loading state while checking
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#14B8A6" size={50} />
      </div>
    );
  }


  // Handle authentication/test status
  if (!auth) {
    // Not authenticated, go to login
    return <Navigate to="/" />;
  } else if (testOngoing && location.pathname !== "/mock-test-dashboard") {
    // Test is ongoing but not on test dashboard, redirect there
    return <Navigate to="/mock-test-dashboard" />;
  }
  // Authentication is good and on the correct page for test status
  return children;
};