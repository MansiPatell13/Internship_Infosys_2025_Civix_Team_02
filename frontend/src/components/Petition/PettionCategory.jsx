
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Landing/Navbar";
import Footer from "../Landing/Footer";
import styles from "./PetitionCategory.module.css";


const PetitionCategory = () => {
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
      <div className={styles.container}>
        <h3 className={styles.title}>{category} Petitions</h3>
        {loading ? (
          <p>Loading petitions...</p>
        ) : petitions.length === 0 ? (
          <p>No petitions found in this category.</p>
        ) : (
          <div className={styles.grid}>
            {petitions.map(p => (
              <div className={styles.col} key={p.id}>
                <div className={styles.card}>
                  <div className={styles.cardBody}>
                    <h5>{p.title}</h5>
                    <p className={styles.description}>{p.description}</p>
                    <p className={styles.signatures}>
                      <strong>{p.signatures}</strong> of {p.goal} signatures
                    </p>
                    <a href={`/petition/${p.id}`} className={styles.detailsLink}>
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

export default PetitionCategory;