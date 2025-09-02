import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login.jsx';
import Signup from './components/signup.jsx';

import './App.css';
import Forgot from './components/forgot.jsx';
import OtpVerification from './components/otpverfication.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import Dashboard from './components/dashboard.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/forgot' element={<Forgot/>}/>
        <Route path='/otpverification' element={<OtpVerification/>}/>
        <Route path='/resetpassword' element={<ResetPassword/>}/>
      </Routes>
    </Router>
  );
}

export default App;
