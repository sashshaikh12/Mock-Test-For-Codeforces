import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export const ProtectedRoutes = ({ children }) => {
  const [auth, setAuth] = useState(null); // Initial state is null (unknown)

  useEffect(() => {
    const checkUser = async () => {
      let result = await fetch("http://localhost:5000/is-auth", {
        method: "post",
        credentials: "include",
      });

      if (result.status === 200) {
        setAuth(true);
      } else {
        setAuth(false);
      }
    };
    checkUser();
  }, []);

  // 🔹 Show loading state while checking auth
  if (auth === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#14B8A6" size={50} />
      </div>
    );
  }

  return auth ? children : <Navigate to="/" />;
};
