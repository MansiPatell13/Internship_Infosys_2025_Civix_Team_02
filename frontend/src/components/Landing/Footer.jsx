import React from 'react';
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={`${styles.footer} ${styles.textCenter} ${styles.foot} ${styles.mb0}`}>
      <div className={styles.container}>
        <p className={styles.tagline}>
          <em>"Your voice, your power"</em>
        </p>
        <p className={styles.copyright}>Copyright &copy; 2025. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;