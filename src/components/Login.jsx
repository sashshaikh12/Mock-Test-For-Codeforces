import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      let result = await fetch("http://localhost:5000/is-auth", {
        method: "post",
        credentials: "include",
      });

      if (result.status === 200) {
        navigate("/home", { replace: true }); // Redirect logged-in users to home
      }
    };
    checkUser();
  }, []);

  const handlelogin = async () => {
    let result = await fetch("http://localhost:5000/login", {
      method: "post",
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await result.json();
    console.log(result)

    if(result.status === 200) {
      if(response.codeforcesVerificationRequired){
        navigate("/codeforces-verify", {state: {email: response.email}});
      }
      else
      {
        navigate("/home", { replace: true });
      }
    }
    else{
      alert("invalid credentials");
    }
  };

  const onSuccess = async (res) => {
    console.log("Successfully logged in", res);
    const decoded = jwtDecode(res.credential);
    console.log(decoded);

    let serverResponse = await fetch("http://localhost:5000/google-login", {
      method: "POST",
      credentials: "include", // Important: Allows cookies to be set
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: res.credential }),
    });

    const result = await serverResponse.json();
    
    if (serverResponse.status === 200) {
      if(result.codeforcesVerificationRequired){
        navigate("/codeforces-verify", {state: {email: result.email}});
      }
      else
      {
      navigate("/home", { replace: true });
      }
    } else {
      alert("Google login failed");
    }
  };

  const onFailure = (res) => {
    alert("Login failed");
  };

  return (
    <div className="h-screen">
      {/* Desktop Layout (lg and above) */}
      <div className="hidden lg:grid grid-cols-[1.4fr_1fr] gap-4 h-full">
        {/* Left Side - Login Form */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-bold text-5xl">Welcome Back</h1>
          <p className="mb-8 mt-3 text-gray-600">Log in to take a mock test and track your progress.</p>

          <div className="flex items-center space-x-4 mb-5 hover:cursor-pointer">
            <GoogleLogin
              onSuccess={onSuccess}
              onFailure={onFailure}
              text="Sign in with Google"
              shape="pill"
              size="large"
              auto_select="true"
            />
          </div>

          <div className="relative w-72">
            <MdOutlineEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 pl-10 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

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

          <button
            onClick={handlelogin}
            className="w-72 mt-6 bg-teal-500 text-white rounded-full p-3 hover:bg-teal-600 transition hover:cursor-pointer"
          >
            SIGN IN
          </button>
        </div>

        {/* Right Side - Sign Up Prompt */}
        <div className="flex flex-col loginColor text-white">
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <h1 className="font-bold text-3xl mb-6">Hello, Coder!</h1>
            <p className="text-lg">Get ready for your next challenge—log in and take a mock test to sharpen your skills.</p>
            <Link to="/register">
              <button className="w-48 mt-6 border border-white rounded-full p-3 hover:bg-white hover:text-teal-600 transition hover:cursor-pointer">
                SIGN UP
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Layout (below lg) */}
      <div className="lg:hidden flex items-center justify-center h-full p-4">
        {/* Card-like Container */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="font-bold text-3xl mb-4 text-center">Welcome Back</h1>
          <p className="mb-8 text-gray-600 text-center">Log in to take a mock test and track your progress.</p>

          <div className="flex items-center justify-center mb-5 hover:cursor-pointer">
            <GoogleLogin
              onSuccess={onSuccess}
              onFailure={onFailure}
              text="Sign in with Google"
              shape="pill"
              size="large"
              auto_select="true"
            />
          </div>

          <div className="relative w-full mb-4">
            <MdOutlineEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 pl-10 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div className="relative w-full mb-4">
            <TbLockPassword className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 pl-10 w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <button
            onClick={handlelogin}
            className="w-full mt-6 bg-teal-500 text-white rounded-full p-3 hover:bg-teal-600 transition hover:cursor-pointer"
          >
            SIGN IN
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">Don't have an account?</p>
            <Link to="/register">
              <button className="mt-2 text-teal-500 hover:text-teal-600 transition hover:cursor-pointer">
                SIGN UP
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;