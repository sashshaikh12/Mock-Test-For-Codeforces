import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      let result = await fetch("http://localhost:5000/user-data", {
        method: "get",
        credentials: "include",
      });
      result = await result.json();
      if (result.name) {
        setName(result.name);
      }
    };
    checkUser();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen text-center">
        {/* Welcome Message */}
        <h1 className="font-semi-bold text-4xl mb-4">Hey {name}! 👋</h1>
        {/* Main Heading */}
        <h1 className="font-bold text-5xl mb-8 px-4">
          Ready to Level Up Your Coding Skills?
        </h1>
        {/* Image */}
        <img
          src="src/assets/undraw_coding_joxb.svg"
          alt="coding pic"
          className="h-60 mb-8"
        />
        {/* Subheading */}
        <h3 className="text-xl px-4">
          Time to sharpen your skills and conquer new challenges! 🚀
        </h3>
      </div>
    </div>
  );
}

export default Home;