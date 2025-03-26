import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import MockTestSetup from "./components/MockTestSetup";
import CodeforcesVerify from "./components/CodeforcesVerify";
import { ProtectedRoutes } from "./components/ProtectedRoutes";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectedRoutes> <Home /> </ProtectedRoutes>} />
        <Route path="/mock-test-setup" element={<ProtectedRoutes> <MockTestSetup /> </ProtectedRoutes>} />
        <Route path="/codeforces-verify" element={<CodeforcesVerify />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
