import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import "./styles/app.scss";
import { AuthProvider } from "./lib/authContext";

function App() {
  return (
    <AuthProvider>
      <HashRouter basename="/">
        <AppContent />
      </HashRouter>
    </AuthProvider>
  );
}

function AppContent() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
