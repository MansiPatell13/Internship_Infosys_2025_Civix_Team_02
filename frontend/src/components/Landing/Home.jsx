import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Mid1 from "./Mid1";
import Navbar from "./Navbar";
import Mid2 from "./Mid2";
import { FaHouse } from "react-icons/fa6";
import Footer from "./Footer";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  return (
      <div className={styles.u}>

       <Navbar/>
       
       <section className={`${styles.heroSection} ${styles.py5}`}>
         <div className={styles.container}>
           <div className={`${styles.row} ${styles.alignItemsCenter}`}>
             {/* left */}
             <div className={`${styles.colMd6} `}>
               <h1 className={styles.mb3}>Your Voice, Your Community</h1>
               <p className={styles.mb3}>
                 Connect with your local government, Create impactful petition,
                 participate in meaningful polls and drive real change in your
                 community through democratic engagement.
               </p>
               <div className={styles.mt3}>
                 <button
                   className={`${styles.btn} ${styles.btnSuccess} ${styles.btnLg} ${styles.me3} ${styles.mb2} ${styles.borderBlack}`}
                   onClick={() => navigate("/signup")}
                 >
                   Get Started
                 </button>
                 <button className={`${styles.btn} ${styles.btnLight} ${styles.btnLg} ${styles.mb2} ${styles.borderBlack}`}>
                   Learn More
                 </button>
               </div>
             </div>

             {/* right */}
             <div className={`${styles.colMd6} ${styles.mt2}`}>
               <div 
                 className={`${styles.textCenter} ${styles.p5} ${styles.rounded} `}
                 style={{
                   backgroundColor: '#8FA31E',
                   color: 'white',
                   minHeight: '400px',
                   display: 'flex',
                   flexDirection: 'column',
                   justifyContent: 'center'
                 }}
               >
                 <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏛️</div>
                 <h3>Civic Engagement</h3>
                 <p>Empowering citizens to participate in democracy.</p>

                 <div className={`${styles.row} ${styles.mt4}`}>
                   <div className={styles.col4}>
                     <h4>1000+</h4>
                     <small>Users</small>
                   </div>
                   <div className={styles.col4}>
                       <h4>500+</h4>
                       <small>Petitions</small>
                   </div>
                   <div className={styles.col4}>
                     <h4>50+</h4>
                     <small>Polls</small>
                   </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </section>

         <section className={styles.sec2}>
           <Mid1 />
         </section>

         <section>
           <Mid2/>
         </section>

         <Footer/>
       </div>
  );
};

export default Home;