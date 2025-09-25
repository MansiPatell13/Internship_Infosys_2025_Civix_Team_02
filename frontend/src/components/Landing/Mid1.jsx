import React from "react";
import { FaLandmark, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./Mid1.module.css";

const Mid1 = () => {
  return (
    <section className={styles.py5}>
      {/* <div className={styles.container}> */}
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Who Are You?</h2>
          <p className={styles.sectionSubtitle}>
            Join our platform as a citizen to voice your concerns or as a public official to engage with your community
          </p>
        </div>

        <div className={`${styles.row} ${styles.justifyContentCenter}`}>
          {/* Citizen Section */}
          <div className={`${styles.colMd5} ${styles.mb4} ${styles.sectionBox}`}>
            <div className={`${styles.iconWrapper} ${styles.citizenIcon} ${styles.mb3}`}>
              <FaUser size={40} />
            </div>
            <h4 className={styles.title}>Are you a Citizen?</h4>
            <ul className={`${styles.listUnstyled} ${styles.mt3} ${styles.textStart} ${styles.dInlineBlock}`}>
              <li>Create petitions to raise your concerns</li>
              <li>Start polls on issues that matter to your community</li>
              <li>Support and sign petitions started by others</li>
              <li>Share your opinion and make your voice count</li>
              <li>Connect with others who care about the same issues</li>
            </ul>
            <div className={styles.mtAuto}>
              <Link to="/signup" className={`${styles.btn} ${styles.btnPrimary}`}>
                🚀 Join as Citizen
              </Link>
            </div>
          </div>

          {/* Public Official Section */}
          <div className={`${styles.colMd5} ${styles.mb4} ${styles.sectionBox}`}>
            <div className={`${styles.iconWrapper} ${styles.officialIcon} ${styles.mb3}`}>
              <FaLandmark size={40} />
            </div>
            <h4 className={styles.title}>Are you a Public Official?</h4>
            <ul className={`${styles.listUnstyled} ${styles.mt3} ${styles.textStart} ${styles.dInlineBlock}`}>
              <li>View petitions and polls created by citizens</li>
              <li>Respond to public concerns with transparency</li>
              <li>Take action on the most pressing issues</li>
              <li>Build trust by engaging directly with the community</li>
              <li>Show updates and mark tasks as completed</li>
            </ul>
            <div className={styles.mtAuto}>
              <Link to="/signup" className={`${styles.btn} ${styles.btnSuccess}`}>
                🏛️ Join as Official
              </Link>
            </div>
          </div>
        </div>
      {/* </div> */}
    </section>
  );
};

export default Mid1;