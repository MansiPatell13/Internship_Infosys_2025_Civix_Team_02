import React, { useEffect, useState } from "react";
import './dashboard.css';
import { FaUserCircle,FaHome } from "react-icons/fa";
import { IoIosMail,IoMdCreate  } from "react-icons/io";
import { IoLocationSharp} from "react-icons/io5";
import { Link } from "react-router-dom";
import { MdOutlinePoll,MdOutlineHelp } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { CgLogOut } from "react-icons/cg";
function Dashboard() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    location: ""
  });

  useEffect(() => {
    // Example: Getting user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser({
        name: storedUser.name,
        email: storedUser.email,
        location: storedUser.location || "Unknown"
      });
    }
  }, []);

  return (
    <div className="dash" style={{ padding: 0, margin: 0 }}>
      <div className="navbar">
        <div className="navlogo">
          <img src="/logo.png" alt="Logo" style={{ width: '95px', height: '45px' }} />
        </div>
        <div className="nav-center">
          <a href="#" className="n1">Home</a>
          <a href="#" className="n1">Petitions</a>
          <a href="#" className="n1">Polls</a>
          <a href="#" className="n1">Reports</a>
        </div>
        <div className="nav-right">
          <FaUserCircle size={50} className="nr"/>
          <p className="nr">{user.name || "Username"}</p>
        </div>
      </div>
    <div className="main">
      <div className="box-left">
        <div className="user-box">
          <div className="box1">
          <FaUserCircle size={50} />
          <p className="user-name">{user.name || "Username"}</p>
          </div>
          <p className="user-location"><IoLocationSharp style={{ marginRight: "7px", verticalAlign: "middle" }}/> {user.location || "Location"}</p>
          <p className="user-email"><IoIosMail style={{ marginRight: "7px", verticalAlign: "middle" }} /> {user.email || "Email address"}</p>
        </div>

        <div className="option-box">
        <Link to="/dashboard" className="o1 o3" style={{ display: "flex", alignItems: "center" }}>
        <FaHome style={{ marginRight: "7px" }} />
        Dashboard
        </Link>

        <Link to="/create-petition" className="o1 o3" style={{ display: "flex", alignItems: "center" }}>
        <IoMdCreate style={{ marginRight: "7px" }} />
        Create a Petition
        </Link>

        <Link to="/create-poll" className="o1 o3" style={{ display: "flex", alignItems: "center" }}>
        <MdOutlinePoll style={{ marginRight: "7px" }} />
        Create a Poll
        </Link>

        <Link to="/reports" className="o1 o3" style={{ display: "flex", alignItems: "center" }}>
        <BsGraphUp style={{ marginRight: "7px" }} />
        Reports
        </Link>

        <Link to="/settings" className="o1 o3" style={{ display: "flex", alignItems: "center" }}>
        <IoMdSettings style={{ marginRight: "7px" }} />
        Settings
        </Link>

        <Link to="/help" className="o1 o3" style={{ display: "flex", alignItems: "center" ,marginTop:'3rem'}}>
        <MdOutlineHelp style={{ marginRight: "7px" }} />
        Help & Support
        </Link>

        <Link to="/login" className="o1 o3 o5" style={{ display: "flex", alignItems: "center" }}>
        <CgLogOut  style={{ marginRight: "7px"}} />
        Logout
        </Link>

      </div>

    </div>
    <div className="right-box">
      <div className="user-intro">
        <h1 style={{marginBottom:'0.5rem'}}>Welcome Back, {user.name || "Username"} !</h1>
        <p style={{marginTop:'0',marginLeft:'0.6rem'}}>Discover what’s happening in your community and share your thoughts</p>
      </div>
    </div>
  </div>
</div>
  );
}

export default Dashboard;
