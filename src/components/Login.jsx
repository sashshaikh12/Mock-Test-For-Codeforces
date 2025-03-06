import React from "react";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";

function Login() {
  return (
    <div className="h-screen">
      <div className="grid grid-cols-[1.4fr_1fr] gap-4 h-full">
        {/* Left Side - Login Form */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold text-5xl">Welcome Back</h1>
          <p className="mb-8 mt-3 text-gray-600">Log in to take a mock test and track your progress.</p>

          <button className="flex items-center space-x-4 border border-gray-300 p-3 hover:bg-gray-100 rounded-2xl mb-5 hover:cursor-pointer">
            <FcGoogle />
            <span>Sign in with Google</span>
          </button>

          <div className="relative w-72">
            <MdOutlineEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Email"
              className="border border-gray-300 rounded-lg p-3 pl-10 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div className="relative w-72 mt-4">
            <TbLockPassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="border border-gray-300 rounded-lg p-3 pl-10 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <button className="w-72 mt-6 bg-teal-500 text-white rounded-full p-3 hover:bg-teal-600 transition hover:cursor-pointer">
            Sign in
          </button>
        </div>

        {/* Right Side - Sign Up Prompt */}
        <div className="flex flex-col loginColor text-white">
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <h1 className="font-bold text-3xl mb-4">Hello, Coder!</h1>
            <p className="text-lg">Get ready for your next challenge—log in and take a mock test to sharpen your skills.</p>
            <button className="w-48 mt-6 border border-white rounded-full p-3 hover:bg-white hover:text-teal-600 transition hover:cursor-pointer">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
