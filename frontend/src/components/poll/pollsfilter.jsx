import React, { useEffect, useState } from "react";
import './pollsfilter.css';
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import Nav from "../Landing/Navbar.jsx"
import Lbox from "./leftbox.jsx";
import { IoIosAddCircleOutline } from "react-icons/io";
import Foot from "../Landing/Footer.jsx";
function Polls() {
  const [user, setUser] = useState({ name: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className='polls-container' style={{ padding: 0, margin: 0 }}>
     
      <Nav/>
       <div className="polls-main">
      <Lbox/>
      <div className="polls-right" >
        <div className="top">
            <div className="cr">
              <h1>Polls</h1>
              <button ><IoIosAddCircleOutline style={{ verticalAlign: "middle",color:'white' }}/>   Create Poll</button>
            </div>
            
            <p >Participate in community polls and make your voice heard</p>
         </div>
        <div className="p" >
         <div className="polls-list">
          <div className="one">
            <button>Active Polls</button>
            <button>Polls I Voted On</button>
            <button>My Polls</button>
            <button>Closed Polls</button>
          </div>
          <input
                type="text"
                id="location"
                name="location"
                placeholder=" Location .."/>
        </div>
        <p className="k">No poll found with current filters</p>
        <button className="k">Clear Filters</button>
        </div>
        

        <div className="ques">
          <h2>Have a question for your community?</h2>
          <p>Create a poll to gather input and understand public sentiment on local issues</p>
        </div>
         
      </div>
    
      </div>
      <Foot/>
    </div>
  );
}

export default Polls;
