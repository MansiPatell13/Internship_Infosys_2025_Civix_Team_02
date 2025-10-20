import React, { useEffect, useState } from "react";
import './pollsfilter.css';
import { FaUserCircle, FaHome } from "react-icons/fa";
import { IoIosMail, IoMdCreate } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { MdOutlinePoll, MdOutlineHelp } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { CgLogOut } from "react-icons/cg";

function Lbox(){
    const [user, setUser] = useState({ name: "" });
    
      useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }, []);
        const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };
    return(
        
             <div className="polls-box-left">
                 <div className="polls-user-box">
                            <div className="polls-box1">
                              <FaUserCircle size={50} />
                              <p className="polls-user-name">{user.name || "Username"}</p>
                            </div>
                            <p className="polls-user-location">
                              <IoLocationSharp style={{ marginRight: "7px", verticalAlign: "middle" }} />
                              {user.location || "Location"}
                            </p>
                            <p className="polls-user-email">
                              <IoIosMail style={{ marginRight: "7px", verticalAlign: "middle" }} />
                              {user.email || "Email address"}
                            </p>
                 </div>

                <div className="poll-option-box">
                             <Link to="/dashboard" className="p-o1 p-o3" style={{ display: "flex", alignItems: "center" }}>
                               <FaHome style={{ marginRight: "7px" }} />
                               Dashboard
                             </Link>
                 
                             <Link to="/petitionhead" className="p-o1 p-o3" style={{ display: "flex", alignItems: "center" }}>
                               <IoMdCreate style={{ marginRight: "7px" }} />
                               Create a Petition
                             </Link>
                 
                             <Link to="/pollsfilter" className="p-o1 p-o3" style={{ display: "flex", alignItems: "center" }}>
                               <MdOutlinePoll style={{ marginRight: "7px" }} />
                               Create a Poll
                             </Link>
                 
                             <Link to="/reports" className="p-o1 p-o3" style={{ display: "flex", alignItems: "center" }}>
                               <BsGraphUp style={{ marginRight: "7px" }} />
                               Reports
                             </Link>
                 
                             <Link to="/settings" className="p-o1 p-o3" style={{ display: "flex", alignItems: "center" }}>
                               <IoMdSettings style={{ marginRight: "7px" }} />
                               Settings
                             </Link>
                 
                             <Link to="/help" className="p-o1 p-o3" style={{ display: "flex", alignItems: "center", marginTop: '3rem' }}>
                               <MdOutlineHelp style={{ marginRight: "7px" }} />
                               Help & Support
                             </Link>
                 
                             <Link
                               to="/login"
                               className="p-o1 p-o3 p-o5"
                               style={{ display: "flex", alignItems: "center" }}
                               onClick={handleLogout}>
                               <CgLogOut style={{ marginRight: "7px" }} />
                               Logout
                             </Link>
                 </div>
             </div>
       

    );
};

export default Lbox;
