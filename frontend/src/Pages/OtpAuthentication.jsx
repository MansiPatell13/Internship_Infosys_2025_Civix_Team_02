import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import img from "/img.jpg";
import Navbar from "../Components/Landing/Navbar";
import Footer from "../Components/Landing/Footer";
import { useNavigate } from "react-router-dom";

const OtpAuthentication = () => {
  const navigate = useNavigate
  return (
    <>
    <Navbar/>
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* left */}
        <div className="col-md-6 d-flex flex-column justify-content-center p-5">
          <div className="">
            <h1 className="fw-bold text-center">
              VERIFY <span className="text-success">YOUR</span> EMAIL
            </h1>
            <p className="text-muted text-center">
              Enter the 6 digit code that you have received on your email
            </p>
          </div>
          <form className="mx-auto mt-4" style={{ maxWidth: "400px" }}>
            <div className="mb-3 d-flex">
              <div className="col-md-1">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="form-control border-black mx-1"
                  required
                />
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-1">
                <input
                  type="text"
                  className="form-control border-black mx-1"
                  required
                />
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-1">
                <input
                  type="text"
                  className="form-control border-black mx-1"
                  required
                />
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-1">
                <input
                  type="text"
                  className="form-control border-black mx-1"
                  required
                />
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-1">
                <input
                  type="text"
                  className="form-control border-black mx-1"
                  required
                />
              </div>
              <div className="col-md-1"></div>
              <div className="col-md-1">
                <input
                  type="text"
                  className="form-control border-black mx-1"
                  required
                />
              </div>
              <div className="col-md-1"></div>
            </div>

            <button type="submit" className="btn btn-success w-100" onClick={() => {navigate("/reset-password")}}>
              Continue
            </button>
          </form>
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

export default OtpAuthentication;
