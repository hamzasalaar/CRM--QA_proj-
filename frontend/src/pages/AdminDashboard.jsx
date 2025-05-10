import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaClipboardList, FaCogs } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Welcome back, Admin 👋</h2>
        <p className="subtitle">Here's a quick overview of your platform.</p>
      </div>

      <div className="dashboard-cards">
        <Link to="/admin/users" className="card">
          <FaUsers className="card-icon" />
          <div className="card-info">
            <h3>Users</h3>
            <p>Manage all registered users</p>
          </div>
        </Link>

        <Link to="/admin/teams" className="card">
          <FaClipboardList className="card-icon" />
          <div className="card-info">
            <h3>Teams</h3>
            <p>View and assign teams</p>
          </div>
        </Link>

        <Link to="/admin/settings" className="card">
          <FaCogs className="card-icon" />
          <div className="card-info">
            <h3>Settings</h3>
            <p>Platform configuration</p>
          </div>
        </Link>
      </div>

      <style>{`
        .admin-dashboard {
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

        .dashboard-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .card {
          background: #fff;
          border: 1px solid #e3e6f0;
          border-radius: 12px;
          padding: 20px;
          text-decoration: none;
          color: #212529;
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
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .card-info p {
          margin: 0;
          font-size: 14px;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
}
