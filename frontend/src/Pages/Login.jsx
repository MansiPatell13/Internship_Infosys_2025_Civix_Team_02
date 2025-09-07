import React from "react";
import img from "/img.jpg";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Landing/Navbar";
import Footer from "../Components/Landing/Footer";

const Login = () => {
    const navigate = useNavigate(); 

  return (
    <>
    <Navbar/>
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* left */}
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center p-5">
          <div className="">
            <h1 className="fw-bold text-center">
              WELCOME <span className="text-success">BACK</span>
            </h1>
            <p className="text-muted text-center">
              Join our platform to make your voice heard
            </p>
          </div>

          <div className="btn-group w-50 d-flex flex-colum mb-3">
            <button className="btn btn-outline-grey active">Log In</button>
            <button className="btn btn-outline-dark" onClick={() => {navigate("/signup")}}>Sign Up</button>
          </div>

          <button className="btn btn-outline-secondary border-black w-50 d-flex flex-colum mb-3 d-flex align-items-center justify-content-center">
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="google"
              style={{ width: "20px", marginRight: "10px" }}
            />
            Login with Google
          </button>

          <div className="d-flex align-items-center mb-3 w-50 d-flex flex-colum">
            <hr className="flex-grow-1" />
            <span className="px-2 text-muted">Or</span>
            <hr className="flex-grow-1" />
          </div>


            <div className="input-group mb-3 w-50 ">
              <label className="form-label mb-3">Email</label>
              <input
                type="email"
                placeholder="your@mail.com"
                className="form-control border-black w-100"
                required
              />
            </div>

            <div className="input-group mb-3 w-50 ">
              <label className="form-label mb-3">Password</label>
              <input
                type="password"
                placeholder="********"
                className="form-control border-black w-100"
                required
              />
            </div>
            <p className="text-muted text-center mt-3">
            Forget Password? <a href="#" onClick={() => {navigate("/forget-password")}}>Click here</a>
          </p>

            <div className="form-check mb-3 ">
              <input
                className="form-check-input border-black"
                type="checkbox"
                value=""
                id="flexCheckDefault"
              />
              <label className="form-check-label " htmlFor="flexCheckDefault">
                Remember Me
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-success w-50 d-flex flex-column"
            >
              Log In
            </button>
            
          <p className="text-muted text-center mt-3">
            Don’t have an account? <a href="#" onClick={() => {navigate("/signup")}}>Register here</a>
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

export default Login;
