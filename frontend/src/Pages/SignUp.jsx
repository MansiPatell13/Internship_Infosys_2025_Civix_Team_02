import React from "react";
import img from "/img.jpg";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Landing/Navbar";
import Footer from "../Components/Landing/Footer";


const SignUp = () => {
    
  const navigate = useNavigate(); 
  return (
    <>
    <Navbar/>
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* left */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center p-4">
          <div className="">
            <h1 className="fw-bold text-center">
              WELCOME <span className="text-success">BACK</span>
            </h1>
            <p className="text-muted text-center">
              Join our platform to make your voice heard
            </p>
          </div>

          <div className="btn-group w-50 d-flex flex-colum mb-2">
            <button className="btn btn-outline-dark" onClick={() => navigate("/login")} >Log In</button>
            <button className="btn btn-outline-white active">Sign Up</button>
          </div>

          <div className="input-group mb-2 w-50 ">
            <label className="form-label mb-2">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="form-control border-black w-100"
              required
            />
          </div>

          <div className="input-group mb-2 w-50 ">
            <label className="form-label mb-2">Email</label>
            <input
              type="email"
              placeholder="your@mail.com"
              className="form-control border-black w-100"
              required
            />
          </div>

          <div className="input-group mb-2 w-50 ">
            <label className="form-label mb-2">Password</label>
            <input
              type="password"
              placeholder="********"
              className="form-control border-black w-100"
              required
            />
          </div>

          <div className="input-group mb-2 w-50 ">
            <label className="form-label mb-2">Location</label>
            <input
              type="location"
              placeholder="Delhi"
              className="form-control border-black w-100"
              required
            />
          </div>

          <div className="w-50 text-start mt-2">
            <div className="mb-2">I am registering as:</div>

            <div className="form-check mb-2">
              <input
                className="form-check-input border-black"
                type="radio"
                name="flexRadioDefault"
                id="citizen"
              />
              <label className="form-check-label" htmlFor="citizen">
                Citizen
              </label>
            </div>

            <div className="form-check mb-2">
              <input
                className="form-check-input border-black"
                type="radio"
                name="flexRadioDefault"
                id="official"
              />
              <label className="form-check-label" htmlFor="official">
                Public Official
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success w-50 d-flex flex-column"
          >
            Sign Up
          </button>

          <p className="text-muted text-center mt-2">
            Already have an account? <a href="#" onClick={() => {navigate("/login")}}>Login</a>
          </p>
        </div>

        {/* right */}
        <div className="col-md-6 p-0 h-100">
          <img
            src={img}
            alt="img"
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default SignUp;
