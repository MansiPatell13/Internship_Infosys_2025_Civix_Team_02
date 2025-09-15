import React from "react";
import { useNavigate, Link } from "react-router-dom";
import img from "/emo_copy.jpg";
import Mid1 from "./Mid1";
import Navbar from "./Navbar";
import Mid2 from "./Mid2";
import { FaHouse } from "react-icons/fa6";
import Footer from "./Footer";

const Home = () => {
  const navigate = useNavigate();
  return (
      <>
       <Navbar/>
        
        <section className="heroSection py-5">
          <div className="container">
            <div className="row align-items-center">
              {/* left */}
              <div className="col-md-6 ">
                <h1 className="mb-3">Your Voice, Your Community</h1>
                <p className="mb-3">
                  Connect with your local government, Create impactful petition,
                  participate in meaningful polls and drive real change in your
                  community through democratic engagement.
                </p>
                <div className="mt-3">
                  <button
                    className="btn btn-success btn-lg me-3 mb-2 border-black"
                    onClick={() => navigate("/signup")}
                  >
                    Get Started
                  </button>
                  <button className="btn btn-light btn-lg mb-2 border-black">
                    Learn More
                  </button>
                </div>
              </div>

              {/* right */}
              <div className="col-md-6 mt-2">
                <div 
                  className="text-center p-5 rounded"
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

                  <div className="row mt-4">
                    <div className="col-4">
                      <h4>1000+</h4>
                      <small>Users</small>
                    </div>
                    <div className="col-4">
                        <h4>500+</h4>
                        <small>Petitions</small>
                    </div>
                    <div className="col-4">
                      <h4>50+</h4>
                      <small>Polls</small>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </section>

        <section className="sec2">
          <Mid1 />
        </section>

        <section>
          <Mid2/>
        </section>

        <Footer/>
      </>
  );
};

export default Home;