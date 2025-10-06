import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import styles from "./PollDetail.module.css";
import { useNavigate } from "react-router-dom";

const PollDetail = ({ pollId, onBack, onVoteSuccess }) => {
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState("");

  const fetchPoll = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/polls/${pollId}`, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      });
      if (!res.ok) throw new Error("Failed to fetch poll");
      const data = await res.json();
      setPoll(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPoll(); }, [pollId]);

  const handleVote = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/polls/${pollId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ selectedOption }),
      });
      if (!res.ok) throw new Error("Failed to vote");
      await res.json();
      setHasVoted(true);
      if (onVoteSuccess) onVoteSuccess();
      fetchPoll();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading poll...</p>;
  if (error) return <p>{error}</p>;
  if (!poll) return <p>No poll found</p>;

  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <button onClick={navigate(-1)}><FaArrowLeft /> Back</button>
      <h1>{poll.title}</h1>
      <p>{poll.description}</p>
      {poll.options.map((opt, i) => (
        <div key={i}>
          <label>
            <input type="radio" name="vote" value={i} onChange={() => setSelectedOption(i)} disabled={hasVoted} />
            {opt.text}
          </label>
        </div>
      ))}
      {!hasVoted && <button onClick={handleVote}>Vote</button>}
      {hasVoted && <p><FaCheckCircle /> Your vote has been recorded</p>}
    </div>
  );
};

export default PollDetail;