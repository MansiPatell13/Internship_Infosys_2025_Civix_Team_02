import React, { useEffect, useState } from "react";
import './pollsfilter.css';
import { FaUserCircle } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosMail, IoIosAddCircleOutline } from "react-icons/io";
import Nav from "./navbar.jsx";
import Lbox from "./leftbox.jsx";
import Foot from "./footer.jsx";

function Polls() {
  const [user, setUser] = useState({ name: "", _id: "" });
  const [polls, setPolls] = useState([]);
  const [activeTab, setActiveTab] = useState("active"); // active, mine, closed
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal states
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Backend URL
  const backendUrl = "http://localhost:4000";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUser(u);
      } catch (e) {
        console.error("Error parsing stored user", e);
      }
    }
  }, []);

  useEffect(() => {
    if (user._id) {
      fetchPolls();
    }
  }, [activeTab, user._id]); // locationFilter removed here to avoid refetch on typing

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      let url = `${backendUrl}/api/polls/list`;
      const params = new URLSearchParams();

      if (activeTab === "mine") {
        params.append("createdBy", user._id);
      }
      params.append("limit", "50");

      url += `?${params.toString()}`;

      const resp = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`HTTP ${resp.status}: ${text}`);
      }

      const data = await resp.json();
      const fetchedPolls = data.polls || data;

      const today = new Date().toISOString().split("T")[0];

      let filtered = fetchedPolls;

      if (activeTab === "active") {
        filtered = filtered.filter((poll) => {
          const closesDate = new Date(poll.closesOn).toISOString().split("T")[0];
          return closesDate >= today;
        });
      } else if (activeTab === "closed") {
        filtered = filtered.filter((poll) => {
          const closesDate = new Date(poll.closesOn).toISOString().split("T")[0];
          return closesDate < today;
        });
      }

      setPolls(filtered);
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError(err.message || "Unknown error");
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  // Frontend location filter (case-insensitive partial match)
  const filteredPolls = polls.filter(poll =>
    poll.targetLocation?.toLowerCase().includes(locationFilter.trim().toLowerCase())
  );

  const clearFilters = () => {
    setLocationFilter("");
    setActiveTab("active");
  };

  return (
    <div className="polls-container" style={{ padding: 0, margin: 0 }}>
      <Nav />
      <div className="polls-main">
        <Lbox />
        <div className="polls-right">
          <div className="top">
            <div className="cr">
              <h1>Polls</h1>
              <button style={{
                backgroundColor: "#2c6e49",
                color: "white",
                border: "none",
                padding: "10px 14px",
                borderRadius: "5px",
                cursor: "pointer"
              }}>
                <IoIosAddCircleOutline style={{ verticalAlign: "middle", marginRight: "6px" }} />
                Create Poll
              </button>
            </div>
            <p>Participate in community polls and make your voice heard</p>
          </div>

          <div className="p">
            <div className="polls-list">
              <div className="one">
                <button
                  onClick={() => setActiveTab("active")}
                  className={activeTab === "active" ? "active-tab" : ""}
                >Active Polls</button>
                <button
                  onClick={() => setActiveTab("mine")}
                  className={activeTab === "mine" ? "active-tab" : ""}
                >My Polls</button>
                <button
                  onClick={() => setActiveTab("closed")}
                  className={activeTab === "closed" ? "active-tab" : ""}
                >Closed Polls</button>
              </div>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Location .."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                style={{ padding: "6px 8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </div>

            {loading ? (
              <p>Loading polls...</p>
            ) : error ? (
              <p className="error">Error: {error}</p>
            ) : filteredPolls.length === 0 ? (
              <>
                <p className="k">No polls found with current filters</p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button className="k" onClick={clearFilters} style={{
                    backgroundColor: "#2c6e49",
                    color: "white",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}>Clear Filters</button>
                </div>
              </>
            ) : (
              <div className="polls-display" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {filteredPolls.map((poll) => (
                  <div key={poll._id} className="poll-card" style={{
                    background: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    padding: "20px",
                    flex: "1 1 300px",
                    minWidth: "280px",
                  }}>
                    <h3 style={{ color: "#2c6e49", fontWeight: "bold" }}>{poll.title}</h3>
                    <p>{poll.description}</p>
                    <p><IoLocationSharp /> {poll.targetLocation}</p>
                    <p>
                      <FaUserCircle /> {poll.createdBy?.name || "Unknown"} &nbsp;
                      <IoIosMail /> {poll.createdBy?.email || "Unknown"}
                    </p>
                    <p>Closes on: {new Date(poll.closesOn).toLocaleDateString()}</p>
                    <button
                      onClick={() => {
                        setSelectedPoll(poll);
                        setIsModalOpen(true);
                      }}
                      style={{
                        backgroundColor: "#2c6e49",
                        color: "white",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "10px"
                      }}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ques">
            <h2>Have a question for your community?</h2>
            <p>Create a poll to gather input and understand public sentiment on local issues</p>
          </div>
        </div>
      </div>
      <Foot />

      {/* Modal for poll details */}
      {isModalOpen && selectedPoll && (
        <div
          className="modal-overlay"
          onClick={() => setIsModalOpen(false)}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
            }}
          >
            <h2>{selectedPoll.title}</h2>
            <p>{selectedPoll.description}</p>
            <p><strong>Location:</strong> {selectedPoll.targetLocation || "N/A"}</p>
            <p><strong>Created By:</strong> {selectedPoll.createdBy?.name || "Unknown"}</p>
            <p><strong>Email:</strong> {selectedPoll.createdBy?.email || "Unknown"}</p>
            <p><strong>Closes On:</strong> {new Date(selectedPoll.closesOn).toLocaleDateString()}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                marginTop: "20px",
                backgroundColor: "#2c6e49",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Polls;
