import React from 'react';
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={`${styles.footer} ${styles.textCenter} ${styles.foot} ${styles.mb0}`}>
      <div className={styles.container}>
        <div className={styles.footerContainer}>
          <div className={styles.footerSection}>
            <h4>About Civix</h4>
            <p>
              Civix empowers citizens to actively engage in local governance through petitions, polls,
              and public feedback. Our mission is to create transparent and accountable communities by
              giving everyone a voice.
            </p>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <Link to="/" className={styles.footerLink}>Home</Link>
            <Link to="/petition-head" className={styles.footerLink}>Petitions</Link>
            <Link to="/poll-head" className={styles.footerLink}>Polls</Link>
            <Link to="/reports" className={styles.footerLink}>Reports</Link>
            <Link to="/settings" className={styles.footerLink}>Settings</Link>
            <Link to="/help" className={styles.footerLink}>Help & Support</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.tagline}>
            <em>"Your voice, your power"</em>
          </p>
          <p className={styles.copyright}>© 2025 Civix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;