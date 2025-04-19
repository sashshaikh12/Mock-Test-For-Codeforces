import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import MockTestSetup from "./components/MockTestSetup";
import CodeforcesVerify from "./components/CodeforcesVerify";
import MockTestDashboard from "./components/MockTestDash";
import TestReport from "./components/TestReport";
import History from "./components/History";
import Favourites from "./components/Favourites";
import Practice from "./components/Practice";
import { ProtectedRoutes } from "./components/ProtectedRoutes";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<ProtectedRoutes> <Home /> </ProtectedRoutes>} />
        <Route path="/mock-test-setup" element={<ProtectedRoutes> <MockTestSetup /> </ProtectedRoutes>} />
        <Route path="/mock-test-dashboard" element={<ProtectedRoutes> <MockTestDashboard /> </ProtectedRoutes>} />
        <Route path="/history" element={<ProtectedRoutes> <History /> </ProtectedRoutes>} />
        <Route path="/favourites" element={<ProtectedRoutes> <Favourites /> </ProtectedRoutes>} />
        <Route path="/practice" element={<ProtectedRoutes> <Practice /> </ProtectedRoutes>} />
        <Route path="/codeforces-verify" element={<CodeforcesVerify />} />
        <Route path="/test-report/:token" element={<ProtectedRoutes> <TestReport /> </ProtectedRoutes>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
