import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login.jsx';
import Signup from './components/signup.jsx';
import Home from "./components/Landing/Home";
import './App.css';
import Forgot from './components/forgot.jsx';
import OtpVerification from './components/otpverfication.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import Dashboard from './components/dashboard.jsx';
import Polls from './components/poll/pollsfilter.jsx';
import PetitionHead from './components/Petition/PetitionHead.jsx';
import PetitionDetails from "./components/Petition/PetitionDetails";
import PetitionCategory from "./components/Petition/PettionCategory";
import PetitionPage from "./components/Petition/PetitionPage";
import PollCreation from './components/NavbarPoll/PollCreation.jsx';
import PollHead from './components/poll/PollHead.jsx'
function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/forgot' element={<Forgot/>}/>
        <Route path='/otpverification' element={<OtpVerification/>}/>
        <Route path='/resetpassword' element={<ResetPassword/>}/>
        <Route path='/petition-head' element={<PetitionHead/>}/>
        <Route path="/petition/:id" element={<PetitionDetails />} />
        <Route path="/petitions/category/:category" element={<PetitionCategory />} />
        <Route path="/petition" element={<PetitionPage />} />
        <Route path='/pollsfilter' element={<Polls/>}/>
        <Route path='/poll-creation' element={<PollCreation/>}/>
        <Route path='poll-head' element={<PollHead/>}/>
      </Routes>
    </Router>
  );
}

export default App;
