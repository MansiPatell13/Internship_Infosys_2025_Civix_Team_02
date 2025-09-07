import React, { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../Landing/Footer";
import Navbar from "../Landing/Navbar";

const PetitionPage = () => {
  const navigate = useNavigate();

  const [petition, setPetition] = useState({
    title: "",
    category: "",
    location: "",
    goal: 100,
    description: "",
    image: null, // store the actual File instead of base64
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPetition({ ...petition, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPetition({ ...petition, image: file });
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a petition.");
        return;
      }

      // Validation
      if (!petition.title || !petition.description || !petition.location) {
        alert("Please fill in title, description, and location.");
        return;
      }

      // Build FormData for text + file
      const formData = new FormData();
      formData.append("title", petition.title);
      formData.append("description", petition.description);
      formData.append("category", petition.category);
      formData.append("location", petition.location);
      formData.append("signatureGoal", petition.goal);
      if (petition.image) {
        formData.append("image", petition.image);
      }

      const res = await fetch("http://localhost:4000/api/petitions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // DO NOT set Content-Type with FormData
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create petition");
      }

      const data = await res.json();
      console.log("✅ Petition created:", data);

      alert("Petition created successfully!");
      navigate("/petition-head"); // redirect to petition list
    } catch (error) {
      console.error("❌ Error creating petition:", error);
      alert("Error creating petition: " + error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <button className="btn btn-light mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="card p-4 shadow">
          <div className="row mb-4 align-items-center">
            <div className="col">
              <h1 className="fw-bold">Petition Creation</h1>
            </div>
            <div className="col text-end">
              <h4 className="text-success">Civix</h4>
            </div>
          </div>

          <div className="mb-4 text-success fw-semibold">
            <FaPencilAlt className="me-2" />
            Create a new petition
          </div>

          {/* Title */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              Poll Question <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Give a title to your Petition"
              name="title"
              value={petition.title}
              onChange={handleChange}
              required
            />
            <small className="text-muted">
              Clearly define what change you want to see
            </small>
          </div>

          {/* Category + Location */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Category</label>
              <select
                className="form-select"
                name="category"
                value={petition.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
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
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Location <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search location"
                name="location"
                value={petition.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Goal */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Signature Goal</label>
              <input
                type="number"
                className="form-control"
                placeholder="100"
                name="goal"
                value={petition.goal}
                onChange={handleChange}
              />
              <small className="text-muted">
                How many signatures you want to collect?
              </small>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="form-label fw-bold">
              Description <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Describe the issue and change you would like to see..."
              name="description"
              value={petition.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>


          {/* Publish button */}
          <div className="d-flex justify-content-between">
            <button className="btn btn-success" onClick={handlePublish}>
              Publish
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PetitionPage;
