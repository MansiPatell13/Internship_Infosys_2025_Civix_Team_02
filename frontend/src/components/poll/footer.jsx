import React, { useEffect, useState } from "react";
import './pollsfilter.css';
import { Link } from "react-router-dom";
function Foot(){
    return(
        <div className="foot">
            <footer className="polls-footer">
                    <div className="polls-footer-container">
                      <div className="polls-footer-section polls-about">
                        <h4>About Civix</h4>
                        <p>
                          Civix empowers citizens to actively engage in local governance through petitions, polls,
                          and public feedback. Our mission is to create transparent and accountable communities by
                          giving everyone a voice.
                        </p>
                      </div>
                      <div className="polls-footer-section polls-links">
                        <h4>Quick Links</h4>
                        <Link to="/dashboard" className="polls-f1">Home</Link>
                        <Link to="/petitions" className="polls-f1">Petitions</Link>
                        <Link to="/pollsfilter" className="polls-f1">Polls</Link>
                        <Link to="/reports" className="polls-f1">Reports</Link>
                        <Link to="/settings" className="polls-f1">Settings</Link>
                        <Link to="/help" className="polls-f1">Help & Support</Link>
                      </div>
                    </div>
                    <div className="polls-footer-bottom">
                      <p>© 2025 Civix. All rights reserved.</p>
                    </div>
                  </footer>
        </div>
    );
}
export default Foot;