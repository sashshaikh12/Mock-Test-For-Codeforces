import React, { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import Navbar from "./Navbar";

function Home() {

  const navigate = useNavigate();
  const [name, setName] = useState("User");

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

  useEffect(() => {
    const checkUser = async () => {
      let result = await fetch("http://localhost:5000/user-data", {
        method: "get",
        credentials: "include",
      });
      result = await result.json();
      if(result.name){
        setName(result.name);
      }
    };
    checkUser();
  }
  , []);


  return (
    <div>
      <Navbar />
      <h1>Welcome {name}</h1>
    </div>
  );
}

export default Home;