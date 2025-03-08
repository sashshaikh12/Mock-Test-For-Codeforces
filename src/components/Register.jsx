import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { IoPerson } from "react-icons/io5";
import { Link } from "react-router-dom";


function Register() {

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name) newErrors.name = "Name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }   
    if (!password) newErrors.password = "Password is required";

    return newErrors;
  };


  const collectData = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const reqbody = { name, email, password };
    console.warn(reqbody);

    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqbody),
    });

    const data = await response.json();
    console.warn(data);
    // navigate("/home");

    setName("");
    setEmail("");
    setPassword("");
    setErrors({});
  };


  return (
    <div className="h-screen">
      <div className="grid grid-cols-[1fr_1.4fr] gap-4 h-full">
        {/* Left Side - Login Form */}
        <div className="flex flex-col loginColor text-white p-10 items-center justify-center text-center">
          <h1 className="font-bold text-3xl mb-6">Welcome Back!</h1>
          <p className="text-lg">
            Prepare for your next coding assessment with realistic mock tests. Practice, track your progress, and ace your interviews!
          </p>

          {/* Sign-up Button */}
          <Link to="/">
            <button className="w-48 mt-6 border border-white rounded-full p-3 hover:bg-white hover:text-teal-600 transition hover:cursor-pointer">
              SIGN IN
            </button>
          </Link>
        </div>

        {/* Right Side - Sign Up Prompt */}
        <div className="flex flex-col items-center justify-center">
            <h1 className="font-bold text-5xl">Create Account</h1>
            <p className="mb-8 mt-3 text-gray-600">Sign up to take a mock test and track your progress.</p>
  
            <button className="flex items-center space-x-4 border border-gray-300 p-3 hover:bg-gray-100 rounded-2xl mb-5 hover:cursor-pointer">
              <FcGoogle />
              <span>Sign in with Google</span>
            </button>

            <div className="relative w-72 mt-4">
              <IoPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 pl-10 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
  
            <div className="relative w-72 mt-4">
              <MdOutlineEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 pl-10 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
  
            <div className="relative w-72 mt-4">
              <TbLockPassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 pl-10 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

            <button onClick={collectData} className="w-72 mt-6 bg-teal-500 text-white rounded-full p-3 hover:bg-teal-600 transition hover:cursor-pointer">
              SIGN UP
            </button>
          </div>
      </div>
    </div>
  );
}

export default Register;
