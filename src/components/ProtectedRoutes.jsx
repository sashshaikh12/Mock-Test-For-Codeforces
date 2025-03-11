import {useEffect} from "react";
import { Navigate, useNavigate} from "react-router-dom";


export const ProtectedRoutes = ({children}) => {

    const navigate = useNavigate();
    
    useEffect(() => {
        const checkUser = async () => {
          let result = await fetch("http://localhost:5000/is-auth", {
            method: "post",
            credentials: "include",
          });
          result = await result.json();
          

          if (result.status !== 200) {
            <Navigate to="/" />
          }
        };
        checkUser();
      }
      , []);

      return children;
};