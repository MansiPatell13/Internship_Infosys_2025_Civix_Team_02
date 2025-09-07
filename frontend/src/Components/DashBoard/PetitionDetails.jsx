import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Landing/Navbar";
import Footer from "../Landing/Footer";

const PetitionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [petition, setPetition] = useState(null);

  useEffect(() => {
    const fetchPetition = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/petitions/${id}`);
        if (!res.ok) throw new Error("Failed to fetch petition");
        const data = await res.json();
        setPetition(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPetition();
  }, [id]);

  const handleSign = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/petitions/${id}/sign`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to sign petition");
      const data = await res.json();
      setPetition(data.petition);
    } catch (err) {
      console.error(err);
    }
  };

  if (!petition) return <p className="text-center mt-5">Loading petition...</p>;

  return (
    <>
      <Navbar />
      <div className="container my-5 ">
        <button className="btn btn-light mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="card shadow-sm">
          {petition.image && (
            <img
              src={`http://localhost:4000${petition.image}`}
              alt="Petition"
              className="card-img-top"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
          )}
          <div className="card-body">
            <h2 className="card-title">{petition.title}</h2>
            <p><strong>Category:</strong> {petition.category}</p>
            <p><strong>Location:</strong> {petition.location}</p>
            <p>{petition.description}</p>
            <p className="small mb-1">
                          <strong>{petition.signatures?.length || 0}</strong> of{" "}
                          {petition.signatureGoal} signatures{" "}
                          <span className="text-success">{petition.status}</span>
                        </p>

            <div className="progress mb-3" style={{ height: "8px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${(petition.signatures / petition.goal) * 100}%` }}
              ></div>
            </div>

            <button className="btn btn-success" onClick={handleSign}>
              Sign Petition
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PetitionDetails;
