import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaTasks, FaChartBar, FaBell } from "react-icons/fa";

const ManagerDashboard = () => {
  const dashboardItems = [
    {
      title: "Team Management",
      description: "Manage team members and roles",
      icon: <FaUsers className="icon" />,
      link: "/manager/team",
    },
    {
      title: "Task Management",
      description: "Assign and monitor tasks",
      icon: <FaTasks className="icon" />,
      link: "/manager/tasks",
    },
    {
      title: "Reports",
      description: "View performance analytics",
      icon: <FaChartBar className="icon" />,
      link: "/manager/reports",
    },
    {
      title: "Notifications",
      description: "System alerts and updates",
      icon: <FaBell className="icon" />,
      link: "/manager/notifications",
    },
  ];

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 fw-semibold">Manager Dashboard</h2>
      <div className="row g-4">
        {dashboardItems.map((item, idx) => (
          <div className="col-md-6 col-lg-3" key={idx}>
            <Link to={item.link} className="text-decoration-none">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="icon-wrapper">{item.icon}</div>
                    <h5 className="mb-0 ms-2 fw-semibold">{item.title}</h5>
                  </div>
                  <p className="text-muted small">{item.description}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <style>{`
        .icon-wrapper {
          background-color: #f0f2f5;
          padding: 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon {
          color: #0ab3a3;
          font-size: 20px;
        }
        .card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transform: translateY(-2px);
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default ManagerDashboard;
