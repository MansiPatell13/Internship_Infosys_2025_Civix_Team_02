import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import img from "/img.jpg";
import { useNavigate, Link } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
  return (
    <>
    <div className="container-fluid vh-100">
        <div className="row h-100">
        {/* left */}
        <div className="col-md-6 d-flex flex-column justify-content-center p-5">
          <div className="">
            <h1 className="fw-bold text-center">
              FORGET <span className="text-success">PASSWORD</span>
            </h1>
            <p className="text-muted text-center">
              Please write your email to receive a confirmation code to set a
              new password.
            </p>
          </div>
          <form className="mx-auto mt-4" style={{ maxWidth: "800px" }}>
            <div className="mb-3">
              <label className="form-label mb-3">Email</label>
              <input
                type="email"
                placeholder="your@mail.com"
                className="form-control border-black w-100"
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100" onClick={() => {navigate("/otp")}}>
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
    </>
  );
};

export default ForgetPassword;
