// import React, { useEffect, useState } from "react";
// import './dashboard.css';
// import { IoLocationSharp } from "react-icons/io5";

// function DashboardHome() {
//   const [petitions, setPetitions] = useState([]);
//   const [filteredPetitions, setFilteredPetitions] = useState([]);
//   const [locationFilter, setLocationFilter] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("All Categories");

//   useEffect(() => {
//     const fetchPetitions = async () => {
//       try {
//         const response = await fetch('http://localhost:4000/api/petitions', { cache: "no-store" });
//         if (!response.ok) throw new Error("Failed to fetch petitions");
//         const data = await response.json();
//         const normalizedPetitions = data.map(p => ({
//           id: p._id?.$oid || p._id || p.id,
//           title: p.title,
//           description: p.description,
//           category: p.category,
//           location: p.location,
//           image: p.image ? `http://localhost:4000${p.image}` : null,
//           status: p.status,
//         }));
//         setPetitions(normalizedPetitions);
//         setFilteredPetitions(normalizedPetitions);
//       } catch (error) {
//         console.error("Error fetching petitions:", error);
//       }
//     };
//     fetchPetitions();
//   }, []);

//   useEffect(() => {
//     let filtered = petitions;
//     if (locationFilter.trim() !== "") {
//       filtered = filtered.filter(p => p.location.toLowerCase().includes(locationFilter.toLowerCase()));
//     }
//     if (categoryFilter !== "All Categories") {
//       filtered = filtered.filter(p => p.category === categoryFilter);
//     }
//     setFilteredPetitions(filtered);
//   }, [locationFilter, categoryFilter, petitions]);

//   const categories = [
//     "All Categories", "Environment", "Infrastructure", "Education",
//     "Public Safety", "Transportation", "Healthcare",
//   ];

//   return (
//     <>
//       <div className="welcome-message">
//         <h1>Welcome Back!</h1>
//         <p>Discover what’s happening in your community and share your thoughts.</p>
//       </div>
//       <div className="stats-grid">
//         <div className="stat-card">
//           <h3>My Petitions</h3>
//           <h2>0</h2>
//           <p>petitions created</p>
//         </div>
//         <div className="stat-card">
//           <h3>Successful Petitions</h3>
//           <h2>0</h2>
//           <p>or under review</p>
//         </div>
//         <div className="stat-card">
//           <h3>Polls Created</h3>
//           <h2>0</h2>
//           <p>polls</p>
//         </div>
//       </div>
//       <div className="filters-container">
//         <div className="filter-controls">
//           <h2>Active Petitions Near You</h2>
//           <div className="location-filter">
//             <label htmlFor="location">Showing For:</label>
//             <input
//               type="text"
//               id="location"
//               placeholder="Location..."
//               className="location-input"
//               value={locationFilter}
//               onChange={e => setLocationFilter(e.target.value)}
//             />
//           </div>
//         </div>
//         <div className="category-buttons">
//           {categories.map(cat => (
//             <button
//               key={cat}
//               className={`category-btn ${categoryFilter === cat ? 'active' : ''}`}
//               onClick={() => setCategoryFilter(cat)}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>
//       </div>
//       {filteredPetitions.length === 0 ? (
//         <div className="no-petitions-found">
//           <p>No petitions found with the current filters.</p>
//           <button
//             className="clear-button"
//             onClick={() => {
//               setLocationFilter("");
//               setCategoryFilter("All Categories");
//             }}
//           >
//             Clear Filter
//           </button>
//         </div>
//       ) : (
//         <div className="petitions-list">
//           {filteredPetitions.map(petition => (
//             <div key={petition.id} className="petition-card">
//               <h3>{petition.title}</h3>
//               <p>{petition.description}</p>
//               <p><strong>Category:</strong> {petition.category}</p>
//               <p><strong>Location:</strong> {petition.location}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </>
//   );
// }

// export default DashboardHome;
