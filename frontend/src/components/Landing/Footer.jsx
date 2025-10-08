import React from 'react';
import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={`${styles.footer} ${styles.textCenter} ${styles.foot} ${styles.mb0}`}>
      <div className={styles.container}>
            <h4>About Civix</h4>
            <p>
              Civix empowers citizens to actively engage in local governance through petitions, polls,
              and public feedback. Our mission is to create transparent and accountable communities by
              giving everyone a voice.
            </p>
        
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