import React from "react";
import img from "/issues.jpg";
import styles from "./Mid2.module.css";

const Mid2 = () => {
  const issueCategories = [
    "Agriculture And Food",
    "Animals And Wildlife",
    "Art, Culture And History",
    "Business And Consumers",
    "Communication",
    "Civil Liberties And Rights",
    "Criminal Law & Justice",
    "Cyber Security",
    "Defence",
    "Education",
    "Power & Energy",
    "Environment",
    "Family And Children",
    "Foreign Affairs",
    "Women Empowerment",
    "Health And Health Care",
    "Higher Education",
    "Infrastructure",
    "Labour And Employment",
    "Rural Development",
    "National Security",
    "Police Brutality",
    "Religious Freedom",
    "Role Of Government",
    "Senior Citizens",
    "Finance & Taxes",
    "Science & Technology",
    "Social Development",
    "Poverty",
    "Transportation",
    "Veterans",
    "Wealth Inequality",
    "Travel & Tourism",
    "Youth & Sports",
    "Water",
    "Corruption",
    "Information And Broadcasting",
    "Economy",
    "Housing & Property",
    "Immigration",
    "Lgbt Rights",
    "Reservation",
    "Make In India",
  ];
  return (
    <section className={styles.py5}>
      <div className={styles.container}>
        <div className={`${styles.row} ${styles.textCenter} ${styles.justifyContentCenter}`}>
          {/* left */}
          <div className={styles.colMd6}>
            <img
              src={img}
              alt="img"
              className={`${styles.imgFluid} ${styles.rounded} ${styles.coverImage}`}
            />
          </div>

          {/* right */}
          <div className={styles.colMd6}>
            <div className={`${styles.dFlex} ${styles.flexWrap} ${styles.gap2} ${styles.mb4} ${styles.mt4}`}>
              {issueCategories.map((category, index) => (
                <button
                  key={index}
                  className={`${styles.btn} ${styles.btnOutlineSecondary} ${styles.btnSm} ${styles.px3} ${styles.tagButton}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mid2;