import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = ({ scrollToFooter }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state to track login status

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token"); // Check for the token

    if (storedUser && token) {
      try {
        // Only set user if both the user object and the token exist
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (e) {
        // If user data is corrupted but token is there, treat as logged out for safety
        console.error("Error parsing user data from localStorage:", e);
        setIsLoggedIn(false);
      }
    } else {
      // If no token or no user data, the user is not logged in
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []); // Empty dependency array means this runs only on mount

  // Removed handleLogout function as requested

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (scrollToFooter) {
      scrollToFooter();
    } else {
      // If scrollToFooter function is not available, scroll to footer element directly
      const footerElement = document.querySelector('footer');
      if (footerElement) {
        footerElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
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
                <a
                  href="#"
                  onClick={handleAboutClick}
                  className={styles.navLink}
                >
                  About
                </a>
              </li>
              {/* <li className={styles.navbarLinkItem}>
                <NavLink
                  to="/poll-creation"
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                >
                  Feature
                </NavLink>
              </li> */}
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
            {isLoggedIn && user ? (
              <>
                <span
                  className={`${styles.userGreeting} ${styles.me3} ${styles.fwBold}`}
                >
                  Hi, {user.name}
                </span>
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