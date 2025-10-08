import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = ({ scrollToFooter }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
        setIsLoggedIn(false);
      }
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  }, []);

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (scrollToFooter) {
      scrollToFooter();
    } else {
      const footerElement = document.querySelector("footer");
      if (footerElement)
        footerElement.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={`${styles.navbarContainer} ${styles.shadow} ${styles.left}`}>
      <div className={styles.navbarContent}>
        <NavLink to="/home" className={`${styles.navbarLogo} ${styles.fwBold}`} onClick={closeMenu}>
          Civix
        </NavLink>

        <div className={styles.navbarLinksWrapper + " " + (menuOpen ? styles.showMenu : "")}>
          <ul className={styles.navbarLinksList}>
            <li className={styles.navbarLinkItem}>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                onClick={closeMenu}
              >
                Home
              </NavLink>
            </li>
            <li className={styles.navbarLinkItem}>
              <a href="#about" onClick={handleAboutClick} className={styles.navLink}>
                About
              </a>
            </li>
            <li className={styles.navbarLinkItem}>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
            </li>
          </ul>

        </div>

        <div className={styles.navbarButtonsWrapper}>
          {isLoggedIn && user ? (
            <span className={`${styles.userGreeting} ${styles.me3} ${styles.fwBold}`}>
              Hi, {user.name}
            </span>
          ) : null}
          {!isLoggedIn ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? `${styles.button} ${styles.active}` : styles.button
                }
                onClick={closeMenu}
              >
                Log In
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  isActive ? `${styles.button} ${styles.successButton} ${styles.active}` : `${styles.button} ${styles.successButton}`
                }
                onClick={closeMenu}
              >
                Sign Up
              </NavLink>
            </>
          ) : null}
        </div>

        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={menuOpen ? styles.barActive : styles.bar}></span>
          <span className={menuOpen ? styles.barActive : styles.bar}></span>
          <span className={menuOpen ? styles.barActive : styles.bar}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
