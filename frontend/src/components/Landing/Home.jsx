import React from "react";
import { useNavigate } from "react-router-dom";
import Mid1 from "./Mid1";
import Navbar from "./Navbar";
import Mid2 from "./Mid2";
import Footer from "./Footer";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Navbar />
      
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={`${styles.row} ${styles.alignItemsCenter}`}>
            {/* Left Content */}
            <div className={`${styles.colMd6} ${styles.heroContent}`}>
              <div className={styles.fadeInUp}>
                <h1 className={styles.heroTitle}>
                  Your Voice, Your Community
                </h1>
                <p className={styles.heroDescription}>
                  Connect with your local government, create impactful petitions, 
                  participate in meaningful polls and drive real change in your 
                  community through democratic engagement.
                </p>
                <div className={styles.heroButtons}>
                  <button
                    className={`${styles.ctaButton} ${styles.ctaPrimary}`}
                    onClick={() => navigate("/signup")}
                  >
                    🚀 Get Started
                  </button>
                  <button 
                    className={`${styles.ctaButton} ${styles.ctaSecondary}`}
                    onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  >
                    📚 Learn More
                  </button>
                </div>
              </div>
            </div>

            <div className={`${styles.colMd6} ${styles.mt2}`}>
              <div className={styles.heroCard}>
                <div className={styles.heroIcon}>🏛️</div>
                <h3 className={styles.heroCardTitle}>Civic Engagement</h3>
                <p className={styles.heroCardSubtitle}>
                  Empowering citizens to participate in democracy and make their voices heard.
                </p>
                
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>1000+</span>
                    <div className={styles.statLabel}>Active Users</div>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>500+</span>
                    <div className={styles.statLabel}>Petitions</div>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statNumber}>50+</span>
                    <div className={styles.statLabel}>Live Polls</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className={`${styles.section} ${styles.sectionGray}`}>
        <Mid1 />
      </section>

      <section className={`${styles.section} ${styles.sectionWhite}`}>
        <Mid2 />
      </section>

      <Footer />
    </>
  );
};

export default Home;