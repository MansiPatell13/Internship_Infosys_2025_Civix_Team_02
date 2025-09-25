// import React, { useEffect, useState } from "react";
// import './dashboard.css';
// import { FaUserCircle } from "react-icons/fa";
// import { IoIosMail, IoMdCreate } from "react-icons/io";
// import { IoLocationSharp } from "react-icons/io5";
// import { Link, Outlet, useLocation } from "react-router-dom";
// import { MdOutlinePoll, MdOutlineHelp, MdOutlineDashboard } from "react-icons/md";
// import { BsGraphUp } from "react-icons/bs";
// import { IoMdSettings } from "react-icons/io";
// import { CgLogOut } from "react-icons/cg";
// import Navbar from '../components/Landing/Navbar';
// import Footer from '../components/Landing/Footer';

// function DashboardLayout() {
//   const [user, setUser] = useState({ name: "", email: "", location: "" });
//   const location = useLocation();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));

//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;
//         const response = await fetch("http://localhost:4000/api/dashboard", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//             "Cache-Control": "no-cache",
//           },
//           cache: "no-store",
//         });

//         if (!response.ok) throw new Error("Failed to fetch user data");
//         const data = await response.json();
//         if (data.user) {
//           setUser({
//             name: data.user.name,
//             email: data.user.email,
//             location: data.user.location || "Unknown",
//           });
//           localStorage.setItem("user", JSON.stringify(data.user));
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };
//     fetchUserData();
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   };

//   return (
//     <div className="dashboard-container">
//       <Navbar user={user} />
//       <div className="main-content-wrapper">
//         {/* Left Panel - Fixed */}
//         <div className="left-panel">
//           <div className="user-card">
//             <div className="user-info">
//               <FaUserCircle className="user-avatar" />
//               <h2>{user.name || "Username"}</h2>
//               <p><IoLocationSharp /> {user.location || "Location"}</p>
//               <p><IoIosMail /> {user.email || "Email address"}</p>
//             </div>
//           </div>

//           <div className="menu-card">
//             <div className="menu-list">
//               <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
//                 <MdOutlineDashboard className="icon" /> Dashboard
//               </Link>
//               <Link to="/dashboard/petition" className={location.pathname === "/dashboard/petition" ? "active" : ""}>
//                 <IoMdCreate className="icon" /> Create a Petition
//               </Link>
//               <Link to="/dashboard/poll-creation" className={location.pathname === "/dashboard/poll-creation" ? "active" : ""}>
//                 <MdOutlinePoll className="icon" /> Create a Poll
//               </Link>
//               <Link to="/dashboard/reports" className={location.pathname === "/dashboard/reports" ? "active" : ""}>
//                 <BsGraphUp className="icon" /> Reports
//               </Link>
//               <Link to="/dashboard/settings" className={location.pathname === "/dashboard/settings" ? "active" : ""}>
//                 <IoMdSettings className="icon" /> Settings
//               </Link>
//               <Link to="/dashboard/help" className={location.pathname === "/dashboard/help" ? "active" : ""}>
//                 <MdOutlineHelp className="icon" /> Help & Support
//               </Link>
//             </div>
//             <Link to="/login" className="menu-list logout" onClick={handleLogout}>
//               <CgLogOut className="icon" /> Logout
//             </Link>
//           </div>
//         </div>

//         {/* Right Panel - Dynamic Content */}
//         <div className="right-panel">
//           <Outlet />
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default DashboardLayout;
