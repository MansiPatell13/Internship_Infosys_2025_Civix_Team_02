import React from 'react'
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
         <nav className="navbar navbar-expand-lg custom-navbar shadow-sm left">
                  <div className="container">
                    <Link className="navbar-brand fw-bold" to="/home">
                      Civix
                    </Link>
        
                    <div className="collapse navbar-collapse">
                      <ul className="navbar-nav mx-auto">
                        <li className="nav-item mx-3">
                          <Link className="nav-link active" to="/home">
                            Home
                          </Link>
                        </li>
                        <li className="nav-item mx-3">
                          <Link className="nav-link active" to="/petition-head">
                            Petition
                          </Link>
                        </li>
                        <li className="nav-item mx-3">
                          <Link className="nav-link active" to="/poll">
                            Poll
                          </Link>
                        </li>
                        <li className="nav-item mx-3">
                          <Link className="nav-link active" to="/dashboard">
                            Dashboard
                          </Link>
                        </li>
                      </ul>
                    </div>
        
                    {/* Buttons */}
                    <div className="d-flex enter">
                      <Link to="/login" className="btn  me-2 text-dark">
                        Log In
                      </Link>
                      <Link to="/signup" className="btn btn-success rounded-pill px-3" style={{backgroundColor: '#000000'}}>
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </nav>
    </div>
  )
}

export default Navbar