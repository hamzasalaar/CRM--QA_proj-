import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaUserTie, FaEnvelope } from "react-icons/fa";

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
        const msg = err.response?.data?.message || "Failed to fetch manager details";
        toast.error(msg);
        setError(msg);
        setLoading(false);
      }
    };

    fetchManagerDetails();
  }, []);

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h2>Hello, User 👋</h2>
        <p className="subtitle">Here’s an overview of your manager and profile.</p>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="status">Loading manager details...</div>
        ) : error ? (
          <div className="status error">Error: {error}</div>
        ) : (
          <div className="card">
            <FaUserTie className="card-icon" />
            <div className="card-info">
              <h3>Manager Assigned</h3>
              <p>
                <strong>Name:</strong> {manager.name}
              </p>
              <p>
                <strong>Email:</strong> {manager.email}
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .user-dashboard {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header h2 {
          font-size: 28px;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #6c757d;
          margin-bottom: 2rem;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .status {
          font-size: 16px;
          color: #333;
        }

        .status.error {
          color: red;
        }

        .card {
          background: #fff;
          border: 1px solid #e3e6f0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .card-icon {
          font-size: 32px;
          margin-right: 15px;
          color: #0ab3a3;
        }

        .card-info h3 {
          margin: 0 0 10px;
          font-size: 18px;
          font-weight: 600;
        }

        .card-info p {
          margin: 4px 0;
          font-size: 14px;
          color: #495057;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
