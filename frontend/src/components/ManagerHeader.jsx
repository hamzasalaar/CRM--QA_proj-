import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Logout } from "../redux/AuthSlice";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ManagerHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
      if (res.status === 200) {
        dispatch(Logout());
        toast.success("Logged out successfully");
        navigate("/login");
      }
    } catch (err) {
      toast.error("Logout failed");
      console.error(err);
    }
  };

  return (
    <header className="manager-header">
      <div className="header-container">
        <Link to="/manager" className="logo">
          Manager<span className="logo-text">Portal</span>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`nav ${menuOpen ? "active" : ""}`}>
          <Link to="/manager" className="nav-link">Dashboard</Link>
          <Link to="/manager/team" className="nav-link">Team Management</Link>
          <Link to="/manager/tasks" className="nav-link">Task Management</Link>
        </nav>

        <div className={`auth ${menuOpen ? "active" : ""}`}>
          <button onClick={handleLogout} className="logout">Logout</button>
        </div>
      </div>

      <style>{`
        .manager-header {
          background-color: #1c1e2e;
          padding: 15px 30px;
          color: white;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        .logo {
          font-size: 22px;
          text-decoration: none;
          color: #fff;
          font-weight: bold;
        }
        .logo-text {
          color: #0ab3a3;
        }
        .menu-toggle {
          display: none;
          background: none;
          color: white;
          font-size: 22px;
          border: none;
        }
        .nav, .auth {
          display: flex;
          gap: 20px;
        }
        .nav-link {
          color: white;
          text-decoration: none;
        }
        .nav-link:hover {
          color: #0ab3a3;
        }
        .logout {
          background-color: #0ab3a3;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 5px;
        }
        .logout:hover {
          background-color: #008080;
        }
        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }
          .nav, .auth {
            display: none;
            flex-direction: column;
            width: 100%;
          }
          .nav.active, .auth.active {
            display: flex;
            margin-top: 10px;
          }
        }
      `}</style>
    </header>
  );
}
