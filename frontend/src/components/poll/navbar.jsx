import React, { useEffect, useState } from "react";
import './pollsfilter.css';
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";



function Nav(){
      const [user, setUser] = useState({ name: "" });
    
      useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }, []);
    return(
        <div className="polls-navbar">
            <div className="polls-logo">
                    <img src="/logo.png" alt="Logo" style={{ width: '95px', height: '45px' }} />
            </div>
            <div className="polls-nav-center">
                      <Link to="/dashboard" className="n1">Home</Link>
                      <Link to="/petitionhead" className="n1">Petitions</Link>
                      <Link to="/pollsfilter" className="n1">Polls</Link>
                      <Link to="/reports" className="n1">Reports</Link>
            </div>
            <div className="polls-nav-right">
                      <FaUserCircle size={50} className="nr" />
                      <p className="nr">{user.name || "Username"}</p>
            </div>
        </div>
    );
}

export default Nav;