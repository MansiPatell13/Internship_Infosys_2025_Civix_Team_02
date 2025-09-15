import React from "react";
import { FaLandmark, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Mid1 = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row text-center justify-content-center">
          {/* citizen */}
          <div className="col-md-5 mb-4">
            <FaUser size={50} className="text-primary mb-3" />
            <h4>Are you a Citizen?</h4>
            <ul className="list-unstyled mt-3 text-start d-inline-block">
              <li>✔ Create petition to raise your concerns.</li>
              <li>✔ Start polls on issues that matter to your community.</li>
              <li>✔ Support and sign petitions started by others.</li>
              <li>✔ Share your opinion and make your voice count.</li>
              <li>✔ Connect with others who care about the same issues.</li>
            </ul>
            <div className="mt-auto">
              <Link to="/signup" className="btn btn-primary">
                Join Now
              </Link>
            </div>
          </div>

          {/* Official */}
          <div className="col-md-5 mb-4">
            <FaLandmark size={50} className="text-success mb-3" />
            <h4>Are you a Public Official?</h4>
            <ul className="list-unstyled mt-3 text-start d-inline-block">
              <li>✔ View petitions and polls created by citizens.</li>
              <li>✔ Respond to public concerns with transparency.</li>
              <li>✔ Take action on the most pressing issues.</li>
              <li>✔ Build trust by engaging directly with the community.</li>
              <li>✔ Show updates and mark tasks as completed.</li>
            </ul>
            <div className="mt-auto">
              <Link to="/signup" className="btn btn-success">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mid1;