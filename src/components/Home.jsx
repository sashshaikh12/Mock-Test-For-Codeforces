import {React, useContext, useEffect} from "react";
import { useNavigate} from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      let result = await fetch("http://localhost:5000/is-auth", {
        method: "post",
        credentials: "include",
      });
      result = await result.json();
      console.log(result);
      if (result.message !== "Authenticated") {
        navigate("/");
      }
    };
    checkUser();
  }
  , []);


  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

export default Home;