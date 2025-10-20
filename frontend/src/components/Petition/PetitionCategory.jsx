import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Landing/Navbar";
import Footer from "../Landing/Footer";


const CategoryPetitions = () => {
  const { category } = useParams();
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:4000/api/petitions?category=${category}`)
      .then(res => res.json())
      .then(data => setPetitions(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <>
      <Navbar />
      <div className="container my-5 ">
        <h3 className="fw-bold mb-4">{category} Petitions</h3>
        {loading ? (
          <p>Loading petitions...</p>
        ) : petitions.length === 0 ? (
          <p>No petitions found in this category.</p>
        ) : (
          <div className="row g-3">
            {petitions.map(p => (
              <div className="col-md-6" key={p.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5>{p.title}</h5>
                    <p className="text-truncate">{p.description}</p>
                    <p className="small">
                      <strong>{p.signatures}</strong> of {p.goal} signatures
                    </p>
                    <a href={`/petition/${p.id}`} className="small text-primary fw-bold">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPetitions;