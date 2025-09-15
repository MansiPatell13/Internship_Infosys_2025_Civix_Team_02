// import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import styles from "./Navbar.module.css"; // Import the CSS Module

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     setUser(null);
//     navigate("/login");
//   };

//   return (
//     <div>
//       <nav className={`${styles.navbarContainer} ${styles.shadow} ${styles.left}`}>
//         <div className={styles.navbarContent}>
//           <Link className={`${styles.navbarLogo} ${styles.fwBold}`} to="/home">
//             Civix
//           </Link>

//           <div className={styles.navbarLinksWrapper}>
//             <ul className={styles.navbarLinksList}>
//               <li className={styles.navbarLinkItem}>
//                 <Link className={`${styles.navLink} ${styles.active}`} to="/home">
//                   Home
//                 </Link>
//               </li>
//               <li className={styles.navbarLinkItem}>
//                 <Link className={styles.navLink} to="/petition-head">
//                   Petition
//                 </Link>
//               </li>
//               <li className={styles.navbarLinkItem}>
//                 <Link className={styles.navLink} to="/poll">
//                   Poll
//                 </Link>
//               </li>
//               <li className={styles.navbarLinkItem}>
//                 <Link className={styles.navLink} to="/dashboard">
//                   Dashboard
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div className={`${styles.navbarButtonsWrapper} ${styles.enter}`}>
//             {user ? (
//               <>
//                 <span className={`${styles.userGreeting} ${styles.me3} ${styles.fwBold}`}>Hi, {user.name}</span>
//                 <button
//                   onClick={handleLogout}
//                   className={`${styles.button} ${styles.dangerButton} ${styles.roundedPill} ${styles.px3}`}
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/login" className={`${styles.button} ${styles.me2} ${styles.textDark}`}>
//                   Log In
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className={`${styles.button} ${styles.successButton} ${styles.roundedPill} ${styles.px3}`}
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default Navbar;


import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom"; // ✅ use NavLink
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div>
      <nav className={`${styles.navbarContainer} ${styles.shadow} ${styles.left}`}>
        <div className={styles.navbarContent}>
          <NavLink className={`${styles.navbarLogo} ${styles.fwBold}`} to="/home">
            Civix
          </NavLink>

          <div className={styles.navbarLinksWrapper}>
            <ul className={styles.navbarLinksList}>
              <li className={styles.navbarLinkItem}>
                <NavLink
                  to="/home"
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                >
                  Home
                </NavLink>
              </li>
              <li className={styles.navbarLinkItem}>
                <NavLink
                  to="/petition-head"
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                >
                  Petition
                </NavLink>
              </li>
              <li className={styles.navbarLinkItem}>
                <NavLink
                  to="/poll"
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                >
                  Poll
                </NavLink>
              </li>
              <li className={styles.navbarLinkItem}>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                >
                  Dashboard
                </NavLink>
              </li>
            </ul>
          </div>

          <div className={`${styles.navbarButtonsWrapper} ${styles.enter}`}>
            {user ? (
              <>
                <span
                  className={`${styles.userGreeting} ${styles.me3} ${styles.fwBold}`}
                >
                  Hi, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className={`${styles.button} ${styles.dangerButton} ${styles.roundedPill} ${styles.px3}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? `${styles.button} ${styles.active}` : styles.button
                  }
                >
                  Log In
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive
                      ? `${styles.button} ${styles.successButton} ${styles.active}`
                      : `${styles.button} ${styles.successButton}`
                  }
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
