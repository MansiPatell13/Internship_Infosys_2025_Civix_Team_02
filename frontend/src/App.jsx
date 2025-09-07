import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "../src/Pages/Login";
import SignUp from "../src/Pages/SignUp";
import Home from "./Components/Landing/Home";
import Poll from "../src/Pages/Poll";
import Dashboard from "../src/Pages/Dashboard";
import PetitionPage from "./Components/DashBoard/PetitionPage";
import ForgetPassword from "../src/Pages/ForgetPassword"
import OtpAuthentication from "../src/Pages/OtpAuthentication"
import ResetPassword from "../src/Pages/ResetPassword"
import PetitionHead from "./Components/DashBoard/PetitionHead"
import PetitionDetails from "./Components/DashBoard/PetitionDetails";
import CategoryPetitions from "./Components/DashBoard/PetitionCategory";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp" element={<OtpAuthentication />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/petition" element={<PetitionPage />} />
        <Route path="/poll" element={<Poll />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/petition-head" element={<PetitionHead />} />
        <Route path="/petition/:id" element={<PetitionDetails />} />
        <Route path="/petitions/category/:category" element={<CategoryPetitions />} />
      </Routes>
    </>
  );
}

export default App;
