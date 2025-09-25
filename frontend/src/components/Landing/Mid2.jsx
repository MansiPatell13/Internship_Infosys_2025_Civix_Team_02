import React from "react";
import img from "/issues.jpg";
import styles from "./Mid2.module.css";

const Mid2 = () => {
  const issueCategories = [
    "Agriculture And Food",
    "Animals And Wildlife",
    "Communication",
    "Civil Liberties And Rights",
    "Criminal Law & Justice",
    "Defence",
    "Education",
    "Environment",
    "Women Empowerment",
    "Health And Health Care",
    "Infrastructure",
    "Rural Development",
    "National Security",
    "Role Of Government",
    "Finance & Taxes",
    "Science & Technology",
    "Transportation",
    "Water",
    "Corruption"
  ];

  return (
    <section className={styles.py5}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Issue Categories</h2>
          <p className={styles.sectionSubtitle}>
            Explore the wide range of topics you can create petitions and polls about. 
            From local community issues to national policies, your voice matters on every subject.
          </p>
        </div>

        <div className={`${styles.row} ${styles.justifyContentCenter}`}>
          {/* Image Section */}
          <div className={styles.colMd6}>
            <div className={styles.imageContainer}>
              <img
                src={img}
                alt="Community Issues Illustration"
                className={`${styles.imgFluid} ${styles.rounded} ${styles.coverImage}`}
              />
            </div>
          </div>

          {/* Tags Section */}
          <div className={styles.colMd6}>
            <div className={styles.tagsContainer}>
              <h3 className={styles.tagsTitle}>Popular Categories</h3>
              <div className={`${styles.dFlex} ${styles.flexWrap} ${styles.gap2} ${styles.mb4} ${styles.mt4}`}>
                {issueCategories.map((category, index) => (
                  <button
                    key={index}
                    className={`${styles.btn} ${styles.btnSm} ${styles.tagButton}`}
                    onClick={() => {
                      // Add functionality to filter by category
                      console.log(`Selected category: ${category}`);
                    }}
                  >
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mid2;