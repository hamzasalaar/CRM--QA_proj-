// filepath: c:\Users\it\Desktop\Devprac\CRM (QA_proj)\frontend\src\pages\UserDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const UserDashboard = () => {
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManagerDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/manager-details",
          { withCredentials: true }
        );
        setManager(response.data.manager);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Failed to fetch manager details"
        );
        toast.error(
          err.response?.data?.message || "Failed to fetch manager details"
        );
        setLoading(false);
      }
    };

    fetchManagerDetails();
  }, []);

  if (loading) {
    return <div>Loading manager details...</div>;
  }

  if (error) {
    return <div className="text-danger">Error: {error}</div>;
  }

  return (
    <div className="user-dashboard container my-4">
      <h2 className="text-center">User Dashboard</h2>
      {manager ? (
        <div className="manager-details mt-4">
          <h4>Manager Details</h4>
          <p>
            <strong>Name:</strong> {manager.name}
          </p>
          <p>
            <strong>Email:</strong> {manager.email}
          </p>
        </div>
      ) : (
        <p>No manager assigned.</p>
      )}
    </div>
  );
};

export default UserDashboard;
