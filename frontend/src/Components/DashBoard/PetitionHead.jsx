import React, { useEffect, useState } from "react";
import { FaPlus, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../Landing/Footer";
import Navbar from "../Landing/Navbar";

const PetitionHead = () => {
  const navigate = useNavigate();
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [category, setCategory] = useState("All Categories");

  const handleTabChange = (tab) => setActiveTab(tab);
  const handleCategoryChange = (e) => setCategory(e.target.value);

  // Fetch all petitions
  const fetchPetitions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // JWT token
      const res = await fetch("http://localhost:4000/api/petitions", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch petitions");
      const data = await res.json();
      setPetitions(data);
    } catch (error) {
      console.error("Error fetching petitions:", error);
      setPetitions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetitions();
  }, []);

  // User id from localStorage
  const userId = localStorage.getItem("userId");

  // Filter petitions based on tab and category
  const filteredPetitions = petitions.filter((petition) => {
  if (activeTab === "mine") {
    return petition.ownerId?.toString() === userId;
  }

  if (activeTab === "signed") {
    if (!Array.isArray(petition.signedBy) || !userId) return false;
    return petition.signedBy.some((id) => id?.toString() === userId);
  }

  if (category !== "All Categories") {
    return petition.category === category;
  }

  return true;
});


  // Sign a petition
  const handleSign = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to sign a petition.");
        return;
      }

      const res = await fetch(
        `http://localhost:4000/api/petitions/${id}/sign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to sign petition");
      }

      const data = await res.json();

      // Update petition in state
      setPetitions((prev) =>
        prev.map((p) =>
          p._id === id
            ? {
                ...p,
                signatures: data.petition.signatures,
                status: data.petition.status,
                signedBy: data.petition.signedBy,
              }
            : p
        )
      );

      alert("Petition signed successfully!");
    } catch (error) {
      alert("Error signing petition: " + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4 my-5 ">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold">Petitions</h2>
          <button
            className="btn d-flex align-items-center text-white"
            style={{ backgroundColor: "#6EBBD1" }}
            onClick={() => navigate("/petition")}
          >
            <FaPlus className="me-2" /> Create Petition
          </button>
        </div>
        <p className="text-muted">
          Browse, sign, and track petitions in your community.
        </p>

        {/* Tabs and Category */}
        <div className="d-flex align-items-center mb-3">
          <div className="btn-group me-3">
            <button
              className={`btn btn-light fw-bold ${
                activeTab === "all" ? "shadow-sm" : ""
              }`}
              onClick={() => handleTabChange("all")}
            >
              All Petitions
            </button>
            <button
              className={`btn btn-light fw-bold ${
                activeTab === "mine" ? "shadow-sm" : ""
              }`}
              onClick={() => handleTabChange("mine")}
            >
              My Petitions
            </button>
            <button
              className={`btn btn-light fw-bold ${
                activeTab === "signed" ? "shadow-sm" : ""
              }`}
              onClick={() => handleTabChange("signed")}
            >
              Signed By Me
            </button>
          </div>
          <div>
            <span
              className="border rounded ms-2 p-2 bg-white d-flex align-items-center"
              style={{ boxShadow: "0 2px 8px rgba(100,100,100,0.07)" }}
            >
              <FaFilter className="me-2" />
              <select
                className="border-0 bg-transparent fw-semibold"
                style={{ minWidth: "180px", outline: "none" }}
                value={category}
                onChange={handleCategoryChange}
              >
                <option>All Categories</option>
                <option value="Environment">Environment</option>
                <option value="Transport">Transport</option>
                <option value="Education">Education</option>
                <option value="Health & Safety">Health & Safety</option>
                <option value="Local Government & Policy">
                  Local Government & Policy
                </option>
                <option value="Community & Social Issues">
                  Community & Social Issues
                </option>
                <option value="Infrastructure & Utilities">
                  Infrastructure & Utilities
                </option>
                <option value="Public Services">Public Services</option>
                <option value="Animal Welfare">Animal Welfare</option>
              </select>
            </span>
          </div>
        </div>

        {/* Petition List */}
        <div className="bg-white p-4 rounded shadow-sm mb-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading petitions...</p>
            </div>
          ) : (
            <div className="row g-3">
              {filteredPetitions.length === 0 ? (
                <div className="col-12">
                  <div className="text-center py-5">
                    <p>No petitions found.</p>
                  </div>
                </div>
              ) : (
                filteredPetitions.map((petition) => (
                  <div className="col-md-6" key={petition._id}>
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="card-title">{petition.title}</h5>
                          <span className="small text-info fw-bold">
                            {petition.category}
                          </span>
                        </div>
                        <p className="card-text text-truncate">
                          {petition.description}
                        </p>
                        <p className="small mb-1">
                          <strong>{petition.signatures?.length || 0}</strong> of{" "}
                          {petition.signatureGoal} signatures{" "}
                          <span className="text-success">{petition.status}</span>
                        </p>
                        <div className="progress mb-3" style={{ height: "6px" }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${Math.min(
                                ((petition.signatures?.length || 0) /
                                  (petition.signatureGoal || 1)) *
                                  100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-outline-primary btn-sm fw-bold"
                            onClick={() => navigate(`/petition/${petition._id}`)}
                          >
                            View Details
                          </button>
                          <button
                            className="btn btn-success btn-sm fw-bold"
                            disabled={petition.status === "closed"}
                            onClick={() => handleSign(petition._id)}
                          >
                            Sign Petition
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PetitionHead;
