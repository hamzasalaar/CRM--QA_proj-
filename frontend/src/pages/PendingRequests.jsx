import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/manager/pending", {
        withCredentials: true,
      });
      setRequests(res.data.pendingRequests);
    } catch (err) {
      console.error("Failed to load requests", err);
    }
  };

  const handleAccept = async (userId) => {
    try {
      await axios.post(
        "http://localhost:3000/api/manager/accept-request",
        { userId },
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => r._id !== userId));
      toast.success("Request accepted");
    } catch (err) {
      console.error("Failed to accept request", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecline = async (userId) => {
    try {
      await axios.post(
        "http://localhost:3000/api/manager/decline-request",
        { userId },
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => r._id !== userId));
      toast.success("Request declined");
    } catch (err) {
      console.error("Failed to decline request", err);
    }
  };

  return (
    <div className="p-4">
      <h2>Pending Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul className="list-group">
          {requests.map((user) => (
            <li
              key={user._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                {user.name} ({user.email})
              </span>
              <div>
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleAccept(user._id)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDecline(user._id)}
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingRequests;
