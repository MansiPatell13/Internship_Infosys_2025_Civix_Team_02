import React from "react";
import { FaLandmark, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./Mid1.module.css";

const Mid1 = () => {
  return (
    <section className={styles.py5}>
      <div className={styles.container}>
        <div className={`${styles.row} ${styles.textCenter} ${styles.justifyContentCenter}`}>
          {/* citizen */}
          <div className={`${styles.colMd5} ${styles.mb4} ${styles.sectionBox}`}>
            <FaUser size={50} className={`${styles.textPrimary} ${styles.mb3}`} />
            <h4 className={styles.title}>Are you a Citizen?</h4>
            <ul className={`${styles.listUnstyled} ${styles.mt3} ${styles.textStart} ${styles.dInlineBlock}`}>
              <li>✔ Create petition to raise your concerns.</li>
              <li>✔ Start polls on issues that matter to your community.</li>
              <li>✔ Support and sign petitions started by others.</li>
              <li>✔ Share your opinion and make your voice count.</li>
              <li>✔ Connect with others who care about the same issues.</li>
            </ul>
            <div className={styles.mtAuto}>
              <Link to="/signup" className={`${styles.btn} ${styles.btnPrimary}`}>
                Join Now
              </Link>
            </div>
          </div>

          {/* Official */}
          <div className={`${styles.colMd5} ${styles.mb4} ${styles.sectionBox}`}>
            <FaLandmark size={50} className={`${styles.textSuccess} ${styles.mb3}`} />
            <h4 className={styles.title}>Are you a Public Official?</h4>
            <ul className={`${styles.listUnstyled} ${styles.mt3} ${styles.textStart} ${styles.dInlineBlock}`}>
              <li>✔ View petitions and polls created by citizens.</li>
              <li>✔ Respond to public concerns with transparency.</li>
              <li>✔ Take action on the most pressing issues.</li>
              <li>✔ Build trust by engaging directly with the community.</li>
              <li>✔ Show updates and mark tasks as completed.</li>
            </ul>
            <div className={styles.mtAuto}>
              <Link to="/signup" className={`${styles.btn} ${styles.btnSuccess}`}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mid1;